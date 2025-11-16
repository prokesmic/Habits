#!/usr/bin/env node
/**
 * Execute Supabase schema using Management API
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

// Read .env.local manually
let supabaseUrl, serviceKey;
try {
  const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf-8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=').slice(1).join('=').trim();
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      serviceKey = line.split('=').slice(1).join('=').trim();
    }
  }
} catch (e) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing environment variables');
  console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const schemaPath = join(__dirname, '../docs/SUPABASE_SCHEMA.sql');
const sql = readFileSync(schemaPath, 'utf-8');

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Could not extract project reference from URL');
  process.exit(1);
}

console.log('🚀 Executing database schema...\n');
console.log(`📦 Project: ${projectRef}`);
console.log(`🔗 URL: ${supabaseUrl}\n`);

// Use Supabase Management API
const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

async function executeSchema() {
  try {
    // Split SQL into statements and execute one by one
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} statements\n`);

    // Note: Supabase Management API requires authentication
    // For now, we'll provide the SQL and instructions
    console.log('⚠️  Direct execution via API requires additional setup.');
    console.log('📋 Please run the SQL manually:\n');
    console.log(`   1. Open: https://app.supabase.com/project/${projectRef}/sql/new`);
    console.log('   2. Copy the SQL below');
    console.log('   3. Paste and click "Run"\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(sql);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Try to open browser
    const { execSync } = require('child_process');
    try {
      execSync(`open "https://app.supabase.com/project/${projectRef}/sql/new"`);
      console.log('🌐 Opened SQL Editor in your browser\n');
    } catch (e) {
      // Ignore
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

executeSchema();

