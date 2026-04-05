-- Create DirectAdmin accounts table
CREATE TABLE directadmin_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    package_name TEXT NOT NULL,
    server_ip TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, suspended, terminated
    disk_usage JSONB DEFAULT '{}',
    bandwidth_usage JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DirectAdmin servers table
CREATE TABLE directadmin_servers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    hostname TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    port INTEGER DEFAULT 2222,
    api_username TEXT NOT NULL,
    api_password TEXT, -- Encrypted
    ssl_enabled BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active', -- active, maintenance, offline
    max_accounts INTEGER DEFAULT 100,
    current_accounts INTEGER DEFAULT 0,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DirectAdmin packages table
CREATE TABLE directadmin_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    server_id UUID REFERENCES directadmin_servers(id) ON DELETE CASCADE NOT NULL,
    package_name TEXT NOT NULL,
    disk_quota INTEGER NOT NULL, -- in MB
    bandwidth_quota INTEGER DEFAULT 0, -- 0 = unlimited, in MB
    max_domains INTEGER DEFAULT 1,
    max_subdomains INTEGER DEFAULT 0, -- 0 = unlimited
    max_emails INTEGER DEFAULT 0, -- 0 = unlimited
    max_databases INTEGER DEFAULT 0, -- 0 = unlimited
    max_ftp_accounts INTEGER DEFAULT 1,
    php_enabled BOOLEAN DEFAULT true,
    cgi_enabled BOOLEAN DEFAULT true,
    ssl_enabled BOOLEAN DEFAULT true,
    shell_access BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email templates table
CREATE TABLE email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB DEFAULT '[]', -- Array of variable names used in template
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email queue table
CREATE TABLE email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email TEXT NOT NULL,
    from_email TEXT DEFAULT 'noreply@abancool.com',
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_name TEXT,
    template_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending', -- pending, sent, failed, retry
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation rules table
CREATE TABLE automation_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_event TEXT NOT NULL, -- order_completed, payment_received, account_created, etc.
    conditions JSONB DEFAULT '{}',
    actions JSONB NOT NULL, -- Array of actions to perform
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_directadmin_accounts_user_id ON directadmin_accounts(user_id);
CREATE INDEX idx_directadmin_accounts_username ON directadmin_accounts(username);
CREATE INDEX idx_directadmin_accounts_status ON directadmin_accounts(status);
CREATE INDEX idx_directadmin_servers_status ON directadmin_servers(status);
CREATE INDEX idx_directadmin_packages_server_id ON directadmin_packages(server_id);
CREATE INDEX idx_email_templates_name ON email_templates(template_name);
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_automation_rules_trigger ON automation_rules(trigger_event);
CREATE INDEX idx_automation_rules_active ON automation_rules(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE directadmin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE directadmin_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE directadmin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- DirectAdmin accounts - users can only see their own accounts
CREATE POLICY "Users can view own DirectAdmin accounts" ON directadmin_accounts
    FOR SELECT USING (auth.uid() = user_id);

-- DirectAdmin servers - public read for active servers
CREATE POLICY "Public read access to active DirectAdmin servers" ON directadmin_servers
    FOR SELECT USING (status = 'active');

-- DirectAdmin packages - public read for active packages
CREATE POLICY "Public read access to active DirectAdmin packages" ON directadmin_packages
    FOR SELECT USING (is_active = true);

-- Email templates - public read for active templates
CREATE POLICY "Public read access to active email templates" ON email_templates
    FOR SELECT USING (is_active = true);

-- Email queue - users can view emails sent to them
CREATE POLICY "Users can view own emails" ON email_queue
    FOR SELECT USING (to_email IN (
        SELECT email FROM auth.users WHERE id = auth.uid()
    ));

-- Automation rules - public read for active rules
CREATE POLICY "Public read access to active automation rules" ON automation_rules
    FOR SELECT USING (is_active = true);

-- Add triggers for updated_at
CREATE TRIGGER update_directadmin_accounts_updated_at BEFORE UPDATE ON directadmin_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_directadmin_servers_updated_at BEFORE UPDATE ON directadmin_servers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_directadmin_packages_updated_at BEFORE UPDATE ON directadmin_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE ON email_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample DirectAdmin server
INSERT INTO directadmin_servers (name, hostname, ip_address, api_username, api_password, location) VALUES
('Primary Server', 'server1.abancool.com', '197.248.184.158', 'admin', 'encrypted_password_here', 'Nairobi, Kenya');

-- Insert sample DirectAdmin packages
INSERT INTO directadmin_packages (server_id, package_name, disk_quota, bandwidth_quota, max_domains, max_subdomains, max_emails, max_databases, max_ftp_accounts) 
SELECT 
    id,
    'Starter Package',
    20480, -- 20GB in MB
    0, -- Unlimited
    2,
    5,
    25,
    5,
    1
FROM directadmin_servers WHERE name = 'Primary Server';

INSERT INTO directadmin_packages (server_id, package_name, disk_quota, bandwidth_quota, max_domains, max_subdomains, max_emails, max_databases, max_ftp_accounts) 
SELECT 
    id,
    'Business Package',
    40960, -- 40GB in MB
    0, -- Unlimited
    5,
    100,
    100,
    50,
    1
FROM directadmin_servers WHERE name = 'Primary Server';

-- Insert email templates
INSERT INTO email_templates (template_name, subject, html_content, text_content, variables) VALUES
('welcome_hosting', 
 'Welcome to Abancool Technology - Your Hosting Account is Ready!',
 '<html><body><h1>Welcome {{firstName}}!</h1><p>Your hosting account has been created successfully.</p><p><strong>Login Details:</strong><br>Username: {{username}}<br>Password: {{password}}<br>Control Panel: <a href="{{loginUrl}}">{{loginUrl}}</a></p><p>Server IP: {{serverIp}}</p><p>If you need help, contact us at {{supportEmail}} or call {{supportPhone}}</p></body></html>',
 'Welcome {{firstName}}! Your hosting account: Username: {{username}}, Password: {{password}}, Control Panel: {{loginUrl}}, Server IP: {{serverIp}}. Support: {{supportEmail}} or {{supportPhone}}',
 '["firstName", "lastName", "username", "password", "loginUrl", "serverIp", "supportEmail", "supportPhone"]'),

('invoice',
 'Invoice #{{orderNumber}} - Abancool Technology',
 '<html><body><h1>Invoice #{{orderNumber}}</h1><p>Dear {{firstName}},</p><p>Thank you for your order. Please find your invoice details below:</p><p><strong>Total: {{currency}} {{total}}</strong></p><p>Due Date: {{dueDate}}</p><p>Payment Methods: {{paymentMethods}}</p></body></html>',
 'Invoice #{{orderNumber}} - Total: {{currency}} {{total}}, Due: {{dueDate}}',
 '["firstName", "orderNumber", "total", "currency", "dueDate", "paymentMethods"]');

-- Insert automation rules
INSERT INTO automation_rules (name, description, trigger_event, actions) VALUES
('Welcome Email on Order Completion',
 'Send welcome email with DirectAdmin credentials when order is completed',
 'order_completed',
 '[{"type": "send_email", "template": "welcome_hosting", "delay": 0}, {"type": "create_directadmin_account", "delay": 300}]'),

('Invoice Email on Order Creation', 
 'Send invoice email when order is created',
 'order_created',
 '[{"type": "send_email", "template": "invoice", "delay": 0}]');

-- Function to process email queue
CREATE OR REPLACE FUNCTION process_email_queue()
RETURNS void AS $$
DECLARE
    email_record RECORD;
BEGIN
    -- Process pending emails
    FOR email_record IN 
        SELECT * FROM email_queue 
        WHERE status = 'pending' 
        AND scheduled_at <= NOW()
        AND attempts < max_attempts
        ORDER BY scheduled_at
        LIMIT 10
    LOOP
        -- Update attempts
        UPDATE email_queue 
        SET attempts = attempts + 1, updated_at = NOW()
        WHERE id = email_record.id;
        
        -- Here you would integrate with your email service
        -- For now, we'll just mark as sent
        UPDATE email_queue
        SET status = 'sent', sent_at = NOW(), updated_at = NOW()
        WHERE id = email_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger automation rules
CREATE OR REPLACE FUNCTION trigger_automation_rules(event_name TEXT, event_data JSONB DEFAULT '{}')
RETURNS void AS $$
DECLARE
    rule_record RECORD;
    action_record JSONB;
BEGIN
    -- Find matching automation rules
    FOR rule_record IN 
        SELECT * FROM automation_rules 
        WHERE trigger_event = event_name 
        AND is_active = true
    LOOP
        -- Process each action in the rule
        FOR action_record IN 
            SELECT * FROM jsonb_array_elements(rule_record.actions)
        LOOP
            -- Queue email if action is send_email
            IF action_record->>'type' = 'send_email' THEN
                INSERT INTO email_queue (
                    to_email, 
                    template_name, 
                    template_data,
                    scheduled_at
                ) VALUES (
                    event_data->>'email',
                    action_record->>'template',
                    event_data,
                    NOW() + INTERVAL '1 second' * COALESCE((action_record->>'delay')::integer, 0)
                );
            END IF;
        END LOOP;
        
        -- Update rule execution count
        UPDATE automation_rules 
        SET execution_count = execution_count + 1, 
            last_executed = NOW(),
            updated_at = NOW()
        WHERE id = rule_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;