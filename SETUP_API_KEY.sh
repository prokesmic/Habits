#!/bin/bash
# Helper script to set up Anthropic API key

echo "🔑 Anthropic API Key Setup Helper"
echo "=================================="
echo ""
echo "Step 1: Get your API key from https://console.anthropic.com/"
echo "Step 2: Choose how to set it:"
echo ""
echo "1. Set as environment variable (temporary - current session only)"
echo "2. Add to ~/.zshrc (permanent - all future sessions)"
echo "3. Create .env.test file in project root"
echo ""
read -p "Choose option (1, 2, or 3): " choice

case $choice in
  1)
    read -p "Enter your Anthropic API key: " api_key
    export ANTHROPIC_API_KEY="$api_key"
    echo "✅ API key set for this session!"
    echo "Run: npm run test:ai"
    ;;
  2)
    read -p "Enter your Anthropic API key: " api_key
    echo "export ANTHROPIC_API_KEY=\"$api_key\"" >> ~/.zshrc
    source ~/.zshrc
    echo "✅ API key added to ~/.zshrc"
    echo "It will be available in all future terminal sessions."
    echo "Run: npm run test:ai"
    ;;
  3)
    read -p "Enter your Anthropic API key: " api_key
    cat > .env.test << ENVFILE
ANTHROPIC_API_KEY=$api_key
TEST_BASE_URL=https://habits-sooty.vercel.app
ENVFILE
    echo "✅ Created .env.test file"
    echo "Note: You may need to load this file manually in your test runner"
    echo "Run: npm run test:ai"
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
