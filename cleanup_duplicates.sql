-- =====================================================
-- CLEANUP DUPLICATE HOSTING PLANS
-- =====================================================
-- This script removes duplicate hosting plans from your database
-- Run this in Supabase SQL Editor to clean up duplicates
-- =====================================================

-- First, let's see what duplicates we have
-- SELECT name, category, COUNT(*) as count 
-- FROM hosting_plans 
-- GROUP BY name, category 
-- HAVING COUNT(*) > 1;

-- Delete all hosting plans first to start clean
DELETE FROM hosting_plans;

-- Now insert only the plans you want (no duplicates)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES

-- Web Hosting Plans (Original ones from seed)
('Web_Starter', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 420.00, 'KSh', 
'["20 GB SSD Storage", "2 Websites", "25 Email Accounts", "5 Subdomains", "5 MySQL Databases", "1 FTP Account", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]', true),

('Web_Basic', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 630.00, 'KSh',
'["40 GB SSD Storage", "5 Websites", "100 Email Accounts", "100 Subdomains", "50 MySQL Databases", "1 FTP Account", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]', true),

('Web_Power', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 945.00, 'KSh',
'["100 GB SSD Storage", "10 Websites", "Unlimited Email Accounts", "500 Subdomains", "Unlimited MySQL Databases", "5 FTP Accounts", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]', true),

('Web_Business', 'Web Hosting', 'With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.', 1399.00, 'KSh',
'["200 GB SSD Storage", "20 Websites", "Unlimited Email Accounts", "1000 Subdomains", "Unlimited MySQL Databases", "10 FTP Accounts", "Unlimited Bandwidth", "Free Let''s Encrypt SSL", "Free Daily Backups"]', true),

-- WordPress Hosting Plans
('WP_Starter', 'WordPress Hosting', 'Optimized WordPress hosting with pre-installed WordPress, automatic updates, and enhanced security.', 520.00, 'KSh',
'["1 WordPress Site", "20 GB SSD", "Free SSL", "Daily Backups", "Managed Updates"]', true),

('WP_Business', 'WordPress Hosting', 'High-performance WordPress hosting with staging, CDN, and priority support.', 1200.00, 'KSh',
'["5 WordPress Sites", "100 GB SSD", "Free SSL", "Staging Environment", "CDN Included", "Priority Support"]', true),

-- LiteSpeed Hosting Plans
('LS_Starter', 'LiteSpeed Hosting', 'Lightning-fast LiteSpeed web server with advanced caching and optimization.', 650.00, 'KSh',
'["LiteSpeed Web Server", "30 GB SSD Storage", "3 Websites", "50 Email Accounts", "LSCache Plugin", "Free SSL", "Daily Backups"]', true),

('LS_Pro', 'LiteSpeed Hosting', 'Professional LiteSpeed hosting with enhanced performance and security features.', 1100.00, 'KSh',
'["LiteSpeed Web Server", "80 GB SSD Storage", "8 Websites", "Unlimited Email Accounts", "LSCache Plugin", "Free SSL", "Daily Backups", "Advanced Security"]', true),

-- Your New Reseller Hosting Plans (Monthly)
('Starter Reseller Host', 'Reseller Hosting', 'Perfect for starting your hosting business with essential features', 1500.00, 'KSh',
'["30 GB SSD Storage", "30 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Basic Reseller Host', 'Reseller Hosting', 'Great for growing hosting businesses with more resources', 2500.00, 'KSh',
'["60 GB SSD Storage", "60 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS Licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Premium Reseller Host', 'Reseller Hosting', 'Premium reseller hosting with enhanced features and resources', 4000.00, 'KSh',
'["80 GB SSD Storage", "80 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Platinum Resellers Host', 'Reseller Hosting', 'Top-tier reseller hosting with maximum resources and features', 6000.00, 'KSh',
'["150 GB SSD Storage", "100 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

-- Your New Shared Hosting Plans (Annual)
('Starter Hosting', 'Shared Hosting', 'Perfect for personal websites and small projects', 1500.00, 'KSh',
'["1 Website", "30 GB NVMe SSD Storage", "10 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Weekly Backups", "5 MySQL Database"]', true),

('Business Hosting', 'Shared Hosting', 'Ideal for small businesses and growing websites', 2500.00, 'KSh',
'["5 Websites", "60 GB NVMe SSD Storage", "15 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "10 MySQL Database"]', true),

('Premium Hosting', 'Shared Hosting', 'Perfect for established businesses with multiple websites', 4000.00, 'KSh',
'["Unlimited Websites", "80 GB NVMe SSD Storage", "Unlimited Email Accounts", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Unlimited Databases"]', true),

('Enterprise Hosting', 'Shared Hosting', 'Ultimate hosting solution for high-traffic websites and enterprises', 6000.00, 'KSh',
'["Unlimited Websites", "Unlimited NVMe SSD Storage", "Unlimited Email Accounts", "Unlimited Databases", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Priority Support"]', true),

-- Professional Email Plans
('Email_Basic', 'Professional Email', 'Professional email hosting with advanced security and collaboration tools.', 300.00, 'KSh',
'["10 GB Storage per Mailbox", "Custom Domain", "Anti-Spam Protection", "Mobile Sync", "Webmail Access"]', true),

('Email_Business', 'Professional Email', 'Business-grade email hosting with enhanced features and storage.', 600.00, 'KSh',
'["50 GB Storage per Mailbox", "Custom Domain", "Advanced Anti-Spam", "Mobile Sync", "Webmail Access", "Calendar & Contacts", "Archive & Backup"]', true),

-- Cloud Servers Linux
('Cloud_Linux_Basic', 'Cloud Servers Linux', 'Scalable Linux cloud servers with SSD storage and full root access.', 1800.00, 'KSh',
'["1 vCPU", "2 GB RAM", "40 GB SSD", "1 TB Bandwidth", "Full Root Access", "Choice of Linux Distros", "24/7 Support"]', true),

('Cloud_Linux_Standard', 'Cloud Servers Linux', 'Standard Linux cloud servers for growing applications and websites.', 3500.00, 'KSh',
'["2 vCPU", "4 GB RAM", "80 GB SSD", "2 TB Bandwidth", "Full Root Access", "Choice of Linux Distros", "24/7 Support", "Automated Backups"]', true),

-- Cloud Servers Windows
('Cloud_Windows_Basic', 'Cloud Servers Windows', 'Windows cloud servers with full administrative access and flexibility.', 2200.00, 'KSh',
'["1 vCPU", "2 GB RAM", "40 GB SSD", "1 TB Bandwidth", "Full Admin Access", "Windows Server License", "Remote Desktop", "24/7 Support"]', true),

('Cloud_Windows_Standard', 'Cloud Servers Windows', 'Standard Windows cloud servers for business applications.', 4000.00, 'KSh',
'["2 vCPU", "4 GB RAM", "80 GB SSD", "2 TB Bandwidth", "Full Admin Access", "Windows Server License", "Remote Desktop", "24/7 Support", "Automated Backups"]', true),

-- SSL Certificates
('SSL_Basic', 'SSL Certificates', 'Domain Validated SSL certificate for basic website security.', 1500.00, 'KSh',
'["Domain Validation", "256-bit Encryption", "Browser Trust", "Mobile Compatibility", "1 Year Validity"]', true),

('SSL_Wildcard', 'SSL Certificates', 'Wildcard SSL certificate to secure unlimited subdomains.', 8500.00, 'KSh',
'["Wildcard Protection", "Unlimited Subdomains", "256-bit Encryption", "Browser Trust", "Mobile Compatibility", "1 Year Validity"]', true),

-- Site Builder
('SiteBuilder_Personal', 'Site Builder', 'Easy drag-and-drop website builder for personal websites.', 800.00, 'KSh',
'["Drag & Drop Builder", "50+ Templates", "Mobile Responsive", "Free Hosting", "Custom Domain", "Basic SEO Tools"]', true),

('SiteBuilder_Business', 'Site Builder', 'Professional website builder with e-commerce and advanced features.', 1600.00, 'KSh',
'["Drag & Drop Builder", "200+ Templates", "Mobile Responsive", "Free Hosting", "Custom Domain", "Advanced SEO Tools", "E-commerce Ready", "Analytics Integration"]', true);

-- Verify the cleanup worked
SELECT category, COUNT(*) as plan_count FROM hosting_plans GROUP BY category ORDER BY category;