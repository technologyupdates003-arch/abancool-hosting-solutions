-- Setup Admin Profile for Abancool Hosting Solutions
-- STEP 1: First run add_admin_columns.sql to add role and is_admin columns
-- STEP 2: Create admin user through Supabase Dashboard
-- STEP 3: Run this script with the correct user ID

-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@abancool.com
-- 4. Password: Admin@123
-- 5. Auto Confirm User: Yes
-- 6. Copy the generated User ID
-- 7. Replace the UUID below and run this script

-- Update or insert admin profile (replace the UUID with the actual user ID from Supabase Auth)
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
    -- REPLACE THIS UUID WITH THE ACTUAL USER ID FROM SUPABASE AUTH
    '00000000-0000-0000-0000-000000000000',
    'admin@abancool.com',
    'System',
    'Administrator',
    '+254700000000',
    'Abancool Technology',
    'Tech Hub, Innovation Street',
    'Nairobi',
    'Nairobi County',
    '00100',
    'Kenya',
    'admin',
    true,
    10000.00,
    '999999',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_admin = true,
    first_name = 'System',
    last_name = 'Administrator',
    company = 'Abancool Technology',
    phone = '+254700000000',
    support_pin = '999999',
    credit_balance = GREATEST(profiles.credit_balance, 10000.00),
    updated_at = NOW();

-- Verify admin user was created
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_admin,
    credit_balance,
    support_pin
FROM profiles 
WHERE email = 'admin@abancool.com';

-- Admin Login Credentials:
-- Email: admin@abancool.com
-- Password: Admin@123
-- Role: admin
-- Support PIN: 999999