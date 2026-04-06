-- =============================================================================
-- Welle 4 Completion — P1, P5, P8
-- Adds contact/date fields to projects and cert_number to profiles
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Projects: customer_phone, customer_notes, appointment_date, inspection_date
-- ---------------------------------------------------------------------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS customer_phone    TEXT,
  ADD COLUMN IF NOT EXISTS customer_notes    TEXT,
  ADD COLUMN IF NOT EXISTS appointment_date  DATE,
  ADD COLUMN IF NOT EXISTS inspection_date   DATE;

-- ---------------------------------------------------------------------------
-- Profiles: cert_number (EEE/BAFA Listennummer)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cert_number TEXT;
