-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE service_status AS ENUM ('active', 'suspended', 'cancelled', 'pending');
CREATE TYPE domain_status AS ENUM ('active', 'expired', 'pending', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('paid', 'unpaid', 'cancelled', 'refunded');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'declined', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    company TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postcode TEXT,
    country TEXT DEFAULT 'Kenya',
    credit_balance DECIMAL(10,2) DEFAULT 0.00,
    support_pin TEXT DEFAULT LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
    sso_enabled BOOLEAN DEFAULT true,
    email_preferences JSONB DEFAULT '{"general": false, "invoice": false, "support": false, "product": false, "domain": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_invitations table
CREATE TABLE user_invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    permissions TEXT DEFAULT 'all',
    status TEXT DEFAULT 'pending',
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosting_plans table
CREATE TABLE hosting_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES hosting_plans(id) ON DELETE CASCADE NOT NULL,
    domain TEXT,
    status service_status DEFAULT 'pending',
    billing_cycle TEXT DEFAULT 'monthly',
    next_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create domains table
CREATE TABLE domains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    domain_name TEXT NOT NULL UNIQUE,
    status domain_status DEFAULT 'pending',
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_number TEXT UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0'),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    department TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket_replies table
CREATE TABLE ticket_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_staff_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES hosting_plans(id) ON DELETE CASCADE NOT NULL,
    domain TEXT,
    billing_cycle TEXT DEFAULT 'monthly',
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number TEXT UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0'),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    status invoice_status DEFAULT 'unpaid',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_number TEXT UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0'),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    status quote_status DEFAULT 'draft',
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KSh',
    payment_method TEXT NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_accounts table
CREATE TABLE affiliate_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    affiliate_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_history table
CREATE TABLE email_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    email_type TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked_ips table
CREATE TABLE blocked_ips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_address INET NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unblocked_at TIMESTAMP WITH TIME ZONE,
    is_blocked BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_status ON domains(status);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_number ON support_tickets(ticket_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_hosting_plans_category ON hosting_plans(category);
CREATE INDEX idx_hosting_plans_active ON hosting_plans(is_active);
CREATE INDEX idx_email_history_user_id ON email_history(user_id);
CREATE INDEX idx_blocked_ips_address ON blocked_ips(ip_address);
CREATE INDEX idx_blocked_ips_blocked ON blocked_ips(is_blocked);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User invitations policies
CREATE POLICY "Users can view own invitations" ON user_invitations FOR SELECT USING (auth.uid() = inviter_id);
CREATE POLICY "Users can create invitations" ON user_invitations FOR INSERT WITH CHECK (auth.uid() = inviter_id);

-- Services policies
CREATE POLICY "Users can view own services" ON services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own services" ON services FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Domains policies
CREATE POLICY "Users can view own domains" ON domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own domains" ON domains FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Ticket replies policies
CREATE POLICY "Users can view replies to own tickets" ON ticket_replies FOR SELECT USING (
    EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid())
);
CREATE POLICY "Users can reply to own tickets" ON ticket_replies FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Affiliate accounts policies
CREATE POLICY "Users can view own affiliate account" ON affiliate_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own affiliate account" ON affiliate_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own affiliate account" ON affiliate_accounts FOR UPDATE USING (auth.uid() = user_id);

-- Email history policies
CREATE POLICY "Users can view own email history" ON email_history FOR SELECT USING (auth.uid() = user_id);

-- Blocked IPs policies (admin only for now)
CREATE POLICY "Users can view blocked IPs" ON blocked_ips FOR SELECT USING (true);

-- Hosting plans policies (public read access)
CREATE POLICY "Anyone can view active hosting plans" ON hosting_plans FOR SELECT USING (is_active = true);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hosting_plans_updated_at BEFORE UPDATE ON hosting_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliate_accounts_updated_at BEFORE UPDATE ON affiliate_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Create domain TLDs table for pricing
CREATE TABLE IF NOT EXISTS domain_tlds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tld TEXT NOT NULL UNIQUE,
    price_usd DECIMAL(10,2) NOT NULL,
    price_kes DECIMAL(10,2) NOT NULL,
    price_zar DECIMAL(10,2) NOT NULL,
    registration_period INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_domain_tlds_active ON domain_tlds(is_active) WHERE is_active = true;

-- Add RLS policies
ALTER TABLE domain_tlds ENABLE ROW LEVEL SECURITY;

-- Allow public read access to TLD pricing
CREATE POLICY "Allow public read access to domain TLDs" ON domain_tlds
    FOR SELECT USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_domain_tlds_updated_at BEFORE UPDATE ON domain_tlds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();