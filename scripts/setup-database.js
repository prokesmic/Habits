#!/usr/bin/env node
/**
 * Script to help set up the Supabase database schema
 * This script will open the SQL file and provide instructions
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

const schemaPath = join(__dirname, '../docs/SUPABASE_SCHEMA.sql');

console.log('🚀 Database Schema Setup Helper\n');

try {
  const sql = readFileSync(schemaPath, 'utf-8');
  
  console.log('✅ Found schema file: docs/SUPABASE_SCHEMA.sql\n');
  console.log('📋 To set up your database:\n');
  console.log('   1. Open: https://app.supabase.com/project/tzrkpyueudhvkdnkiclt/sql/new');
  console.log('   2. Copy the SQL below (or from docs/SUPABASE_SCHEMA.sql)');
  console.log('   3. Paste into the SQL Editor');
  console.log('   4. Click "Run" (or press Cmd+Enter)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(sql);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Try to open the file in the default editor
  try {
    const platform = process.platform;
    if (platform === 'darwin') {
      execSync(`open ${schemaPath}`);
      console.log('📄 Opened schema file in your default editor\n');
    } else if (platform === 'win32') {
      execSync(`start ${schemaPath}`);
      console.log('📄 Opened schema file in your default editor\n');
    } else {
      execSync(`xdg-open ${schemaPath}`);
      console.log('📄 Opened schema file in your default editor\n');
    }
  } catch (e) {
    // Ignore errors opening the file
  }
  
} catch (error) {
  console.error('❌ Error reading schema file:', error.message);
  console.log('\n📋 Please manually open: docs/SUPABASE_SCHEMA.sql\n');
  process.exit(1);
}

