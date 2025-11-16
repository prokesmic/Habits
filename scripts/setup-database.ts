#!/usr/bin/env tsx
/**
 * Script to set up the Supabase database schema
 * Run with: npx tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js';
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

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('🚀 Setting up database schema...\n');

  try {
    // Read the SQL schema file
    const schemaPath = join(__dirname, '../docs/SUPABASE_SCHEMA.sql');
    const sql = readFileSync(schemaPath, 'utf-8');

    // Split SQL into individual statements (simple approach)
    // Remove comments and split by semicolons
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements
      if (!statement || statement.length < 10) continue;

      try {
        // Use RPC to execute SQL (if available) or use direct query
        // Note: Supabase JS client doesn't have direct SQL execution
        // We'll need to use the REST API or provide instructions
        
        // For now, we'll output the SQL and provide instructions
        if (i === 0) {
          console.log('⚠️  Direct SQL execution via JS client is limited.');
          console.log('📋 Please run the SQL manually in Supabase SQL Editor:\n');
          console.log('   1. Go to: https://app.supabase.com/project/tzrkpyueudhvkdnkiclt/sql/new');
          console.log('   2. Copy the contents of docs/SUPABASE_SCHEMA.sql');
          console.log('   3. Paste and click "Run"\n');
          break;
        }
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error);
      }
    }

    // Alternative: Use Supabase Management API if available
    console.log('💡 Alternative: Using Supabase REST API...\n');
    
    // Try to execute via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (response.ok) {
      console.log('✅ Database schema set up successfully!\n');
    } else {
      console.log('⚠️  Could not execute via REST API.');
      console.log('📋 Please run the SQL manually in Supabase SQL Editor.\n');
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.log('\n📋 Please run the SQL manually:');
    console.log('   1. Go to: https://app.supabase.com/project/tzrkpyueudhvkdnkiclt/sql/new');
    console.log('   2. Copy the contents of docs/SUPABASE_SCHEMA.sql');
    console.log('   3. Paste and click "Run"\n');
    process.exit(1);
  }
}

setupDatabase();

