import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      return;
    }
    
    console.log('Migration completed successfully!');
    
    // Run seed data
    console.log('Inserting seed data...');
    const seedPath = path.join(__dirname, '../supabase/seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    const { error: seedError } = await supabase.rpc('exec_sql', { sql: seedSQL });
    
    if (seedError) {
      console.error('Seed data insertion failed:', seedError);
      return;
    }
    
    console.log('Seed data inserted successfully!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

runMigration();