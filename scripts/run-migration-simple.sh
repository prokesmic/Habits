#!/bin/bash
# Simple script to output the migration SQL for manual execution
# Run with: bash scripts/run-migration-simple.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATION_FILE="$SCRIPT_DIR/../supabase/migrations/20240101000000_fix_rls_policies.sql"

echo "🚀 Supabase Migration SQL"
echo "=========================="
echo ""
echo "📝 Migration file: $MIGRATION_FILE"
echo ""
echo "📋 Copy the SQL below and paste it into your Supabase SQL Editor:"
echo "   https://app.supabase.com > Your Project > SQL Editor"
echo ""
echo "--- SQL START ---"
echo ""
cat "$MIGRATION_FILE"
echo ""
echo "--- SQL END ---"
echo ""
echo "✅ After pasting, click 'Run' to execute the migration"

