import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { AITestingAgent } from './utils/ai-agent';
import * as fs from 'fs/promises';
import * as path from 'path';

// Load environment variables from .env.test if it exists
async function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.test');
  try {
    const envContent = await fs.readFile(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    });
  } catch (error) {
    // .env.test file doesn't exist, which is fine
    // Environment variables can be set other ways
  }
}

/**
 * Authenticate user before testing
 */
async function authenticateUser(page: Page, email: string, password: string, baseUrl: string): Promise<boolean> {
  try {
    console.log(`🔐 Authenticating as: ${email}`);
    const signInUrl = `${baseUrl}/auth/sign-in`;
    
    await page.goto(signInUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for page to fully load

    // Find and fill email field
    const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(email);
    
    await page.waitForTimeout(500);

    // Find and fill password field
    const passwordInput = page.locator('input[type="password"], input[name*="password" i]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill(password);
    
    await page.waitForTimeout(500);

    // Find and click sign in button
    const signInButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In")').first();
    await signInButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Wait for button to be enabled if it's disabled
    const isDisabled = await signInButton.isDisabled({ timeout: 1000 }).catch(() => false);
    if (isDisabled) {
      console.log('   ⏳ Waiting for form validation...');
      await signInButton.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(1000);
    }
    
    await signInButton.click({ timeout: 5000 });
    
    // Wait for navigation after sign in - check for dashboard or home page
    try {
      await page.waitForURL('**/dashboard**', { timeout: 10000 });
    } catch {
      // If no redirect to dashboard, wait for any navigation or check current URL
      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      // Check if we're no longer on sign-in page
      if (currentUrl.includes('/auth/sign-in')) {
        // Check for error messages
        const errorVisible = await page.locator('[role="alert"], .error, .error-message').isVisible({ timeout: 2000 }).catch(() => false);
        if (errorVisible) {
          throw new Error('Authentication failed - error message visible on sign-in page');
        }
        throw new Error('Still on sign-in page - authentication may have failed');
      }
    }

    // Wait a bit more for the app to fully load
    await page.waitForTimeout(2000);
    
    console.log(`   ✅ Successfully authenticated! Current URL: ${page.url()}`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Authentication failed: ${error.message}`);
    return false;
  }
}

async function runComprehensiveTests() {
  // Load .env.test file if it exists
  await loadEnvFile();
  console.log('🤖 Habitio AI Testing Agent');
  console.log('================================\n');

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
    
    page = await context.newPage();
    const agent = new AITestingAgent(page);

    const baseUrl = process.env.TEST_BASE_URL || 'https://habits-sooty.vercel.app';
    
    // Authenticate before testing
    const email = process.env.TEST_USER_EMAIL || 'sirmisa@gmail.com';
    const password = process.env.TEST_USER_PASSWORD || 'heslo1234';
    
    console.log('\n🔐 STEP 0: Authenticating user');
    console.log('================================');
    const authenticated = await authenticateUser(page, email, password, baseUrl);
    
    // Step 1: Crawl the application
    console.log('\n📍 STEP 1: Discovering all pages');
    console.log('================================');
    
    let crawlStartUrl = baseUrl;
    let crawlDepth = 2; // Default depth for unauthenticated
    let seedUrls: string[] = [];
    
    if (authenticated) {
      console.log('\n✅ Authentication successful! Starting crawl from authenticated pages...');
      
      // Start from dashboard and add known authenticated routes as seed URLs
      crawlStartUrl = `${baseUrl}/dashboard`;
      crawlDepth = 4; // Increased depth for authenticated app to find more nested pages
      
      // Comprehensive list of all authenticated routes to test
      seedUrls = [
        // Core dashboard & navigation
        `${baseUrl}/dashboard`,
        `${baseUrl}/home`,

        // Habits feature
        `${baseUrl}/habits`,
        `${baseUrl}/habits/new`,

        // Squads feature
        `${baseUrl}/squads`,
        `${baseUrl}/squads/new`,
        `${baseUrl}/squads/join`,

        // Challenges feature
        `${baseUrl}/challenges`,
        `${baseUrl}/challenges/new`,
        `${baseUrl}/challenges/discover`,

        // Workspaces feature
        `${baseUrl}/workspaces`,
        `${baseUrl}/workspaces/new`,

        // Analytics & stats
        `${baseUrl}/analytics`,
        `${baseUrl}/leaderboards`,
        `${baseUrl}/recap`,

        // Social & discovery
        `${baseUrl}/discover`,
        `${baseUrl}/referrals`,

        // User management
        `${baseUrl}/profile`,
        `${baseUrl}/settings`,
        `${baseUrl}/notifications`,

        // Monetization
        `${baseUrl}/stakes`,
        `${baseUrl}/money`,
        `${baseUrl}/money/transactions`,
        `${baseUrl}/money/payouts`,

        // Support
        `${baseUrl}/help`,
        `${baseUrl}/support/contact`,

        // Integrations
        `${baseUrl}/integrations`,

        // Developer
        `${baseUrl}/developer`,
      ];
      
      console.log(`   🎯 Starting from: ${crawlStartUrl}`);
      console.log(`   📊 Crawl depth: ${crawlDepth}`);
      console.log(`   🔗 Seeding with ${seedUrls.length} known authenticated routes`);
    } else {
      console.log('\n⚠️  Authentication failed. Proceeding with unauthenticated testing...');
      console.log(`   🎯 Starting from: ${crawlStartUrl}`);
      console.log(`   📊 Crawl depth: ${crawlDepth}`);
    }
    
    // Start crawl - with seed URLs if authenticated
    const allPages = authenticated && seedUrls.length > 0
      ? await agent.crawlApplicationWithSeeds(crawlStartUrl, crawlDepth, seedUrls)
      : await agent.crawlApplication(crawlStartUrl, crawlDepth);

    // Step 2: Test each page
    console.log('\n🧪 STEP 2: Testing each page');
    console.log('================================');
    
    let totalTestCases = 0;
    
    for (const url of allPages) {
      console.log(`\n📄 Page: ${url}`);
      console.log('-'.repeat(80));
      
      try {
        // Generate test cases for this page
        const testCases = await agent.analyzePage(url);
        totalTestCases += testCases.length;
        
        if (testCases.length === 0) {
          console.log(`   ⚠️  No test cases generated for this page`);
          continue;
        }
        
        // Execute test cases
        for (const testCase of testCases) {
          await agent.executeTestCase(testCase);
        }
        
        // Test all interactive elements
        const interactionReport = await agent.testAllInteractiveElements();
        console.log(`      ✅ Tested ${interactionReport.buttons.length} buttons, ${interactionReport.links.length} links, ${interactionReport.inputs.length} inputs`);
        
      } catch (error: any) {
        console.error(`   ❌ Error testing page: ${error.message}`);
      }
    }

    // Step 3: Generate report
    console.log('\n📊 STEP 3: Generating comprehensive report');
    console.log('================================');
    const report = await agent.generateReport();
    
    // Create reports directory
    const reportsDir = path.join(process.cwd(), 'tests', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    // Save JSON report
    await fs.writeFile(
      path.join(reportsDir, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Generate HTML report
    await generateHTMLReport(report, reportsDir);

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${report.summary.passed} (${((report.summary.passed/report.summary.total)*100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${report.summary.failed} (${((report.summary.failed/report.summary.total)*100).toFixed(1)}%)`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`⏱️  Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s`);
    console.log(`🔍 Pages Tested: ${allPages.length}`);
    console.log(`🧪 Test Cases Generated: ${totalTestCases}`);
    console.log('\n📄 Reports saved to: tests/reports/');
    console.log('   - test-report.json');
    console.log('   - test-report.html');
    
    if (report.insights.criticalIssues && report.insights.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      report.insights.criticalIssues.forEach((issue: string, i: number) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

async function generateHTMLReport(report: any, reportsDir: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Habitio Test Report - ${new Date(report.timestamp).toLocaleString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      color: #333;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      padding: 50px 40px;
      color: white;
    }
    .header h1 {
      font-size: 42px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header .subtitle {
      font-size: 18px;
      opacity: 0.95;
      margin-bottom: 5px;
    }
    .header .timestamp {
      opacity: 0.85;
      font-size: 14px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      padding: 40px;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }
    .summary-card {
      background: white;
      padding: 28px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .summary-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .summary-card .label {
      font-size: 13px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .summary-card .value {
      font-size: 36px;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }
    .summary-card.passed .value { color: #10b981; }
    .summary-card.failed .value { color: #ef4444; }
    .summary-card.warnings .value { color: #f59e0b; }
    .summary-card.total .value { color: #6366f1; }
    .percentage {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
    .insights {
      padding: 40px;
      background: #fff;
    }
    .insights h2 {
      font-size: 28px;
      margin-bottom: 24px;
      color: #1f2937;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .insight-section {
      margin-bottom: 32px;
      background: #f9fafb;
      padding: 24px;
      border-radius: 12px;
    }
    .insight-section h3 {
      font-size: 20px;
      color: #374151;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .insight-list {
      list-style: none;
    }
    .insight-list li {
      padding: 14px 18px;
      background: white;
      margin-bottom: 10px;
      border-radius: 8px;
      border-left: 4px solid #FF6B35;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      line-height: 1.6;
    }
    .risk-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 24px;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .risk-low { background: #d1fae5; color: #065f46; }
    .risk-medium { background: #fed7aa; color: #92400e; }
    .risk-high { background: #fecaca; color: #991b1b; }
    .risk-critical { background: #dc2626; color: white; }
    .results {
      padding: 40px;
      background: #f8f9fa;
    }
    .results h2 {
      font-size: 28px;
      margin-bottom: 24px;
      font-weight: 700;
      color: #1f2937;
    }
    .test-result {
      background: white;
      padding: 24px;
      margin-bottom: 20px;
      border-radius: 12px;
      border-left: 5px solid #e5e7eb;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .test-result.passed { border-left-color: #10b981; }
    .test-result.failed { border-left-color: #ef4444; }
    .test-result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .test-name {
      font-weight: 600;
      font-size: 17px;
      color: #1f2937;
      flex: 1;
    }
    .test-meta {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .test-status {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .test-status.passed { background: #d1fae5; color: #065f46; }
    .test-status.failed { background: #fecaca; color: #991b1b; }
    .priority-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .priority-high { background: #fecaca; color: #991b1b; }
    .priority-medium { background: #fed7aa; color: #92400e; }
    .priority-low { background: #e0e7ff; color: #3730a3; }
    .error-list {
      margin-top: 16px;
      padding: 16px;
      background: #fef2f2;
      border-radius: 8px;
      border-left: 3px solid #dc2626;
    }
    .error-item {
      color: #dc2626;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
    .error-item:last-child {
      margin-bottom: 0;
    }
    .error-step {
      font-weight: 600;
      color: #991b1b;
    }
    .duration {
      font-size: 13px;
      color: #6b7280;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #9ca3af;
    }
    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Habitio Test Report</h1>
      <div class="subtitle">Automated Testing Results</div>
      <div class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</div>
    </div>
    
    <div class="summary">
      <div class="summary-card total">
        <div class="label">Total Tests</div>
        <div class="value">${report.summary.total}</div>
      </div>
      <div class="summary-card passed">
        <div class="label">Passed</div>
        <div class="value">${report.summary.passed}</div>
        <div class="percentage">${report.summary.total > 0 ? ((report.summary.passed/report.summary.total)*100).toFixed(1) : 0}% success rate</div>
      </div>
      <div class="summary-card failed">
        <div class="label">Failed</div>
        <div class="value">${report.summary.failed}</div>
        <div class="percentage">${report.summary.total > 0 ? ((report.summary.failed/report.summary.total)*100).toFixed(1) : 0}% failure rate</div>
      </div>
      <div class="summary-card warnings">
        <div class="label">Warnings</div>
        <div class="value">${report.summary.warnings}</div>
      </div>
      <div class="summary-card">
        <div class="label">Duration</div>
        <div class="value">${(report.summary.totalDuration / 1000).toFixed(1)}<span style="font-size: 18px;">s</span></div>
      </div>
    </div>

    ${report.insights && (report.insights.criticalIssues?.length > 0 || report.insights.patterns?.length > 0 || report.insights.recommendations?.length > 0) ? `
    <div class="insights">
      <h2>🔍 AI Insights</h2>
      
      ${report.insights.criticalIssues && report.insights.criticalIssues.length > 0 ? `
      <div class="insight-section">
        <h3>🚨 Critical Issues</h3>
        <ul class="insight-list">
          ${report.insights.criticalIssues.map((issue: string) => `<li>${issue}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${report.insights.patterns && report.insights.patterns.length > 0 ? `
      <div class="insight-section">
        <h3>📊 Patterns Detected</h3>
        <ul class="insight-list">
          ${report.insights.patterns.map((pattern: string) => `<li>${pattern}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${report.insights.recommendations && report.insights.recommendations.length > 0 ? `
      <div class="insight-section">
        <h3>💡 Recommendations</h3>
        <ul class="insight-list">
          ${report.insights.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${report.insights.riskLevel ? `
      <div class="insight-section">
        <h3>⚠️ Risk Assessment</h3>
        <span class="risk-badge risk-${report.insights.riskLevel}">
          ${report.insights.riskLevel.toUpperCase()} RISK
        </span>
      </div>
      ` : ''}
    </div>
    ` : ''}

    <div class="results">
      <h2>📋 Detailed Test Results</h2>
      ${report.detailedResults && report.detailedResults.length > 0 ? report.detailedResults.map((result: any) => `
        <div class="test-result ${result.status}">
          <div class="test-result-header">
            <div class="test-name">${result.name}</div>
            <div class="test-meta">
              <span class="priority-badge priority-${result.priority}">${result.priority}</span>
              <span class="test-status ${result.status}">${result.status}</span>
            </div>
          </div>
          <div class="duration">Duration: ${result.duration}ms</div>
          ${result.errors && result.errors.length > 0 ? `
            <div class="error-list">
              ${result.errors.map((error: any) => `
                <div class="error-item">
                  <span class="error-step">${error.step}:</span> ${error.message}
                  ${error.screenshot ? `<br><a href="screenshots/${error.screenshot}" target="_blank">📸 View Screenshot</a>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('') : `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p>No test results available</p>
        </div>
      `}
    </div>
  </div>
</body>
</html>
  `;

  await fs.writeFile(path.join(reportsDir, 'test-report.html'), html);
}

// Run the tests
if (require.main === module) {
  runComprehensiveTests()
    .then(() => {
      console.log('\n✅ All tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runComprehensiveTests };

