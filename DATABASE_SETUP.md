# Database Setup Guide

## Quick Setup

### 1. Clean Up Duplicates (IMPORTANT - Do this first!)
```bash
# Copy and run cleanup_duplicates.sql in Supabase SQL Editor
```
This removes all duplicate hosting plans and sets up clean data.

### 2. Verify Your Plans
After running the cleanup script, you should have:

**Web Hosting (4 plans):**
- Web_Starter - KSh 420/month
- Web_Basic - KSh 630/month  
- Web_Power - KSh 945/month
- Web_Business - KSh 1,399/month

**Reseller Hosting (4 plans):**
- Starter Reseller Host - KSh 1,500/month
- Basic Reseller Host - KSh 2,500/month
- Premium Reseller Host - KSh 4,000/month
- Platinum Resellers Host - KSh 6,000/month

**Shared Hosting (4 plans):**
- Starter Hosting - KSh 1,500/year
- Business Hosting - KSh 2,500/year
- Premium Hosting - KSh 4,000/year
- Enterprise Hosting - KSh 6,000/year

**Other Services:**
- WordPress Hosting (2 plans)
- LiteSpeed Hosting (2 plans)
- Professional Email (2 plans)
- Cloud Servers Linux (2 plans)
- Cloud Servers Windows (2 plans)
- SSL Certificates (2 plans)
- Site Builder (2 plans)

## What's Now Integrated

### ✅ Homepage (/)
- **HostingPlans component** now fetches from database
- Shows real pricing and plans
- Dynamic loading states
- Links to Store page

### ✅ Store Page (/store)
- Fully integrated with database
- Category filtering
- Real-time plan display
- Order form integration

### ✅ Database Structure
- Clean, no duplicates
- Proper categories
- Your exact pricing
- All features preserved

## Troubleshooting

### If you see duplicates:
1. Run `cleanup_duplicates.sql` in Supabase SQL Editor
2. Refresh your website
3. Check the Store page first to verify

### If plans don't show:
1. Check Supabase connection in `.env`
2. Verify plans exist: `SELECT * FROM hosting_plans;`
3. Check browser console for errors

### If categories are wrong:
The system expects these exact category names:
- `"Web Hosting"`
- `"Reseller Hosting"`  
- `"Shared Hosting"`
- `"WordPress Hosting"`
- `"LiteSpeed Hosting"`
- `"Professional Email"`

## Files Modified

- `src/components/HostingPlans.tsx` - Now uses database
- `cleanup_duplicates.sql` - Removes duplicates
- `package.json` - Updated scripts

## Next Steps

1. Run the cleanup script
2. Test the homepage and store page
3. Verify all plans show correctly
4. No more duplicates!