#!/usr/bin/env tsx
/**
 * Execute migration directly via PostgreSQL connection
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local manually
function loadEnv() {
  const envPath = join(__dirname, '../.env.local');
  try {
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
  } catch (error) {
    console.error('❌ Could not load .env.local');
    process.exit(1);
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function executeMigration() {
  console.log('🚀 Executing Supabase migration...\n');

  try {
    // Read migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20240101000000_fix_rls_policies.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Migration file loaded\n');

    // Extract project ref
    const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
    if (!urlMatch) {
      throw new Error('Invalid Supabase URL');
    }
    const projectRef = urlMatch[1];

    console.log(`🔧 Project: ${projectRef}\n`);

    // Try using Supabase REST API to create a function that executes SQL
    // First, let's try the Management API approach with service role key
    
    // Actually, the best approach is to use Supabase's RPC if we can create a temporary function
    // But that requires SQL execution first...
    
    // Let's try using the Supabase client to execute via REST API
    // We'll need to check if there's an exec_sql function or similar
    
    console.log('🔄 Attempting to execute via Supabase REST API...\n');
    
    // Try using the REST API to execute SQL statements
    // Note: Supabase doesn't expose raw SQL execution via REST by default
    // We need to use a workaround or direct database connection
    
    // Method: Use Supabase JS client to execute statements if possible
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    });

    // Split SQL into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\s*$/));

    console.log(`📋 Found ${statements.length} SQL statements\n`);

    // Since we can't execute raw SQL directly via Supabase JS client,
    // we need to use a direct database connection
    // Check if pg is available
    try {
      const { Client } = await import('pg');
      
      if (!dbPassword) {
        throw new Error('SUPABASE_DB_PASSWORD not found. Cannot connect directly.');
      }

      console.log('✅ pg library found. Connecting to database...\n');

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

      await client.connect();
      console.log('✅ Connected to database\n');

      console.log('🔧 Executing migration...\n');

      // Execute the full SQL
      await client.query(sql);

      console.log('✅ Migration executed successfully!\n');
      console.log('✅ All RLS policies and triggers have been created\n');

      await client.end();
      return;

    } catch (pgError) {
      if (pgError instanceof Error && pgError.message.includes('Cannot find module')) {
        console.log('⚠️  pg library not found. Trying alternative method...\n');
      } else if (pgError instanceof Error && pgError.message.includes('SUPABASE_DB_PASSWORD')) {
        console.log('⚠️  Database password not found. Using manual method...\n');
      } else {
        throw pgError;
      }
    }

    // Fallback: Manual instructions
    console.log('📋 AUTOMATIC EXECUTION NOT AVAILABLE');
    console.log('====================================\n');
    console.log('To execute the migration manually:');
    console.log(`1. Go to: https://app.supabase.com/project/${projectRef}/sql/new`);
    console.log('2. Copy and paste the SQL below\n');
    console.log('--- COPY SQL BELOW ---\n');
    console.log(sql);
    console.log('\n--- END OF SQL ---\n');
    console.log('3. Click "Run" to execute\n');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

executeMigration();

