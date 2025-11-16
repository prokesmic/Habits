#!/usr/bin/env node
/**
 * Check if database tables exist
 */

const { readFileSync } = require('fs');
const { join } = require('path');

// Read .env.local manually
let supabaseUrl, anonKey;
try {
  const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf-8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=').slice(1).join('=').trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      anonKey = line.split('=').slice(1).join('=').trim();
    }
  }
} catch (e) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function checkTables() {
  const tables = [
    'profiles',
    'habits',
    'habit_logs',
    'squads',
    'squad_members',
    'challenges',
    'challenge_participants',
    'reactions',
    'comments',
    'feed_events',
  ];

  console.log('🔍 Checking database tables...\n');
  console.log(`📦 Project: ${supabaseUrl}\n`);

  // Use fetch to check tables via Supabase REST API
  const results = [];

  for (const table of tables) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=0`, {
        method: 'HEAD',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
      });

      if (response.ok || response.status === 200 || response.status === 406) {
        results.push({ table, exists: true, status: '✅' });
      } else if (response.status === 404) {
        results.push({ table, exists: false, status: '❌' });
      } else {
        results.push({ table, exists: 'unknown', status: '⚠️', error: response.status });
      }
    } catch (error) {
      results.push({ table, exists: false, status: '❌', error: error.message });
    }
  }

  console.log('Results:\n');
  results.forEach(({ table, status, exists, error }) => {
    const statusText = exists === true ? 'EXISTS' : exists === false ? 'MISSING' : 'UNKNOWN';
    console.log(`${status} ${table.padEnd(25)} ${statusText}`);
    if (error) {
      console.log(`   Error: ${error}`);
    }
  });

  const missing = results.filter(r => r.exists === false);
  if (missing.length > 0) {
    console.log(`\n❌ ${missing.length} table(s) are missing. Please run the schema setup.`);
    console.log('   Run: node scripts/run-schema.js');
  } else {
    console.log('\n✅ All tables exist!');
  }
}

checkTables().catch(console.error);

