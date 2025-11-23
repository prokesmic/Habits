# Habitio AI Testing Agent

Automated testing system that uses AI to test the entire Habitio application.

## Features

- 🤖 AI-powered test generation using Claude
- 🕷️ Automatic page discovery and crawling
- 🧪 Comprehensive interaction testing
- 📊 Beautiful HTML reports with insights
- 🎯 Smart test case prioritization
- 📸 Automatic screenshot capture on failures
- 🔍 Deep analysis of test patterns

## Setup

### 1. Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install -D @anthropic-ai/sdk @axe-core/playwright ts-node
npx playwright install
```

### 2. Configure Environment

Create a `.env.test` file in the project root (or set environment variables):

```env
# Test Configuration
TEST_BASE_URL=https://habits-sooty.vercel.app
ANTHROPIC_API_KEY=your_api_key_here

# Optional: Test User Credentials (for authenticated testing)
TEST_USER_EMAIL=
TEST_USER_PASSWORD=
```

**Important**: You need to set your Anthropic API key in the environment. You can do this by:

- Creating a `.env.test` file (if not blocked)
- Setting environment variables before running: `ANTHROPIC_API_KEY=your_key npm run test:ai`
- Adding to your shell profile or CI/CD environment variables

## Usage

### Run All Tests with AI

```bash
npm run test:ai
```

This will:
1. Crawl your application to discover all pages
2. Use AI to generate test cases for each page
3. Execute all tests
4. Generate comprehensive HTML and JSON reports

### Other Test Commands

```bash
# Run standard Playwright tests
npm run test:e2e

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# View HTML report
npm run test:report
```

## Reports

After running tests, reports are saved to `tests/reports/`:

- **test-report.html** - Beautiful visual HTML report with insights
- **test-report.json** - Raw JSON data for programmatic access
- **screenshots/** - Failure screenshots for debugging

Open `tests/reports/test-report.html` in your browser to view the comprehensive test report.

## How It Works

### 1. Discovery Phase
The agent crawls the application starting from the base URL, following all internal links up to a specified depth (default: 2). It builds a complete sitemap of all discoverable pages.

### 2. Analysis Phase
For each discovered page:
- Extracts all interactive elements (buttons, links, inputs, forms)
- Captures page structure and content
- Uses Claude AI to analyze the page and generate intelligent test cases

### 3. Execution Phase
- Executes each generated test case
- Tests all interactive elements
- Captures screenshots on failures
- Records detailed results

### 4. Reporting Phase
- Generates comprehensive test reports
- Uses AI to analyze patterns in failures
- Provides actionable insights and recommendations
- Creates beautiful HTML visualizations

## Configuration

### Base URL

Set the `TEST_BASE_URL` environment variable to test a different environment:

```bash
TEST_BASE_URL=http://localhost:3000 npm run test:ai
```

Or update `.env.test`:

```env
TEST_BASE_URL=http://localhost:3000
```

### Crawl Depth

The default crawl depth is 2 levels. You can modify this in `tests/test-runner.ts`:

```typescript
const allPages = await agent.crawlApplication(baseUrl, 3); // Change 2 to 3 for deeper crawling
```

### Test Priorities

The AI agent automatically prioritizes tests as:
- **High**: Critical functionality that must work
- **Medium**: Important features
- **Low**: Nice-to-have validations

## Project Structure

```
tests/
  ├── e2e/              # Standard Playwright E2E tests
  ├── utils/
  │   └── ai-agent.ts   # AI testing agent implementation
  ├── reports/          # Generated test reports
  │   ├── test-report.html
  │   ├── test-report.json
  │   └── screenshots/  # Failure screenshots
  ├── dashboard/        # Future dashboard features
  ├── test-runner.ts    # Main test runner script
  └── README.md         # This file
```

## Troubleshooting

### Missing Anthropic API Key

If you see errors about missing API key:
1. Make sure `ANTHROPIC_API_KEY` is set in your environment
2. Check that the API key is valid
3. Ensure you have API credits available

### Timeout Errors

If tests are timing out:
- Increase timeouts in `tests/utils/ai-agent.ts`
- Check network connectivity to the test URL
- Verify the application is accessible

### No Test Cases Generated

If AI fails to generate test cases:
- The agent falls back to basic test cases
- Check your API key and quota
- Review console output for error messages

### Screenshot Directory Issues

If screenshots aren't being saved:
- Check that `tests/reports/screenshots/` directory exists
- Verify write permissions
- The directory is created automatically, but manual creation won't hurt

## Advanced Usage

### Testing Specific Pages

You can modify `tests/test-runner.ts` to test specific URLs only:

```typescript
const allPages = [
  'https://habits-sooty.vercel.app',
  'https://habits-sooty.vercel.app/habits',
  'https://habits-sooty.vercel.app/squads'
];
```

### Custom Test Case Generation

The AI agent can be extended to generate custom test cases. Modify the prompt in `tests/utils/ai-agent.ts` to focus on specific functionality.

### Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run AI Tests
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    TEST_BASE_URL: ${{ secrets.TEST_BASE_URL }}
  run: npm run test:ai
```

## Best Practices

1. **Regular Testing**: Run AI tests regularly to catch regressions early
2. **Review Reports**: Always review the HTML reports for insights
3. **Fix Critical Issues**: Address high-priority failures first
4. **Update API Key**: Keep your Anthropic API key secure and up-to-date
5. **Monitor Costs**: Be aware of API usage costs for large applications

## Support

For issues or questions:
- Check the console output for detailed error messages
- Review the HTML report for insights
- Check Playwright documentation for browser-related issues
- Review Anthropic API documentation for AI-related issues

