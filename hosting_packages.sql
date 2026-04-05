-- Insert Reseller Hosting Plans (Monthly)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
(
    'Starter Reseller Host Monthly',
    'reseller',
    'Perfect for starting your hosting business with essential features - Monthly billing',
    1500.00,
    'KSh',
    '[
        "30 GB SSD Storage",
        "30 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
    ]',
    true
),
(
    'Basic Reseller Host Monthly',
    'reseller',
    'Great for growing hosting businesses with more resources - Monthly billing',
    2500.00,
    'KSh',
    '[
        "60 GB SSD Storage",
        "60 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS Licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
    ]',
    true
),
(
    'Premium Reseller Host Monthly',
    'reseller',
    'Premium reseller hosting with enhanced features and resources - Monthly billing',
    4000.00,
    'KSh',
    '[
        "80 GB SSD Storage",
        "80 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
    ]',
    true
),
(
    'Platinum Resellers Host Monthly',
    'reseller',
    'Top-tier reseller hosting with maximum resources and features - Monthly billing',
    6000.00,
    'KSh',
    '[
        "150 GB SSD Storage",
        "100 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
    ]',
    true
);

-- Insert Reseller Hosting Plans (Annual - 10% discount)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
(
    'Starter Reseller Host Annual',
    'reseller',
    'Perfect for starting your hosting business with essential features - Annual billing (Save 10%)',
    16200.00,
    'KSh',
    '[
        "30 GB SSD Storage",
        "30 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
    ]',
    true
),
(
    'Basic Reseller Host Annual',
    'reseller',
    'Great for growing hosting businesses with more resources - Annual billing (Save 10%)',
    27000.00,
    'KSh',
    '[
        "60 GB SSD Storage",
        "60 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS Licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
    ]',
    true
),
(
    'Premium Reseller Host Annual',
    'reseller',
    'Premium reseller hosting with enhanced features and resources - Annual billing (Save 10%)',
    43200.00,
    'KSh',
    '[
        "80 GB SSD Storage",
        "80 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
    ]',
    true
),
(
    'Platinum Resellers Host Annual',
    'reseller',
    'Top-tier reseller hosting with maximum resources and features - Annual billing (Save 10%)',
    64800.00,
    'KSh',
    '[
        "150 GB SSD Storage",
        "100 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let''s Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
    ]',
    true
);

-- Insert Shared Hosting Plans (Annual)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
(
    'Starter Hosting Annual',
    'shared',
    'Perfect for personal websites and small projects - Annual billing',
    1500.00,
    'KSh',
    '[
        "1 Website",
        "30 GB NVMe SSD Storage",
        "10 Email Accounts",
        "Free SSL Certificate",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Weekly Backups",
        "5 MySQL Database",
        "Annual Billing"
    ]',
    true
),
(
    'Business Hosting Annual',
    'shared',
    'Ideal for small businesses and growing websites - Annual billing',
    2500.00,
    'KSh',
    '[
        "5 Websites",
        "60 GB NVMe SSD Storage",
        "15 Email Accounts",
        "Free SSL Certificate",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "10 MySQL Database",
        "Annual Billing"
    ]',
    true
),
(
    'Premium Hosting Annual',
    'shared',
    'Perfect for established businesses with multiple websites - Annual billing',
    4000.00,
    'KSh',
    '[
        "Unlimited Websites",
        "80 GB NVMe SSD Storage",
        "Unlimited Email Accounts",
        "Free SSL Certificates",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "Unlimited Databases",
        "Annual Billing"
    ]',
    true
),
(
    'Enterprise Hosting Annual',
    'shared',
    'Ultimate hosting solution for high-traffic websites and enterprises - Annual billing',
    6000.00,
    'KSh',
    '[
        "Unlimited Websites",
        "Unlimited NVMe SSD Storage",
        "Unlimited Email Accounts",
        "Unlimited Databases",
        "Free SSL Certificates",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "Priority Support",
        "Annual Billing"
    ]',
    true
);

-- Insert Shared Hosting Plans (Monthly)
INSERT INTO hosting_plans (name, category, description, price, currency, features, is_active) VALUES
(
    'Starter Hosting Monthly',
    'shared',
    'Perfect for personal websites and small projects - Monthly billing',
    150.00,
    'KSh',
    '[
        "1 Website",
        "30 GB NVMe SSD Storage",
        "10 Email Accounts",
        "Free SSL Certificate",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Weekly Backups",
        "5 MySQL Database",
        "Monthly Billing"
    ]',
    true
),
(
    'Business Hosting Monthly',
    'shared',
    'Perfect for small businesses and growing websites - Monthly billing',
    250.00,
    'KSh',
    '[
        "5 Websites",
        "60 GB NVMe SSD Storage",
        "15 Email Accounts",
        "Free SSL Certificate",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "10 MySQL Database",
        "Monthly Billing"
    ]',
    true
),
(
    'Premium Hosting Monthly',
    'shared',
    'Perfect for established businesses with multiple websites - Monthly billing',
    400.00,
    'KSh',
    '[
        "Unlimited Websites",
        "80 GB NVMe SSD Storage",
        "Unlimited Email Accounts",
        "Free SSL Certificates",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "Unlimited Databases",
        "Monthly Billing"
    ]',
    true
),
(
    'Enterprise Hosting Monthly',
    'shared',
    'Ultimate hosting solution for high-traffic websites and enterprises - Monthly billing',
    600.00,
    'KSh',
    '[
        "Unlimited Websites",
        "Unlimited NVMe SSD Storage",
        "Unlimited Email Accounts",
        "Unlimited Databases",
        "Free SSL Certificates",
        "LiteSpeed Server",
        "Website Builder Included",
        "Softaculous 1-Click Installer",
        "Daily Backups",
        "Priority Support",
        "Monthly Billing"
    ]',
    true
);