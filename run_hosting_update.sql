-- Quick script to update hosting plans with exact pricing
-- Run this in Supabase SQL Editor

-- Clear existing plans
DELETE FROM hosting_plans WHERE category IN ('Reseller Hosting', 'Shared Hosting');

-- Reseller Plans (Monthly)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
('Starter Reseller Host', 'Reseller Hosting', '30GB, 30 accounts - KSh 1,500/month', 1500.00, 'KSh', '["30 GB SSD Storage", "30 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),
('Basic Reseller Host', 'Reseller Hosting', '60GB, 60 accounts - KSh 2,500/month', 2500.00, 'KSh', '["60 GB SSD Storage", "60 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),
('Premium Reseller Host', 'Reseller Hosting', '80GB, 80 accounts - KSh 4,000/month', 4000.00, 'KSh', '["80 GB SSD Storage", "80 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),
('Platinum Resellers Host', 'Reseller Hosting', '150GB, 100 accounts - KSh 6,000/month', 6000.00, 'KSh', '["150 GB SSD Storage", "100 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true);

-- Shared Hosting Plans (Annual)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
('Starter Hosting', 'Shared Hosting', '1 website, 30GB - KSh 1,500/year', 1500.00, 'KSh', '["1 Website", "30 GB NVMe SSD Storage", "10 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Weekly Backups", "5 MySQL Database"]', true),
('Business Hosting', 'Shared Hosting', '5 websites, 60GB - KSh 2,500/year', 2500.00, 'KSh', '["5 Websites", "60 GB NVMe SSD Storage", "15 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "10 MySQL Database"]', true),
('Premium Hosting', 'Shared Hosting', 'Unlimited websites, 80GB - KSh 4,000/year', 4000.00, 'KSh', '["Unlimited Websites", "80 GB NVMe SSD Storage", "Unlimited Email Accounts", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Unlimited Databases"]', true),
('Enterprise Hosting', 'Shared Hosting', 'Unlimited everything - KSh 6,000/year', 6000.00, 'KSh', '["Unlimited Websites", "Unlimited NVMe SSD Storage", "Unlimited Email Accounts", "Unlimited Databases", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Priority Support"]', true);