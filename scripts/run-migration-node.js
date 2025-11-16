#!/usr/bin/env node
/**
 * Alternative script using node-postgres (pg) to execute migrations
 * This requires: npm install pg
 * Run with: node scripts/run-migration-node.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  console.error('\nPlease ensure these are set in your .env.local file.');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running Supabase migration via PostgreSQL...\n');

  // Extract database connection details from Supabase URL
  // Supabase uses: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  // We need to construct this from the service role key
  
  // For Supabase, we typically need the database password
  // The service role key is not the database password, so we need the DB password separately
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!dbPassword) {
    console.error('❌ Missing SUPABASE_DB_PASSWORD environment variable.');
    console.error('   You can find this in: Supabase Dashboard > Project Settings > Database');
    console.error('   Look for the "Connection string" or "Database password"\n');
    process.exit(1);
  }

  const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  if (!projectRef) {
    console.error('❌ Could not extract project reference from Supabase URL');
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20240101000000_fix_rls_policies.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📝 Reading migration file...');
  console.log(`   File: ${migrationPath}\n`);

  // Create PostgreSQL client
  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    console.log('🔧 Executing migration SQL...\n');
    await client.query(sql);
    
    console.log('✅ Migration executed successfully!\n');
  } catch (error) {
    console.error('❌ Error executing migration:', error.message);
    console.error('\n📋 Please run the migration manually:\n');
    console.error('   1. Go to your Supabase Dashboard: https://app.supabase.com');
    console.error('   2. Select your project');
    console.error('   3. Go to SQL Editor');
    console.error('   4. Copy and paste the contents of the migration file');
    console.error('   5. Click "Run"\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

