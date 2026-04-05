-- Create domain TLDs table for pricing
CREATE TABLE IF NOT EXISTS domain_tlds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tld TEXT NOT NULL UNIQUE,
    price_usd DECIMAL(10,2) NOT NULL,
    price_kes DECIMAL(10,2) NOT NULL,
    price_zar DECIMAL(10,2) NOT NULL,
    registration_period INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert TLD pricing data
INSERT INTO domain_tlds (tld, price_usd, price_kes, price_zar, registration_period, is_active) VALUES
('.com', 12.99, 1950.00, 240.00, 1, true),
('.co.ke', 4.99, 750.00, 92.00, 1, true),
('.africa', 11.99, 1800.00, 220.00, 1, true),
('.online', 2.99, 450.00, 55.00, 1, true),
('.ke', 29.99, 4500.00, 550.00, 1, true),
('.org', 14.99, 2250.00, 275.00, 1, true),
('.net', 13.99, 2100.00, 257.00, 1, true),
('.info', 8.99, 1350.00, 165.00, 1, true),
('.biz', 9.99, 1500.00, 183.00, 1, true),
('.co', 32.99, 4950.00, 605.00, 1, true);

-- Create index for faster lookups
CREATE INDEX idx_domain_tlds_active ON domain_tlds(is_active) WHERE is_active = true;

-- Add RLS policies
ALTER TABLE domain_tlds ENABLE ROW LEVEL SECURITY;

-- Allow public read access to TLD pricing
CREATE POLICY "Allow public read access to domain TLDs" ON domain_tlds
    FOR SELECT USING (true);