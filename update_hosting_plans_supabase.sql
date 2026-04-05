-- =====================================================
-- HOSTING PLANS UPDATE SCRIPT FOR SUPABASE
-- =====================================================
-- This script updates your hosting plans with exact pricing
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- Clear existing hosting plans to avoid duplicates
DELETE FROM hosting_plans WHERE name LIKE '%Reseller%' OR name LIKE '%Hosting%';

-- =====================================================
-- RESELLER HOSTING PLANS - MONTHLY BILLING
-- =====================================================

INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
('Starter Reseller Host', 'Reseller Hosting', 'Perfect for starting your hosting business with essential features', 1500.00, 'KSh',
'["30 GB SSD Storage", "30 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Basic Reseller Host', 'Reseller Hosting', 'Great for growing hosting businesses with more resources', 2500.00, 'KSh',
'["60 GB SSD Storage", "60 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS Licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Premium Reseller Host', 'Reseller Hosting', 'Premium reseller hosting with enhanced features and resources', 4000.00, 'KSh',
'["80 GB SSD Storage", "80 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true),

('Platinum Resellers Host', 'Reseller Hosting', 'Top-tier reseller hosting with maximum resources and features', 6000.00, 'KSh',
'["150 GB SSD Storage", "100 DirectAdmin Accounts", "Unlimited MySQL Databases", "Unlimited Bandwidth", "Unlimited Email Addresses", "WHMCS licence at 20 USD Monthly", "30 Day Money-back", "Free Let''s Encrypt SSL", "Free Daily Backups", "DirectAdmin Control Panel"]', true);

-- =====================================================
-- SHARED HOSTING PLANS - ANNUAL BILLING
-- =====================================================

INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
('Starter Hosting', 'Shared Hosting', 'Perfect for personal websites and small projects', 1500.00, 'KSh',
'["1 Website", "30 GB NVMe SSD Storage", "10 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Weekly Backups", "5 MySQL Database"]', true),

('Business Hosting', 'Shared Hosting', 'Ideal for small businesses and growing websites', 2500.00, 'KSh',
'["5 Websites", "60 GB NVMe SSD Storage", "15 Email Accounts", "Free SSL Certificate", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "10 MySQL Database"]', true),

('Premium Hosting', 'Shared Hosting', 'Perfect for established businesses with multiple websites', 4000.00, 'KSh',
'["Unlimited Websites", "80 GB NVMe SSD Storage", "Unlimited Email Accounts", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Unlimited Databases"]', true),

('Enterprise Hosting', 'Shared Hosting', 'Ultimate hosting solution for high-traffic websites and enterprises', 6000.00, 'KSh',
'["Unlimited Websites", "Unlimited NVMe SSD Storage", "Unlimited Email Accounts", "Unlimited Databases", "Free SSL Certificates", "LiteSpeed Server", "Website Builder Included", "Softaculous 1-Click Installer", "Daily Backups", "Priority Support"]', true);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify all plans were inserted correctly
-- SELECT name, category, price, currency FROM hosting_plans ORDER BY category, price;