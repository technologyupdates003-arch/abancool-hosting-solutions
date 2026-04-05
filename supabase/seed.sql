-- Insert hosting plans
INSERT INTO hosting_plans (name, category, description, price, currency, features) VALUES
-- Web Hosting Plans
('Web_Starter', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 420.00, 'KSh', 
'["20 GB SSD Storage", "2 Websites", "25 Email Accounts", "5 Subdomains", "5 MySQL Databases", "1 FTP Account", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]'),

('Web_Basic', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 630.00, 'KSh',
'["40 GB SSD Storage", "5 Websites", "100 Email Accounts", "100 Subdomains", "50 MySQL Databases", "1 FTP Account", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]'),

('Web_Power', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 945.00, 'KSh',
'["100 GB SSD Storage", "10 Websites", "Unlimited Email Accounts", "500 Subdomains", "Unlimited MySQL Databases", "5 FTP Accounts", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]'),

('Web_Business', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 1399.00, 'KSh',
'["200 GB SSD Storage", "20 Websites", "Unlimited Email Accounts", "1000 Subdomains", "Unlimited MySQL Databases", "10 FTP Accounts", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]'),

-- WordPress Hosting Plans
('WP_Starter', 'WordPress Hosting', 'Optimized WordPress hosting with pre-installed WordPress, automatic updates, and enhanced security.', 520.00, 'KSh',
'["1 WordPress Site", "20 GB SSD", "Free SSL", "Daily Backups", "Managed Updates"]'),

('WP_Business', 'WordPress Hosting', 'High-performance WordPress hosting with staging, CDN, and priority support.', 1200.00, 'KSh',
'["5 WordPress Sites", "100 GB SSD", "Free SSL", "Staging Environment", "CDN Included", "Priority Support"]'),

-- LiteSpeed Hosting Plans
('LS_Starter', 'LiteSpeed Hosting', 'Lightning-fast LiteSpeed web server with advanced caching and optimization.', 650.00, 'KSh',
'["LiteSpeed Web Server", "30 GB SSD Storage", "3 Websites", "50 Email Accounts", "LSCache Plugin", "Free SSL", "Daily Backups"]'),

('LS_Pro', 'LiteSpeed Hosting', 'Professional LiteSpeed hosting with enhanced performance and security features.', 1100.00, 'KSh',
'["LiteSpeed Web Server", "80 GB SSD Storage", "8 Websites", "Unlimited Email Accounts", "LSCache Plugin", "Free SSL", "Daily Backups", "Advanced Security"]'),

-- Professional Email Plans
('Email_Basic', 'Professional Email', 'Professional email hosting with advanced security and collaboration tools.', 300.00, 'KSh',
'["10 GB Storage per Mailbox", "Custom Domain", "Anti-Spam Protection", "Mobile Sync", "Webmail Access"]'),

('Email_Business', 'Professional Email', 'Business-grade email hosting with enhanced features and storage.', 600.00, 'KSh',
'["50 GB Storage per Mailbox", "Custom Domain", "Advanced Anti-Spam", "Mobile Sync", "Webmail Access", "Calendar & Contacts", "Archive & Backup"]'),

-- Cloud Servers Linux
('Cloud_Linux_Basic', 'Cloud Servers Linux', 'Scalable Linux cloud servers with SSD storage and full root access.', 1800.00, 'KSh',
'["1 vCPU", "2 GB RAM", "40 GB SSD", "1 TB Bandwidth", "Full Root Access", "Choice of Linux Distros", "24/7 Support"]'),

('Cloud_Linux_Standard', 'Cloud Servers Linux', 'Standard Linux cloud servers for growing applications and websites.', 3500.00, 'KSh',
'["2 vCPU", "4 GB RAM", "80 GB SSD", "2 TB Bandwidth", "Full Root Access", "Choice of Linux Distros", "24/7 Support", "Automated Backups"]'),

-- Cloud Servers Windows
('Cloud_Windows_Basic', 'Cloud Servers Windows', 'Windows cloud servers with full administrative access and flexibility.', 2200.00, 'KSh',
'["1 vCPU", "2 GB RAM", "40 GB SSD", "1 TB Bandwidth", "Full Admin Access", "Windows Server License", "Remote Desktop", "24/7 Support"]'),

('Cloud_Windows_Standard', 'Cloud Servers Windows', 'Standard Windows cloud servers for business applications.', 4000.00, 'KSh',
'["2 vCPU", "4 GB RAM", "80 GB SSD", "2 TB Bandwidth", "Full Admin Access", "Windows Server License", "Remote Desktop", "24/7 Support", "Automated Backups"]'),

-- SSL Certificates
('SSL_Basic', 'SSL Certificates', 'Domain Validated SSL certificate for basic website security.', 1500.00, 'KSh',
'["Domain Validation", "256-bit Encryption", "Browser Trust", "Mobile Compatibility", "1 Year Validity"]'),

('SSL_Wildcard', 'SSL Certificates', 'Wildcard SSL certificate to secure unlimited subdomains.', 8500.00, 'KSh',
'["Wildcard Protection", "Unlimited Subdomains", "256-bit Encryption", "Browser Trust", "Mobile Compatibility", "1 Year Validity"]'),

-- Site Builder
('SiteBuilder_Personal', 'Site Builder', 'Easy drag-and-drop website builder for personal websites.', 800.00, 'KSh',
'["Drag & Drop Builder", "50+ Templates", "Mobile Responsive", "Free Hosting", "Custom Domain", "Basic SEO Tools"]'),

('SiteBuilder_Business', 'Site Builder', 'Professional website builder with e-commerce and advanced features.', 1600.00, 'KSh',
'["Drag & Drop Builder", "200+ Templates", "Mobile Responsive", "Free Hosting", "Custom Domain", "Advanced SEO Tools", "E-commerce Ready", "Analytics Integration"]');

-- Additional Professional Email Plans
INSERT INTO hosting_plans (name, category, description, price, currency, features) VALUES
('Email_Starter', 'Professional Email', 'Professional email hosting for small businesses and individuals', 250.00, 'KSh',
'["5 Email Accounts", "10 GB Storage per Account", "IMAP/POP3/SMTP Access", "Webmail Interface", "Anti-Spam Protection", "Anti-Virus Scanning", "Mobile Device Support", "24/7 Email Support", "99.9% Uptime Guarantee"]'),

('Email_Enterprise', 'Professional Email', 'Premium email hosting solution for large organizations', 1200.00, 'KSh',
'["Unlimited Email Accounts", "50 GB Storage per Account", "IMAP/POP3/SMTP Access", "Advanced Webmail Interface", "Enterprise Anti-Spam Protection", "Advanced Anti-Virus Scanning", "Mobile Device Management", "Email Forwarding & Aliases", "Shared Calendars & Contacts", "Email Archiving", "Advanced Security Features", "24/7 Premium Support", "99.9% Uptime Guarantee"]'),

('Email_Basic_Annual', 'Professional Email', 'Professional email hosting - Annual billing (Save 15%)', 2550.00, 'KSh',
'["10 GB Storage per Mailbox", "Custom Domain", "Anti-Spam Protection", "Mobile Sync", "Webmail Access", "Annual Billing", "Save 15%"]'),

('Email_Business_Annual', 'Professional Email', 'Business-grade email hosting - Annual billing (Save 15%)', 6120.00, 'KSh',
'["50 GB Storage per Mailbox", "Custom Domain", "Advanced Anti-Spam", "Mobile Sync", "Webmail Access", "Calendar & Contacts", "Archive & Backup", "Annual Billing", "Save 15%"]');
-- Insert domain TLD pricing data
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
('.co', 32.99, 4950.00, 605.00, 1, true)
ON CONFLICT (tld) DO UPDATE SET
  price_usd = EXCLUDED.price_usd,
  price_kes = EXCLUDED.price_kes,
  price_zar = EXCLUDED.price_zar,
  updated_at = timezone('utc'::text, now());