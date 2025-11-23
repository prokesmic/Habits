# Quick Guide: How to Set Your Anthropic API Key

## 🎯 Quick Answer

### Step 1: Get Your API Key
1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign in (or create an account if needed)
3. Go to **API Keys** section
4. Click **"Create Key"** 
5. Copy your key (it starts with `sk-ant-...`)

### Step 2: Set It (Choose ONE method)

#### ✅ Method 1: Quick & Easy (Recommended)
Run this helper script:
```bash
./SETUP_API_KEY.sh
```

#### ✅ Method 2: Environment Variable (Current Session Only)
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
npm run test:ai
```

#### ✅ Method 3: Environment Variable (Permanent)
Add to your `~/.zshrc` file:
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

#### ✅ Method 4: Create .env.test File
```bash
cd /Users/michal/Habits
cat > .env.test << EOF
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
TEST_BASE_URL=https://habits-sooty.vercel.app
EOF
```

Then run:
```bash
npm run test:ai
```

### Step 3: Verify It Works
```bash
npm run test:ai
```

Look for this in the output:
```
🤖 Generating test cases with AI...
✅ Generated 8 test cases
```

If you see "⚠️ Anthropic API key not found", check your setup again.

---

## 📖 More Details

- See [API_KEY_SETUP.md](./API_KEY_SETUP.md) for complete instructions
- See [QUICKSTART.md](./QUICKSTART.md) for full testing guide

