-- Create news articles table
CREATE TABLE news_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support categories table
CREATE TABLE support_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge base articles table
CREATE TABLE kb_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category_id UUID REFERENCES support_categories(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create abuse reports table
CREATE TABLE abuse_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_email TEXT NOT NULL,
    report_type TEXT NOT NULL,
    domain_url TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT,
    contact_info TEXT,
    status TEXT DEFAULT 'pending',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system status table
CREATE TABLE system_status (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'operational', -- operational, degraded, outage
    description TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create status incidents table
CREATE TABLE status_incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'investigating', -- investigating, identified, monitoring, resolved
    severity TEXT NOT NULL DEFAULT 'minor', -- minor, major, critical
    affected_services TEXT[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incident updates table
CREATE TABLE incident_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_id UUID REFERENCES status_incidents(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reseller applications table
CREATE TABLE reseller_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    business_type TEXT NOT NULL,
    expected_clients INTEGER,
    experience_level TEXT NOT NULL,
    marketing_plan TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{"news": true, "updates": true, "promotions": false}'
);

-- Create contact messages table
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'new', -- new, in_progress, resolved
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_news_articles_published ON news_articles(published, published_at DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_featured ON news_articles(featured) WHERE featured = true;
CREATE INDEX idx_kb_articles_category ON kb_articles(category_id);
CREATE INDEX idx_kb_articles_published ON kb_articles(is_published) WHERE is_published = true;
CREATE INDEX idx_abuse_reports_status ON abuse_reports(status);
CREATE INDEX idx_system_status_service ON system_status(service_name);
CREATE INDEX idx_status_incidents_status ON status_incidents(status);
CREATE INDEX idx_reseller_applications_status ON reseller_applications(status);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active) WHERE is_active = true;
CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- News articles - public read access for published articles
CREATE POLICY "Public read access to published news" ON news_articles
    FOR SELECT USING (published = true);

-- Support categories - public read access
CREATE POLICY "Public read access to support categories" ON support_categories
    FOR SELECT USING (is_active = true);

-- KB articles - public read access for published articles
CREATE POLICY "Public read access to published KB articles" ON kb_articles
    FOR SELECT USING (is_published = true);

-- Abuse reports - users can create reports
CREATE POLICY "Anyone can create abuse reports" ON abuse_reports
    FOR INSERT WITH CHECK (true);

-- System status - public read access
CREATE POLICY "Public read access to system status" ON system_status
    FOR SELECT USING (true);

-- Status incidents - public read access
CREATE POLICY "Public read access to status incidents" ON status_incidents
    FOR SELECT USING (true);

-- Incident updates - public read access
CREATE POLICY "Public read access to incident updates" ON incident_updates
    FOR SELECT USING (true);

-- Reseller applications - users can create and view own applications
CREATE POLICY "Users can create reseller applications" ON reseller_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reseller applications" ON reseller_applications
    FOR SELECT USING (auth.uid() = user_id);

-- Newsletter subscriptions - anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own subscription" ON newsletter_subscriptions
    FOR UPDATE USING (true);

-- Contact messages - anyone can create
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_categories_updated_at BEFORE UPDATE ON support_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kb_articles_updated_at BEFORE UPDATE ON kb_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_abuse_reports_updated_at BEFORE UPDATE ON abuse_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_status_incidents_updated_at BEFORE UPDATE ON status_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reseller_applications_updated_at BEFORE UPDATE ON reseller_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO support_categories (name, description, icon, sort_order) VALUES
('Domain & Hosting Support', 'Domain registration, DNS management, hosting setup and configuration assistance.', 'server', 1),
('Dedicated Hosting Support', 'Advanced server management, security configurations, and performance optimization.', 'shield', 2),
('Affiliate Support', 'Help with our affiliate program, commissions, and partnership opportunities.', 'users', 3),
('Software Domain & Dev Support', 'Development tools, API access, custom integrations and technical implementation.', 'code', 4),
('Web Hosting Reseller', 'Reseller program support, white-label solutions, and business development assistance.', 'globe', 5),
('VPS Reseller', 'VPS reseller program support, server management, and scaling assistance.', 'zap', 6),
('Partner Programme', 'Partnership opportunities, joint ventures, and business collaboration support.', 'database', 7);

INSERT INTO system_status (service_name, status, description) VALUES
('Web Hosting Services', 'operational', 'All web hosting services are running normally'),
('Email Services', 'operational', 'Email delivery and webmail access functioning normally'),
('Domain Registration', 'operational', 'Domain registration and management services operational'),
('DNS Services', 'operational', 'DNS resolution working properly across all zones'),
('SSL Certificates', 'operational', 'SSL certificate issuance and management operational'),
('Customer Portal', 'operational', 'Client area and billing systems functioning normally');

INSERT INTO news_articles (title, slug, excerpt, content, category, tags, featured, published_at) VALUES
('ABANCOOL Welcomes 2024 to Our Growing Family', 'abancool-welcomes-2024', 'We are excited to announce that ABANCOOL has successfully completed our infrastructure upgrades for 2024.', 'We are excited to announce that ABANCOOL has successfully completed our infrastructure upgrades for 2024. This includes enhanced server capacity, improved security measures, and faster response times across all our hosting services. Our team has worked tirelessly to ensure that our customers receive the best possible hosting experience.', 'Company News', '{"infrastructure", "upgrades", "2024"}', true, '2024-01-15 10:00:00+00'),
('Exciting News: ABANCOOL Expands with Enhanced Acquisition', 'abancool-expands-enhanced-acquisition', 'ABANCOOL Technology is proud to announce our strategic expansion through the acquisition of additional data center facilities.', 'ABANCOOL Technology is proud to announce our strategic expansion through the acquisition of additional data center facilities. This expansion will provide our customers with even better performance and reliability. The new facilities feature state-of-the-art equipment and enhanced security measures.', 'Company News', '{"expansion", "datacenter", "acquisition"}', true, '2023-12-28 09:00:00+00'),
('Stay Ahead of the Curve - Why Updating Your PHP Version is Essential', 'php-version-update-essential', 'Discover the importance of keeping your PHP version up-to-date for optimal website performance.', 'Discover the importance of keeping your PHP version up-to-date for optimal website performance. Our new automated PHP update system makes it easier than ever to maintain the latest versions with enhanced security features. Learn about the benefits of PHP 8.x and how it can improve your website speed and security.', 'Technical', '{"php", "updates", "security", "performance"}', false, '2023-12-20 14:30:00+00'),
('Exciting News: Introducing Our New Colocation Service!', 'introducing-new-colocation-service', 'We''re thrilled to announce a significant new addition to our service portfolio - our brand-new Colocation Service!', 'We''re thrilled to announce a significant new addition to our service portfolio - our brand-new Colocation Service! This exciting development allows businesses to house their servers in our state-of-the-art data centers. With 24/7 monitoring, redundant power systems, and enterprise-grade security, your infrastructure is in safe hands.', 'Product Launch', '{"colocation", "datacenter", "enterprise"}', false, '2023-12-15 11:00:00+00'),
('Exciting News: Introducing Our New Datacenter Service', 'introducing-new-datacenter-service', 'ABANCOOL is excited to announce our new datacenter service offerings.', 'ABANCOOL is excited to announce our new datacenter service offerings. With enterprise-grade infrastructure and 24/7 monitoring, we''re ready to support your mission-critical applications. Our new datacenter features redundant power, cooling systems, and multiple network carriers for maximum reliability.', 'Product Launch', '{"datacenter", "enterprise", "infrastructure"}', false, '2023-12-10 16:00:00+00'),
('PHP Extended Support: We Support Older PHP Versions', 'php-extended-support-older-versions', 'Support and security for older PHP versions that require PHP 5.4 to 8.0.', 'We understand that not all applications can immediately upgrade to the latest PHP versions. That''s why we offer extended support for older PHP versions, including PHP 5.4 through 8.0. Our extended support includes security patches, performance optimizations, and compatibility maintenance to keep your legacy applications running smoothly.', 'Technical', '{"php", "legacy", "support", "security"}', false, '2023-12-05 13:00:00+00');