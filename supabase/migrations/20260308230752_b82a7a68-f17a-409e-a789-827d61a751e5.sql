
-- Tighten write policies: use a role-based approach
-- Create admin role type
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Drop old permissive policies
DROP POLICY "Authenticated users can insert portfolio config" ON public.portfolio_config;
DROP POLICY "Authenticated users can update portfolio config" ON public.portfolio_config;
DROP POLICY "Authenticated users can insert project overrides" ON public.project_overrides;
DROP POLICY "Authenticated users can update project overrides" ON public.project_overrides;
DROP POLICY "Authenticated users can delete project overrides" ON public.project_overrides;

-- Create admin-only policies
CREATE POLICY "Admins can insert portfolio config"
  ON public.portfolio_config FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio config"
  ON public.portfolio_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert project overrides"
  ON public.project_overrides FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project overrides"
  ON public.project_overrides FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project overrides"
  ON public.project_overrides FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles: only admins can read/write
CREATE POLICY "Anyone can read roles"
  ON public.user_roles FOR SELECT USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
