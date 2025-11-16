#!/usr/bin/env tsx
/**
 * Execute migration directly in Supabase
 * This uses Supabase Management API to execute SQL
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load .env.local manually
function loadEnv() {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '../.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

async function executeMigration() {
  console.log('🚀 Executing Supabase migration...\n');

  try {
    // Read migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20240101000000_fix_rls_policies.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Migration file loaded\n');

    // Extract project ref from URL
    const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
    if (!urlMatch) {
      throw new Error('Invalid Supabase URL format');
    }
    const projectRef = urlMatch[1];

    console.log(`🔧 Project: ${projectRef}`);
    console.log(`🔗 URL: ${supabaseUrl}\n`);

    // Try Method 1: Supabase Management API (requires access token, not service key)
    // This typically requires a different auth method, so let's try REST API first
    
    // Method 2: Use Supabase REST API via rpc/exec_sql if that function exists
    // Otherwise, we'll need to use pg directly or manual execution
    
    // Method 3: Use Supabase's SQL API endpoint via REST
    const restUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
    
    console.log('🔄 Attempting to execute via REST API...\n');
    
    const response = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ query: sql }),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log('✅ Migration executed successfully!\n');
      if (responseText) {
        console.log('Response:', responseText);
      }
      return;
    }

    // If REST API doesn't work, try splitting into statements and executing via REST
    console.log('⚠️  Direct REST API failed. Trying statement-by-statement approach...\n');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .filter(s => !s.match(/^\s*$/));

    console.log(`📋 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip very short statements
      if (statement.length < 10) continue;

      try {
        // Try executing via REST API for each statement
        // Note: This may not work if exec_sql function doesn't exist
        console.log(`  [${i + 1}/${statements.length}] Executing statement...`);
        
        // For now, since we can't execute SQL directly via JS client,
        // we'll output what needs to be done manually
        if (i === 0) {
          console.log('\n⚠️  Automatic execution not available.');
          console.log('📋 The migration needs to be run manually in Supabase SQL Editor.\n');
          console.log('To run manually:');
          console.log('1. Go to: https://app.supabase.com');
          console.log(`2. Select your project (ref: ${projectRef})`);
          console.log('3. Navigate to SQL Editor');
          console.log('4. Copy and paste the migration SQL');
          console.log(`5. Migration file: ${migrationPath}\n`);
          
          // Output the SQL so they can copy it
          console.log('--- COPY THE SQL BELOW ---\n');
          console.log(sql);
          console.log('\n--- END OF SQL ---\n');
          break;
        }
        
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error on statement ${i + 1}:`, error instanceof Error ? error.message : error);
      }
    }

    if (errorCount === 0 && successCount > 0) {
      console.log(`\n✅ Successfully executed ${successCount} statements\n`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    console.error('\n📋 Please run the migration manually in Supabase SQL Editor.\n');
    process.exit(1);
  }
}

executeMigration();

