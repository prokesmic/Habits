# Quick Start Guide - AI Testing Agent

## 🚀 Get Started in 3 Steps

### Step 1: Set Your API Key

You need an Anthropic API key for AI-powered test generation. Get one at: https://console.anthropic.com/

**Option A: Environment Variable (Recommended)**
```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

**Option B: Create .env.test file**
```bash
# Create .env.test in project root
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.test
echo "TEST_BASE_URL=https://habits-sooty.vercel.app" >> .env.test
```

**Option C: Inline with command**
```bash
ANTHROPIC_API_KEY=your_key npm run test:ai
```

### Step 2: Run the Tests

```bash
npm run test:ai
```

This will:
- 🕷️ Crawl your application to find all pages
- 🤖 Use AI to generate intelligent test cases
- 🧪 Execute all tests automatically
- 📊 Generate beautiful HTML reports

### Step 3: View Results

Open the generated report:
```bash
open tests/reports/test-report.html
# Or on Windows:
# start tests/reports/test-report.html
# Or on Linux:
# xdg-open tests/reports/test-report.html
```

## 📋 What Gets Tested

- ✅ All discoverable pages
- ✅ All buttons and interactive elements
- ✅ Navigation links
- ✅ Form inputs and submissions
- ✅ UI state changes
- ✅ Error handling

## 🎯 Example Output

```
🤖 Habitio AI Testing Agent
================================

🚀 Launching browser...

📍 STEP 1: Discovering all pages
================================
🕷️  Crawling application starting from: https://habits-sooty.vercel.app
   📄 Discovered: https://habits-sooty.vercel.app (depth: 0)
   📄 Discovered: https://habits-sooty.vercel.app/habits (depth: 1)
   ...

✅ Crawling complete. Found 15 unique pages

🧪 STEP 2: Testing each page
================================

📄 Page: https://habits-sooty.vercel.app
--------------------------------------------------------------------------------
   🔍 Analyzing: https://habits-sooty.vercel.app
   🤖 Generating test cases with AI...
   ✅ Generated 8 test cases
      🧪 Click 'Sign In' button
         ✅ Passed
      ...

📊 STEP 3: Generating comprehensive report
================================
   🤖 Analyzing results with AI...
   ✅ Report generation complete

================================================================================
📋 TEST SUMMARY
================================================================================
✅ Total Tests: 47
✅ Passed: 42 (89.4%)
❌ Failed: 5 (10.6%)
⚠️  Warnings: 3
⏱️  Duration: 245.32s
🔍 Pages Tested: 15
🧪 Test Cases Generated: 47
```

## 🔧 Troubleshooting

### "ANTHROPIC_API_KEY not found"
Make sure you've set the API key (see Step 1 above).

### "Failed to load page"
- Check your internet connection
- Verify TEST_BASE_URL is correct
- Ensure the application is accessible

### "No test cases generated"
- Verify your API key is valid
- Check you have API credits
- The agent will fall back to basic tests if AI fails

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize test settings in `tests/test-runner.ts`
- Adjust AI prompts in `tests/utils/ai-agent.ts`

