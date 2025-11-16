#!/usr/bin/env tsx
/**
 * Script to run Supabase migrations
 * This executes the SQL migration file directly in your Supabase database
 * Run with: npx tsx scripts/run-migration.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  console.log('🚀 Running Supabase migration...\n');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20240101000000_fix_rls_policies.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Reading migration file...');
    console.log(`   File: ${migrationPath}\n`);

    // Extract project reference from URL (e.g., https://xxx.supabase.co)
    const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
    
    if (!projectRef) {
      throw new Error('Could not extract project reference from Supabase URL');
    }

    // Use Supabase Management API to execute SQL
    // Note: This requires the project to have SQL execution enabled
    const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
    
    console.log('🔧 Executing SQL via Supabase Management API...\n');

    const response = await fetch(managementUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        query: sql,
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      // Try alternative: Use direct PostgreSQL connection via REST API
      console.log('⚠️  Management API approach failed, trying REST API method...\n');
      
      // Alternative: Use pg rest endpoint if available
      const restUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
      const restResponse = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify({ sql }),
      });

      if (restResponse.ok) {
        console.log('✅ Migration executed successfully via REST API!\n');
        return;
      }

      // If both fail, provide manual instructions
      console.error('❌ Could not execute migration automatically.');
      console.error('   Response:', responseText);
      console.error('\n📋 Please run the migration manually:\n');
      console.error('   1. Go to your Supabase Dashboard: https://app.supabase.com');
      console.error('   2. Select your project');
      console.error('   3. Go to SQL Editor');
      console.error('   4. Copy and paste the contents of:');
      console.error(`      ${migrationPath}`);
      console.error('   5. Click "Run"\n');
      process.exit(1);
    }

    console.log('✅ Migration executed successfully!\n');
    console.log('Response:', responseText);

  } catch (error) {
    console.error('❌ Error running migration:', error);
    
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
    
    console.error('\n📋 Please run the migration manually:\n');
    console.error('   1. Go to your Supabase Dashboard: https://app.supabase.com');
    console.error('   2. Select your project');
    console.error('   3. Go to SQL Editor');
    console.error('   4. Copy and paste the contents of:');
    console.error('      supabase/migrations/20240101000000_fix_rls_policies.sql');
    console.error('   5. Click "Run"\n');
    process.exit(1);
  }
}

runMigration();

