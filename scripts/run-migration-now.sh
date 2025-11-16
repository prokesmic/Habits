#!/bin/bash
# Execute migration in Supabase - This will open the SQL editor with the migration ready

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
MIGRATION_FILE="$PROJECT_ROOT/supabase/migrations/20240101000000_fix_rls_policies.sql"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs 2>/dev/null)
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL not found"
  exit 1
fi

PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https?://([^.]+)\.supabase\.co.*|\1|')
SQL_EDITOR_URL="https://app.supabase.com/project/$PROJECT_REF/sql/new"

echo "🚀 Executing Supabase Migration"
echo "================================="
echo ""
echo "📝 Migration: $MIGRATION_FILE"
echo "🔧 Project: $PROJECT_REF"
echo ""

# Read and display the migration SQL
MIGRATION_SQL=$(cat "$MIGRATION_FILE")

echo "📋 MIGRATION SQL:"
echo "================="
echo ""
echo "$MIGRATION_SQL"
echo ""
echo "================="
echo ""

# Copy to clipboard on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "$MIGRATION_SQL" | pbcopy
  echo "✅ SQL copied to clipboard!"
  echo ""
fi

echo "🌐 Opening Supabase SQL Editor..."
echo "   URL: $SQL_EDITOR_URL"
echo ""

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$SQL_EDITOR_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "$SQL_EDITOR_URL" 2>/dev/null || echo "Please open: $SQL_EDITOR_URL"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  start "$SQL_EDITOR_URL" 2>/dev/null || echo "Please open: $SQL_EDITOR_URL"
else
  echo "Please open this URL in your browser: $SQL_EDITOR_URL"
fi

echo ""
echo "📝 NEXT STEPS:"
echo "=============="
echo "1. The SQL Editor should open in your browser"
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "2. The SQL is already copied to your clipboard - just paste it (Cmd+V)"
else
  echo "2. Copy the SQL shown above and paste it into the SQL Editor"
fi
echo "3. Click 'Run' to execute the migration"
echo ""
echo "✅ This will fix all the Supabase RLS policies and triggers!"
echo ""

