-- Admin CRUD on hosting_plans
CREATE POLICY "Admins can insert hosting_plans" ON public.hosting_plans FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hosting_plans" ON public.hosting_plans FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hosting_plans" ON public.hosting_plans FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Admin CRUD on directadmin_servers
CREATE POLICY "Admins can insert directadmin_servers" ON public.directadmin_servers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update directadmin_servers" ON public.directadmin_servers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete directadmin_servers" ON public.directadmin_servers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all directadmin_servers" ON public.directadmin_servers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));