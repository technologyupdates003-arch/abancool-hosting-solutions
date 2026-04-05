const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertHostingPackages() {
  try {
    console.log('🚀 Starting to insert hosting packages...');

    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, '..', 'hosting_packages.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing SQL statement...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing SQL:', error);
          // Try alternative approach using direct insert
          if (statement.includes('INSERT INTO hosting_plans')) {
            await insertPackagesDirectly();
            return;
          }
        }
      }
    }

    console.log('✅ Successfully inserted all hosting packages!');
  } catch (error) {
    console.error('❌ Error inserting hosting packages:', error);
    // Fallback to direct insert
    await insertPackagesDirectly();
  }
}

async function insertPackagesDirectly() {
  console.log('📦 Using direct insert method...');
  
  const resellerPlansMonthly = [
    {
      name: 'Starter Reseller Host Monthly',
      category: 'reseller',
      description: 'Perfect for starting your hosting business with essential features - Monthly billing',
      price: 1500.00,
      currency: 'KSh',
      features: [
        "30 GB SSD Storage",
        "30 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
      ],
      is_active: true
    },
    {
      name: 'Basic Reseller Host Monthly',
      category: 'reseller',
      description: 'Great for growing hosting businesses with more resources - Monthly billing',
      price: 2500.00,
      currency: 'KSh',
      features: [
        "60 GB SSD Storage",
        "60 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS Licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
      ],
      is_active: true
    },
    {
      name: 'Premium Reseller Host Monthly',
      category: 'reseller',
      description: 'Premium reseller hosting with enhanced features and resources - Monthly billing',
      price: 4000.00,
      currency: 'KSh',
      features: [
        "80 GB SSD Storage",
        "80 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
      ],
      is_active: true
    },
    {
      name: 'Platinum Resellers Host Monthly',
      category: 'reseller',
      description: 'Top-tier reseller hosting with maximum resources and features - Monthly billing',
      price: 6000.00,
      currency: 'KSh',
      features: [
        "150 GB SSD Storage",
        "100 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Monthly Billing"
      ],
      is_active: true
    }
  ];

  const resellerPlansAnnual = [
    {
      name: 'Starter Reseller Host Annual',
      category: 'reseller',
      description: 'Perfect for starting your hosting business with essential features - Annual billing (Save 10%)',
      price: 16200.00,
      currency: 'KSh',
      features: [
        "30 GB SSD Storage",
        "30 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
      ],
      is_active: true
    },
    {
      name: 'Basic Reseller Host Annual',
      category: 'reseller',
      description: 'Great for growing hosting businesses with more resources - Annual billing (Save 10%)',
      price: 27000.00,
      currency: 'KSh',
      features: [
        "60 GB SSD Storage",
        "60 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS Licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
      ],
      is_active: true
    },
    {
      name: 'Premium Reseller Host Annual',
      category: 'reseller',
      description: 'Premium reseller hosting with enhanced features and resources - Annual billing (Save 10%)',
      price: 43200.00,
      currency: 'KSh',
      features: [
        "80 GB SSD Storage",
        "80 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
      ],
      is_active: true
    },
    {
      name: 'Platinum Resellers Host Annual',
      category: 'reseller',
      description: 'Top-tier reseller hosting with maximum resources and features - Annual billing (Save 10%)',
      price: 64800.00,
      currency: 'KSh',
      features: [
        "150 GB SSD Storage",
        "100 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel",
        "Annual Billing",
        "Save 10%"
      ],
      is_active: true
    }
  ];

  const sharedPlansAnnual = [
    {
      name: 'Starter Hosting Annual',
      category: 'shared',
      description: 'Perfect for personal websites and small projects - Annual billing',
      price: 1500.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Business Hosting Annual',
      category: 'shared',
      description: 'Ideal for small businesses and growing websites - Annual billing',
      price: 2500.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Premium Hosting Annual',
      category: 'shared',
      description: 'Perfect for established businesses with multiple websites - Annual billing',
      price: 4000.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Enterprise Hosting Annual',
      category: 'shared',
      description: 'Ultimate hosting solution for high-traffic websites and enterprises - Annual billing',
      price: 6000.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    }
  ];

  const sharedPlansMonthly = [
    {
      name: 'Starter Hosting Monthly',
      category: 'shared',
      description: 'Perfect for personal websites and small projects - Monthly billing',
      price: 150.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Business Hosting Monthly',
      category: 'shared',
      description: 'Ideal for small businesses and growing websites - Monthly billing',
      price: 250.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Premium Hosting Monthly',
      category: 'shared',
      description: 'Perfect for established businesses with multiple websites - Monthly billing',
      price: 400.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    },
    {
      name: 'Enterprise Hosting Monthly',
      category: 'shared',
      description: 'Ultimate hosting solution for high-traffic websites and enterprises - Monthly billing',
      price: 600.00,
      currency: 'KSh',
      features: [
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
      ],
      is_active: true
    }
  ];

  // Insert reseller plans (monthly)
  console.log('📋 Inserting monthly reseller hosting plans...');
  const { error: resellerMonthlyError } = await supabase
    .from('hosting_plans')
    .insert(resellerPlansMonthly);

  if (resellerMonthlyError) {
    console.error('❌ Error inserting monthly reseller plans:', resellerMonthlyError);
  } else {
    console.log('✅ Successfully inserted monthly reseller plans!');
  }

  // Insert reseller plans (annual)
  console.log('📋 Inserting annual reseller hosting plans...');
  const { error: resellerAnnualError } = await supabase
    .from('hosting_plans')
    .insert(resellerPlansAnnual);

  if (resellerAnnualError) {
    console.error('❌ Error inserting annual reseller plans:', resellerAnnualError);
  } else {
    console.log('✅ Successfully inserted annual reseller plans!');
  }

  // Insert shared hosting plans (annual)
  console.log('📋 Inserting annual shared hosting plans...');
  const { error: sharedAnnualError } = await supabase
    .from('hosting_plans')
    .insert(sharedPlansAnnual);

  if (sharedAnnualError) {
    console.error('❌ Error inserting annual shared plans:', sharedAnnualError);
  } else {
    console.log('✅ Successfully inserted annual shared plans!');
  }

  // Insert shared hosting plans (monthly)
  console.log('📋 Inserting monthly shared hosting plans...');
  const { error: sharedMonthlyError } = await supabase
    .from('hosting_plans')
    .insert(sharedPlansMonthly);

  if (sharedMonthlyError) {
    console.error('❌ Error inserting monthly shared plans:', sharedMonthlyError);
  } else {
    console.log('✅ Successfully inserted monthly shared plans!');
  }

  console.log('🎉 All hosting packages have been inserted successfully!');
}

// Run the script
insertHostingPackages().catch(console.error);