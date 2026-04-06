-- Add admin-related columns to profiles table
-- This migration adds role and is_admin columns to support admin functionality

-- Add role column with default 'user'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add is_admin column with default false
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- Update RLS policies to allow admin access
-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all services
CREATE POLICY "Admins can view all services" ON services 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can update all services
CREATE POLICY "Admins can update all services" ON services 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all orders
CREATE POLICY "Admins can view all orders" ON orders 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can update all orders
CREATE POLICY "Admins can update all orders" ON orders 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all support tickets
CREATE POLICY "Admins can view all tickets" ON support_tickets 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can update all support tickets
CREATE POLICY "Admins can update all tickets" ON support_tickets 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all invoices
CREATE POLICY "Admins can view all invoices" ON invoices 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can manage hosting plans
CREATE POLICY "Admins can manage hosting plans" ON hosting_plans 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all payments
CREATE POLICY "Admins can view all payments" ON payments 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all email history
CREATE POLICY "Admins can view all email history" ON email_history 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can manage blocked IPs
CREATE POLICY "Admins can manage blocked IPs" ON blocked_ips 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can view all domains
CREATE POLICY "Admins can view all domains" ON domains 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Admin users can update all domains
CREATE POLICY "Admins can update all domains" ON domains 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

COMMENT ON COLUMN profiles.role IS 'User role: user, admin, moderator, etc.';
COMMENT ON COLUMN profiles.is_admin IS 'Quick boolean check for admin privileges';