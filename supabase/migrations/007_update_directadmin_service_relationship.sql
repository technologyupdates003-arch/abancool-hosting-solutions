-- Update DirectAdmin accounts table to properly link with services
ALTER TABLE directadmin_accounts 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_directadmin_accounts_service_id ON directadmin_accounts(service_id);

-- Update existing DirectAdmin accounts to link with services where possible
-- This is a one-time update for existing data
UPDATE directadmin_accounts 
SET service_id = (
    SELECT s.id 
    FROM services s 
    WHERE s.user_id = directadmin_accounts.user_id 
    AND s.domain = directadmin_accounts.domain
    LIMIT 1
)
WHERE service_id IS NULL;

-- Add RLS policy for service-based access
CREATE POLICY "Users can view DirectAdmin accounts for their services" ON directadmin_accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM services 
            WHERE id = service_id 
            AND user_id = auth.uid()
        )
    );

-- Update hosting plans table to include monthly pricing for different billing cycles
ALTER TABLE hosting_plans 
ADD COLUMN IF NOT EXISTS monthly_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS quarterly_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS annual_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS biennial_price DECIMAL(10,2);

-- Update existing hosting plans with pricing
UPDATE hosting_plans SET 
    monthly_price = price,
    quarterly_price = price * 3 * 0.95, -- 5% discount
    annual_price = price * 12 * 0.85,   -- 15% discount
    biennial_price = price * 24 * 0.75  -- 25% discount
WHERE monthly_price IS NULL;

-- Create sample services for testing (only if no services exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
        -- Insert sample services for existing users
        INSERT INTO services (user_id, plan_id, domain, status, billing_cycle, next_due_date)
        SELECT 
            u.id,
            hp.id,
            'example' || floor(random() * 1000) || '.com',
            'active'::service_status,
            'monthly',
            NOW() + INTERVAL '1 month'
        FROM auth.users u
        CROSS JOIN (SELECT id FROM hosting_plans WHERE name LIKE '%Starter%' LIMIT 1) hp
        WHERE EXISTS (SELECT 1 FROM hosting_plans)
        LIMIT 5; -- Only create 5 sample services
    END IF;
END $$;

-- Create sample DirectAdmin accounts for existing services
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM directadmin_accounts LIMIT 1) THEN
        INSERT INTO directadmin_accounts (user_id, service_id, username, domain, package_name, server_ip, status)
        SELECT 
            s.user_id,
            s.id,
            'user' || floor(random() * 1000),
            s.domain,
            'starter_package',
            '197.248.184.158',
            'active'
        FROM services s
        WHERE s.status = 'active'
        LIMIT 5;
    END IF;
END $$;