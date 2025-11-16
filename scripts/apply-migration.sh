#!/bin/bash
# Script to apply Supabase migration
# This script will help you run the migration in Supabase

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
MIGRATION_FILE="$PROJECT_ROOT/supabase/migrations/20240101000000_fix_rls_policies.sql"

# Load environment variables from .env.local
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs)
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
  exit 1
fi

# Extract project reference
PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https?://([^.]+)\.supabase\.co.*|\1|')

echo "🚀 Supabase Migration Script"
echo "============================="
echo ""
echo "📝 Migration file: $MIGRATION_FILE"
echo "🔧 Project: $PROJECT_REF"
echo "🔗 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
  echo "✅ Supabase CLI found"
  echo ""
  echo "Running migration via Supabase CLI..."
  echo ""
  
  # Try to link and apply migration
  cd "$PROJECT_ROOT"
  
  # Check if project is linked
  if [ ! -f "$PROJECT_ROOT/.supabase/config.toml" ]; then
    echo "⚠️  Supabase project not linked. Linking now..."
    echo "Please enter your Supabase project reference when prompted:"
    supabase link --project-ref "$PROJECT_REF"
  fi
  
  echo "Applying migration..."
  supabase db push || {
    echo ""
    echo "⚠️  Migration via CLI failed. Use manual method below."
  }
else
  echo "ℹ️  Supabase CLI not found. Using manual method..."
  echo ""
fi

echo ""
echo "📋 MANUAL INSTRUCTIONS"
echo "====================="
echo ""
echo "1. Go to Supabase Dashboard:"
echo "   https://app.supabase.com/project/$PROJECT_REF/sql/new"
echo ""
echo "2. Copy the SQL below and paste it into the SQL Editor:"
echo ""
echo "--- COPY BELOW ---"
echo ""
cat "$MIGRATION_FILE"
echo ""
echo "--- END OF SQL ---"
echo ""
echo "3. Click 'Run' to execute the migration"
echo ""
echo "✅ Migration will fix:"
echo "   - Missing INSERT policy for profiles"
echo "   - Missing policies for squads (INSERT/UPDATE/DELETE)"
echo "   - Missing INSERT policy for feed_events"
echo "   - Missing RLS policies for challenges, participants, stakes"
echo "   - Auto-profile creation trigger"
echo ""

# Try to open browser on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  read -p "Open Supabase SQL Editor in browser? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://app.supabase.com/project/$PROJECT_REF/sql/new"
  fi
fi

