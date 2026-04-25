
-- Create a table for portfolio configuration (GitHub username, etc.)
CREATE TABLE public.portfolio_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for project overrides (admin customizations per GitHub repo)
CREATE TABLE public.project_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_name TEXT NOT NULL UNIQUE,
  custom_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_overrides ENABLE ROW LEVEL SECURITY;

-- Public read access for both tables (portfolio is public)
CREATE POLICY "Anyone can read portfolio config"
  ON public.portfolio_config FOR SELECT USING (true);

CREATE POLICY "Anyone can read project overrides"
  ON public.project_overrides FOR SELECT USING (true);

-- Only authenticated users can modify (admin)
CREATE POLICY "Authenticated users can insert portfolio config"
  ON public.portfolio_config FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio config"
  ON public.portfolio_config FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert project overrides"
  ON public.project_overrides FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update project overrides"
  ON public.project_overrides FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete project overrides"
  ON public.project_overrides FOR DELETE TO authenticated USING (true);

-- Insert default GitHub username config
INSERT INTO public.portfolio_config (key, value) VALUES ('github_username', 'octocat');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolio_config_updated_at
  BEFORE UPDATE ON public.portfolio_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_overrides_updated_at
  BEFORE UPDATE ON public.project_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
