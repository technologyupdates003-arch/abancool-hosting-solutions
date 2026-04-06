-- Function to setup admin profile for existing auth user
-- PREREQUISITE: Run add_admin_columns.sql first to add role and is_admin columns

CREATE OR REPLACE FUNCTION setup_admin_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
    -- Insert or update the admin profile
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
        user_id,
        user_email,
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
        
    RAISE NOTICE 'Admin profile setup completed for user: %', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION setup_admin_profile(UUID, TEXT) TO authenticated;

-- Example usage after creating admin user in Supabase Auth:
-- SELECT setup_admin_profile('USER_ID_FROM_SUPABASE_AUTH', 'admin@abancool.com');

-- Admin Login Credentials:
-- Email: admin@abancool.com  
-- Password: Admin@123
-- Role: admin
-- Support PIN: 999999

-- Instructions:
-- 1. Run add_admin_columns.sql first (adds role and is_admin columns)
-- 2. Create user in Supabase Dashboard (Authentication > Users)
-- 3. Copy the user ID from the dashboard
-- 4. Run: SELECT setup_admin_profile('COPIED_USER_ID', 'admin@abancool.com');