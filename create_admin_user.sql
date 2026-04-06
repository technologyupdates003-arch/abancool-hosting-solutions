-- Create Admin User for Abancool Hosting Solutions
-- This script creates an admin user with full privileges

-- First, let's create the admin user in auth.users table
-- Note: In production, you would typically create this through Supabase Auth API
-- This is a direct database insert for development/testing purposes

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin-user-id-12345678-1234-1234-1234-123456789012',
    'authenticated',
    'authenticated',
    'admin@abancool.com',
    '$2a$10$8K1p/a0dhrxSHxN2LOjOe.K8.WvJ.BfW5o45JfCd.6N2nXz1.2.3.', -- Password: Admin@123
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "System", "last_name": "Administrator", "role": "admin"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Create the admin profile
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    company,
    address,
    city,
    state,
    postcode,
    country,
    role,
    is_admin,
    credit_balance,
    support_pin,
    created_at,
    updated_at
) VALUES (
    'admin-user-id-12345678-1234-1234-1234-123456789012',
    'admin@abancool.com',
    'System',
    'Administrator',
    '+254700000000',
    'Abancool Technology',
    'Tech Hub, Nairobi',
    'Nairobi',
    'Nairobi County',
    '00100',
    'Kenya',
    'admin',
    true,
    0.00,
    '999999',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_admin = true,
    updated_at = NOW();

-- Alternative: Create admin user using Supabase Auth (recommended for production)
-- You can also create the admin user through the Supabase dashboard or using the Auth API

-- Admin Login Credentials:
-- Email: admin@abancool.com
-- Password: Admin@123
-- Role: admin
-- Support PIN: 999999

-- Note: The encrypted password above is a bcrypt hash of "Admin@123"
-- In production, you should:
-- 1. Use Supabase Auth API to create the user
-- 2. Use a stronger password
-- 3. Enable 2FA for admin accounts
-- 4. Regularly rotate admin credentials