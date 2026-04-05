# Hosting Packages

This document contains the SQL statements and scripts to insert your hosting packages into the database.

## Package Categories

### Reseller Hosting Plans

#### Monthly Billing
- **Starter Reseller Host** - KSh 1,500/month
- **Basic Reseller Host** - KSh 2,500/month  
- **Premium Reseller Host** - KSh 4,000/month
- **Platinum Resellers Host** - KSh 6,000/month

#### Annual Billing (10% Discount)
- **Starter Reseller Host** - KSh 16,200/year (Save KSh 1,800)
- **Basic Reseller Host** - KSh 27,000/year (Save KSh 3,000)
- **Premium Reseller Host** - KSh 43,200/year (Save KSh 4,800)
- **Platinum Resellers Host** - KSh 64,800/year (Save KSh 7,200)

### Shared Hosting Plans

#### Annual Billing
- **Starter Hosting** - KSh 1,500/year
- **Business Hosting** - KSh 2,500/year
- **Premium Hosting** - KSh 4,000/year
- **Enterprise Hosting** - KSh 6,000/year

#### Monthly Billing
- **Starter Hosting** - KSh 150/month
- **Business Hosting** - KSh 250/month
- **Premium Hosting** - KSh 400/month
- **Enterprise Hosting** - KSh 600/month

## Files Created

1. **`hosting_packages.sql`** - Raw SQL statements to insert the packages
2. **`scripts/insert-hosting-packages.js`** - Node.js script to insert packages via Supabase client
3. **Updated `supabase/seed.sql`** - Added packages to the seed file

## How to Insert Packages

### Method 1: Using Node.js Script (Recommended)
```bash
npm run insert-packages
```

### Method 2: Using Supabase CLI
```bash
# Reset database and run seed file
npm run seed-db
```

### Method 3: Manual SQL Execution
Execute the contents of `hosting_packages.sql` directly in your Supabase SQL editor.

## Environment Variables Required

Make sure you have these environment variables set:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for the Node.js script)

## Package Features

### Reseller Hosting Features
- SSD Storage (30GB - 150GB)
- DirectAdmin Accounts (30 - 100)
- Unlimited MySQL Databases
- Unlimited Bandwidth
- Unlimited Email Addresses
- WHMCS License included (20 USD Monthly)
- 30 Day Money-back Guarantee
- Free Let's Encrypt SSL
- Free Daily Backups
- DirectAdmin Control Panel

### Shared Hosting Features
- NVMe SSD Storage (30GB - Unlimited)
- Multiple Websites (1 - Unlimited)
- Email Accounts (10 - Unlimited)
- Free SSL Certificates
- LiteSpeed Server
- Website Builder Included
- Softaculous 1-Click Installer
- Backups (Weekly/Daily)
- MySQL Databases (5 - Unlimited)
- Priority Support (Enterprise only)

## Billing Options

### Reseller Hosting
- **Monthly**: Standard pricing
- **Annual**: 10% discount (2 months free)

### Shared Hosting
- **Annual**: Best value pricing
- **Monthly**: Higher per-month cost but flexible

## Database Schema

The packages are stored in the `hosting_plans` table with the following structure:
- `id` - UUID primary key
- `name` - Package name
- `category` - Package category (reseller/shared)
- `description` - Package description
- `price` - Price in decimal format
- `currency` - Currency (KSh)
- `features` - JSON array of features
- `is_active` - Boolean flag for active packages
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Pricing Strategy

- **Reseller Hosting**: Monthly billing with annual discount
- **Shared Hosting**: Annual pricing is the primary offering, monthly available at higher rates
- All prices are in Kenyan Shillings (KSh)
- Annual plans offer significant savings to encourage longer commitments