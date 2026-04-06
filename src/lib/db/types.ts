export type ProjectStatus = 'new' | 'in_progress' | 'completed';

export type BuildingType = 'single_family' | 'two_family' | 'multi_family' | 'commercial';

export type PhotoCategory = 'facade' | 'roof' | 'basement' | 'heating' | 'windows' | 'other';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  cert_number: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  berater_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_notes: string | null;
  address: string;
  city: string;
  postal_code: string;
  status: ProjectStatus;
  appointment_date: string | null;
  inspection_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  project_id: string;
  building_type: BuildingType | null;
  year_built: number | null;
  living_area: number | null;
  floors: number | null;
  has_basement: boolean;
  // Envelope
  facade_material: string | null;
  facade_insulated: boolean;
  facade_insulation_thickness: number | null;
  roof_type: string | null;
  roof_insulated: boolean;
  basement_ceiling_insulated: boolean;
  // Heating
  heating_type: string | null;
  heating_year: number | null;
  heating_fuel: string | null;
  hot_water_type: string | null;
  has_solar_thermal: boolean;
  // Windows
  window_type: string | null;
  window_frame_material: string | null;
  window_g_value: number | null;
  window_u_value: number | null;
  // Ventilation
  ventilation_type: string | null;
  has_heat_recovery: boolean;
  // Notes
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectPhoto {
  id: string;
  project_id: string;
  building_id: string | null;
  category: PhotoCategory;
  file_path: string;
  description: string | null;
  created_at: string;
}

export interface ProjectWithBuilding extends Project {
  buildings: Building[] | null;
}
