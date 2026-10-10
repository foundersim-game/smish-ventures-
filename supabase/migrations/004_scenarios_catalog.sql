-- ==============================================================================
-- CHAOS — Migration 004: Scenarios Catalog & Remote Content Drops
-- Enables dynamic, OTA (Over-The-Air) weekly scenario drops without App Store or Play Store updates.
-- ==============================================================================

-- 1. Create Scenarios Catalog Table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'friends',
  data JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  release_week INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for fast retrieval by release week
CREATE INDEX IF NOT EXISTS idx_scenarios_active_release 
  ON public.scenarios(is_active, release_week DESC);

-- 3. Automatic Updated At Trigger
DROP TRIGGER IF EXISTS trigger_scenarios_updated_at ON public.scenarios;
CREATE TRIGGER trigger_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. Row-Level Security (RLS) Policies
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Allow players/apps to query active scenarios publicly
DROP POLICY IF EXISTS "Public Read Active Scenarios" ON public.scenarios;
CREATE POLICY "Public Read Active Scenarios" 
  ON public.scenarios FOR SELECT 
  USING (is_active = true);

-- Allow backend service role to insert, update, or deactivate scenarios
DROP POLICY IF EXISTS "Service Role Manage Scenarios" ON public.scenarios;
CREATE POLICY "Service Role Manage Scenarios" 
  ON public.scenarios FOR ALL 
  USING (true)
  WITH CHECK (true);

-- 5. Grant Privileges to Supabase Roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.scenarios TO anon, authenticated, service_role;
