-- Create orders table (enhanced version)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_number TEXT UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0'),
    items JSONB NOT NULL DEFAULT '[]',
    domain_option JSONB,
    payment_method TEXT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    promo_code TEXT,
    discount_percentage INTEGER,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table for better normalization
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'hosting', 'domain', 'addon'
    plan_id UUID REFERENCES hosting_plans(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    billing_cycle TEXT,
    domain TEXT,
    features JSONB DEFAULT '[]',
    setup_fee DECIMAL(10,2) DEFAULT 0,
    renewal_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_sessions table for persistent carts
CREATE TABLE cart_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT, -- For anonymous users
    items JSONB NOT NULL DEFAULT '[]',
    promo_code TEXT,
    discount_percentage INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo_codes table
CREATE TABLE promo_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applicable_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    transaction_id TEXT UNIQUE,
    payment_method TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    status payment_status DEFAULT 'pending',
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create domain_registrations table
CREATE TABLE domain_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    domain_name TEXT NOT NULL,
    tld TEXT NOT NULL,
    registration_period INTEGER DEFAULT 1,
    auto_renew BOOLEAN DEFAULT true,
    nameservers TEXT[] DEFAULT '{}',
    status domain_status DEFAULT 'pending',
    registered_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_provisioning table
CREATE TABLE service_provisioning (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES hosting_plans(id) ON DELETE SET NULL,
    domain TEXT,
    status TEXT DEFAULT 'pending', -- pending, provisioning, active, suspended, cancelled
    provisioning_data JSONB,
    provisioned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_plan_id ON order_items(plan_id);
CREATE INDEX idx_cart_sessions_user_id ON cart_sessions(user_id);
CREATE INDEX idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_domain_registrations_user_id ON domain_registrations(user_id);
CREATE INDEX idx_domain_registrations_domain ON domain_registrations(domain_name);
CREATE INDEX idx_service_provisioning_order_id ON service_provisioning(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_provisioning ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

-- Cart sessions policies
CREATE POLICY "Users can manage own cart sessions" ON cart_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Promo codes policies (public read for active codes)
CREATE POLICY "Public read access to active promo codes" ON promo_codes
    FOR SELECT USING (is_active = true);

-- Payment transactions policies
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create payment transactions" ON payment_transactions
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

-- Domain registrations policies
CREATE POLICY "Users can view own domain registrations" ON domain_registrations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create domain registrations" ON domain_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service provisioning policies
CREATE POLICY "Users can view own service provisioning" ON service_provisioning
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
    );

-- Add triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_sessions_updated_at BEFORE UPDATE ON cart_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domain_registrations_updated_at BEFORE UPDATE ON domain_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_provisioning_updated_at BEFORE UPDATE ON service_provisioning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, usage_limit, valid_until) VALUES
('KENYA_50%OFF_2025', '50% off for Kenya customers - New Year 2025', 'percentage', 50.00, 500.00, 1000, '2025-12-31 23:59:59+00'),
('WELCOME10', '10% off for new customers', 'percentage', 10.00, 100.00, NULL, '2025-12-31 23:59:59+00'),
('SAVE20', '20% off on all hosting plans', 'percentage', 20.00, 200.00, 500, '2025-06-30 23:59:59+00'),
('HOSTING100', 'KSh 100 off on hosting plans', 'fixed', 100.00, 500.00, 200, '2025-12-31 23:59:59+00');

-- Function to automatically create services after successful order
CREATE OR REPLACE FUNCTION create_services_from_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create services when order status changes to completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Insert services for hosting items
        INSERT INTO services (user_id, plan_id, domain, status, billing_cycle, next_due_date)
        SELECT 
            NEW.user_id,
            (item->>'planId')::UUID,
            COALESCE(item->>'domain', 'pending-setup.abancool.com'),
            'pending'::service_status,
            item->>'billingCycle',
            CASE 
                WHEN item->>'billingCycle' = 'monthly' THEN NOW() + INTERVAL '1 month'
                WHEN item->>'billingCycle' = 'quarterly' THEN NOW() + INTERVAL '3 months'
                WHEN item->>'billingCycle' = 'annually' THEN NOW() + INTERVAL '1 year'
                WHEN item->>'billingCycle' = 'biennial' THEN NOW() + INTERVAL '2 years'
                ELSE NOW() + INTERVAL '1 month'
            END
        FROM jsonb_array_elements(NEW.items) AS item
        WHERE item->>'type' = 'hosting';

        -- Create domain registrations for domain items
        INSERT INTO domain_registrations (user_id, order_id, domain_name, tld, expires_at)
        SELECT 
            NEW.user_id,
            NEW.id,
            split_part(item->>'domain', '.', 1),
            '.' || array_to_string(string_to_array(item->>'domain', '.')[2:], '.'),
            NOW() + INTERVAL '1 year'
        FROM jsonb_array_elements(NEW.items) AS item
        WHERE item->>'type' = 'domain';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic service creation
CREATE TRIGGER create_services_on_order_completion
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION create_services_from_order();