-- =============================================================================
-- Energieberater App – Initial Schema
-- Welle 4 | KW14 April 2026
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name      TEXT,
  email     TEXT,
  phone     TEXT,
  company   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  berater_id     UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  customer_name  TEXT        NOT NULL,
  customer_email TEXT,
  address        TEXT        NOT NULL,
  city           TEXT        NOT NULL,
  postal_code    TEXT        NOT NULL,
  status         TEXT        DEFAULT 'new'
                             CHECK (status IN ('new', 'in_progress', 'completed')) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Buildings (GEG inspection data — 1 building per project for Welle 4)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buildings (
  id                           UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id                   UUID    REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,

  -- Building basics
  building_type                TEXT    CHECK (building_type IN ('single_family','two_family','multi_family','commercial')),
  year_built                   INTEGER,
  living_area                  NUMERIC(10,2),
  floors                       INTEGER,
  has_basement                 BOOLEAN DEFAULT false,

  -- Building envelope
  facade_material              TEXT,
  facade_insulated             BOOLEAN DEFAULT false,
  facade_insulation_thickness  INTEGER,
  roof_type                    TEXT,
  roof_insulated               BOOLEAN DEFAULT false,
  basement_ceiling_insulated   BOOLEAN DEFAULT false,

  -- Heating & hot water
  heating_type                 TEXT,
  heating_year                 INTEGER,
  heating_fuel                 TEXT,
  hot_water_type               TEXT,
  has_solar_thermal            BOOLEAN DEFAULT false,

  -- Windows
  window_type                  TEXT,
  window_frame_material        TEXT,
  window_g_value               NUMERIC(4,2),
  window_u_value               NUMERIC(4,2),

  -- Ventilation
  ventilation_type             TEXT,
  has_heat_recovery            BOOLEAN DEFAULT false,

  -- Notes
  notes                        TEXT,

  created_at                   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at                   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Project Photos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_photos (
  id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id  UUID    REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  building_id UUID    REFERENCES public.buildings(id) ON DELETE SET NULL,
  category    TEXT    DEFAULT 'other'
              CHECK (category IN ('facade','roof','basement','heating','windows','other')) NOT NULL,
  file_path   TEXT    NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects
CREATE POLICY "projects_select_own"  ON public.projects FOR SELECT USING (auth.uid() = berater_id);
CREATE POLICY "projects_insert_own"  ON public.projects FOR INSERT WITH CHECK (auth.uid() = berater_id);
CREATE POLICY "projects_update_own"  ON public.projects FOR UPDATE USING (auth.uid() = berater_id);
CREATE POLICY "projects_delete_own"  ON public.projects FOR DELETE USING (auth.uid() = berater_id);

-- Buildings (accessible if user owns the parent project)
CREATE POLICY "buildings_select_own" ON public.buildings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = buildings.project_id AND projects.berater_id = auth.uid())
);
CREATE POLICY "buildings_insert_own" ON public.buildings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = buildings.project_id AND projects.berater_id = auth.uid())
);
CREATE POLICY "buildings_update_own" ON public.buildings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = buildings.project_id AND projects.berater_id = auth.uid())
);
CREATE POLICY "buildings_delete_own" ON public.buildings FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = buildings.project_id AND projects.berater_id = auth.uid())
);

-- Photos
CREATE POLICY "photos_select_own" ON public.project_photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_photos.project_id AND projects.berater_id = auth.uid())
);
CREATE POLICY "photos_insert_own" ON public.project_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_photos.project_id AND projects.berater_id = auth.uid())
);
CREATE POLICY "photos_delete_own" ON public.project_photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_photos.project_id AND projects.berater_id = auth.uid())
);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON public.buildings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- Storage bucket for project photos
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-photos', 'project-photos', false)
ON CONFLICT DO NOTHING;

-- Storage RLS: files stored under {user_id}/{project_id}/...
CREATE POLICY "storage_insert_own" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "storage_select_own" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "storage_delete_own" ON storage.objects FOR DELETE USING (
  bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]
);
