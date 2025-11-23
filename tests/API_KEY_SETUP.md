# How to Get and Set Your Anthropic API Key

## Step 1: Get Your API Key from Anthropic

### Option A: If You Already Have an Account

1. Go to the [Anthropic Console](https://console.anthropic.com/)
2. Sign in to your account
3. Navigate to **API Keys** section (usually in Settings or API menu)
4. Click **"Create Key"** or **"New Key"**
5. Copy your API key (it starts with `sk-ant-...`)

### Option B: If You Need to Sign Up

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Click **"Sign Up"** or **"Get Started"**
3. Create an account (you'll need email verification)
4. Add payment information if required (they have a free tier with credits)
5. Navigate to **API Keys** section
6. Create and copy your new API key

**Important**: The API key looks like this:
```
sk-ant-api03-...
```

## Step 2: Set Your API Key

You have **3 options** to set your API key. Choose the one that works best for you:

### Option 1: Environment Variable (Recommended for Testing)

**For macOS/Linux (bash/zsh):**
```bash
# Add to your ~/.zshrc or ~/.bashrc (persistent)
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"

# Or set it just for this session (temporary)
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
npm run test:ai
```

**To make it permanent on macOS:**
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**For Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
npm run test:ai
```

### Option 2: Create a .env.test File (Recommended for Development)

Create a file named `.env.test` in your project root (`/Users/michal/Habits/.env.test`):

```bash
cd /Users/michal/Habits
touch .env.test
```

Then add this content to `.env.test`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
TEST_BASE_URL=https://habits-sooty.vercel.app
```

**Note**: Since `.env*` files are in `.gitignore`, you'll need to create this manually. The file won't be committed to git (which is good for security).

### Option 3: Inline with Command (Quick Testing)

Set it directly when running the command:

**macOS/Linux:**
```bash
ANTHROPIC_API_KEY="sk-ant-api03-your-key-here" npm run test:ai
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"; npm run test:ai
```

## Step 3: Verify It's Working

Run the test command:
```bash
npm run test:ai
```

If you see this in the output, your API key is working:
```
🤖 Generating test cases with AI...
✅ Generated 8 test cases
```

If you see this instead, check your API key:
```
⚠️  Anthropic API key not found. Using fallback test cases.
```

## Troubleshooting

### "API key not found" Error

1. **Check the environment variable is set:**
   ```bash
   # macOS/Linux
   echo $ANTHROPIC_API_KEY
   
   # Windows PowerShell
   echo $env:ANTHROPIC_API_KEY
   ```

2. **If using .env.test file:**
   - Make sure the file is in the project root
   - Check the file name is exactly `.env.test` (not `.env.test.txt`)
   - Verify the content format is correct (no quotes needed around the value)

3. **If the key seems correct but still not working:**
   - Make sure there are no extra spaces
   - Try copying the key again from Anthropic console
   - Check your API key hasn't been revoked

### "Invalid API Key" Error

- Verify the key starts with `sk-ant-`
- Make sure you copied the entire key
- Check if the key has expired or been revoked in the Anthropic console
- Ensure you have API credits available

### Testing Without API Key

The system will still work without an API key, but it will use basic fallback tests instead of AI-generated ones. You'll see:
```
⚠️  Anthropic API key not found. Using fallback test cases.
```

This is fine for basic testing, but you won't get AI-powered test generation and analysis.

## Security Best Practices

1. **Never commit your API key to git** ✅ (already in `.gitignore`)
2. **Use environment variables for production** ✅
3. **Rotate your keys regularly** ✅
4. **Use different keys for dev/staging/production** ✅

## Quick Reference

| Method | Best For | Persistence |
|--------|----------|-------------|
| Environment Variable | Local development | Until you close terminal |
| .env.test file | Project-specific | Persistent in project |
| Inline with command | One-time testing | Only that command |

## Next Steps

Once your API key is set, you're ready to run the AI testing agent:

```bash
npm run test:ai
```

Check out [QUICKSTART.md](./QUICKSTART.md) for more details!

