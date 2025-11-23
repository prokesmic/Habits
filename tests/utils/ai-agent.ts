import Anthropic from '@anthropic-ai/sdk';
import { Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

interface TestCase {
  name: string;
  priority: 'high' | 'medium' | 'low';
  steps: TestStep[];
  expectedOutcome: string;
}

interface TestStep {
  action: 'click' | 'fill' | 'navigate' | 'wait' | 'assert' | 'hover' | 'select';
  selector: string;
  value?: string;
  expectedResult: string;
}

interface TestResult {
  name: string;
  priority: string;
  status: 'passed' | 'failed' | 'skipped';
  errors: Array<{
    step: string;
    message: string;
    screenshot?: string;
  }>;
  warnings: string[];
  duration: number;
  screenshots: string[];
}

interface PageElement {
  type: 'button' | 'link' | 'input' | 'form';
  text?: string;
  id?: string;
  className?: string;
  href?: string;
  disabled?: boolean;
}

interface InteractionReport {
  buttons: Array<{
    index: number;
    text: string;
    status: 'clickable' | 'disabled' | 'error';
    error?: string;
    causedNavigation?: boolean;
    causedVisualChange?: boolean;
    caused404?: boolean;
  }>;
  links: Array<{
    index: number;
    text: string;
    href: string;
    status: 'working' | 'broken' | '404';
    error?: string;
  }>;
  inputs: Array<{
    index: number;
    type: string;
    name: string;
    status: 'functional' | 'error';
    error?: string;
  }>;
  forms: Array<{
    index: number;
    action: string;
    method: string;
    status: 'functional' | 'error';
  }>;
  notFoundPages: Array<{
    url: string;
    triggeredBy: string;
  }>;
}

export class AITestingAgent {
  private page: Page;
  private testResults: TestResult[] = [];
  private screenshotDir: string;

  constructor(page: Page) {
    this.page = page;
    this.screenshotDir = path.join(process.cwd(), 'tests', 'reports', 'screenshots');
  }

  /**
   * Check if the current page is a 404/Not Found page
   */
  private async is404Page(): Promise<boolean> {
    try {
      // Check page title for 404 indicators
      const title = await this.page.title();
      if (title.toLowerCase().includes('404') || title.toLowerCase().includes('not found')) {
        return true;
      }

      // Check for common 404 indicators in the page content
      const pageContent = await this.page.evaluate(() => {
        const body = document.body;
        return body ? body.innerText.toLowerCase().substring(0, 2000) : '';
      });

      const notFoundIndicators = [
        'page not found',
        '404',
        'this page could not be found',
        'this page doesn\'t exist',
        'page does not exist',
        'not found',
        'the page you requested',
        'oops! we couldn\'t find'
      ];

      for (const indicator of notFoundIndicators) {
        if (pageContent.includes(indicator)) {
          // Make sure it's not just a mention of 404 in content
          const h1Text = await this.page.$eval('h1', el => el?.textContent?.toLowerCase() || '').catch(() => '');
          if (h1Text.includes('404') || h1Text.includes('not found') || h1Text.includes('error')) {
            return true;
          }
          // Check if 404 is prominent on the page
          const largeText = await this.page.$$eval('h1, h2, [class*="error"], [class*="404"]', els =>
            els.map(el => (el as HTMLElement).innerText?.toLowerCase() || '').join(' ')
          ).catch(() => '');
          if (largeText.includes('404') || largeText.includes('not found')) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Analyze a page and generate test cases using Claude
   */
  async analyzePage(url: string): Promise<TestCase[]> {
    console.log(`   🔍 Analyzing: ${url}`);
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await this.page.waitForTimeout(2000); // Wait for dynamic content
    } catch (error: any) {
      console.log(`   ⚠️  Failed to load ${url}: ${error.message}`);
      return [];
    }

    // Extract page elements
    const buttons = await this.page.$$eval('button', btns => 
      btns.map((btn, i) => ({
        index: i,
        text: btn.textContent?.trim() || '',
        id: btn.id,
        className: btn.className,
        disabled: btn.disabled,
        visible: btn.offsetParent !== null
      }))
    );

    const links = await this.page.$$eval('a', links => 
      links.map((link, i) => ({
        index: i,
        text: link.textContent?.trim() || '',
        href: link.getAttribute('href') || '',
        visible: link.offsetParent !== null
      }))
    );

    const inputs = await this.page.$$eval('input, textarea', inputs =>
      inputs.map((input, i) => ({
        index: i,
        type: input.getAttribute('type') || 'text',
        name: input.getAttribute('name') || '',
        placeholder: input.getAttribute('placeholder') || '',
        required: input.hasAttribute('required'),
        visible: (input as HTMLElement).offsetParent !== null
      }))
    );

    const forms = await this.page.$$eval('form', forms => 
      forms.map((form, i) => ({
        index: i,
        action: form.action,
        method: form.method
      }))
    );

    // Get page title and visible text
    const pageTitle = await this.page.title();
    const mainContent = await this.page.evaluate(() => {
      const body = document.body;
      return body.innerText.substring(0, 1000); // First 1000 chars
    });

    // Use Claude to analyze and generate test cases
    console.log(`   🤖 Generating test cases with AI...`);
    
    if (!anthropic) {
      console.log(`   ⚠️  Anthropic API key not found. Using fallback test cases.`);
      return this.generateFallbackTestCases(buttons, links, inputs);
    }
    
    // Extract data-testid attributes
    const testIds = await this.page.$$eval('[data-testid]', els =>
      els.map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        visible: (el as HTMLElement).offsetParent !== null
      }))
    );

    // Determine page type from URL for context-aware test generation
    const urlPath = new URL(url).pathname;
    const pageType = this.getPageType(urlPath);

    const prompt = `You are an expert QA testing agent for Habitio, a habit tracking app with social features. Generate comprehensive test cases for ALL features, buttons, links, and functionality on this page.

URL: ${url}
Page Title: ${pageTitle}
Page Type: ${pageType}

PAGE ELEMENTS DISCOVERED:
- Buttons: ${buttons.filter(b => b.visible).length} visible (${buttons.filter(b => !b.disabled).length} enabled)
- Links: ${links.filter(l => l.visible).length} visible
- Input fields: ${inputs.filter(i => i.visible).length} visible
- Forms: ${forms.length}
- Elements with data-testid: ${testIds.filter(t => t.visible).length}

Data-testid Elements: ${JSON.stringify(testIds.filter(t => t.visible), null, 2)}
All Visible Buttons: ${JSON.stringify(buttons.filter(b => b.visible), null, 2)}
All Visible Links: ${JSON.stringify(links.filter(l => l.visible).slice(0, 20), null, 2)}
Input Fields: ${JSON.stringify(inputs.filter(i => i.visible), null, 2)}
Forms: ${JSON.stringify(forms, null, 2)}

Main Content Preview: ${mainContent}

HABITIO APP CONTEXT - Generate tests specific to these features:
${pageType === 'habits' ? `
HABITS PAGE TESTS:
- Test creating a new habit (click "New Habit" or similar button)
- Test viewing habit details
- Test completing/checking off a habit
- Test editing habit settings
- Test deleting a habit
- Test habit streak display
- Test habit frequency settings` : ''}
${pageType === 'squads' ? `
SQUADS PAGE TESTS:
- Test creating a new squad
- Test joining an existing squad
- Test viewing squad members
- Test squad chat functionality
- Test inviting members to squad
- Test leaving a squad
- Test squad settings` : ''}
${pageType === 'challenges' ? `
CHALLENGES PAGE TESTS:
- Test creating a new challenge
- Test joining a challenge
- Test viewing challenge leaderboard
- Test challenge progress tracking
- Test discovering public challenges` : ''}
${pageType === 'analytics' ? `
ANALYTICS PAGE TESTS:
- Test viewing different time periods
- Test switching between chart types
- Test exporting data
- Test filtering by habit` : ''}
${pageType === 'profile' ? `
PROFILE PAGE TESTS:
- Test updating profile information
- Test changing avatar
- Test viewing achievements/badges
- Test profile visibility settings` : ''}
${pageType === 'settings' ? `
SETTINGS PAGE TESTS:
- Test updating notification preferences
- Test changing account settings
- Test theme/appearance settings
- Test privacy settings
- Test logout functionality` : ''}
${pageType === 'dashboard' ? `
DASHBOARD PAGE TESTS:
- Test quick habit check-in
- Test viewing today's habits
- Test navigation to different sections
- Test streak display
- Test activity feed` : ''}
${pageType === 'workspaces' ? `
WORKSPACES PAGE TESTS:
- Test creating a new workspace
- Test switching between workspaces
- Test workspace settings
- Test inviting members to workspace
- Test workspace visibility settings` : ''}
${pageType === 'leaderboards' ? `
LEADERBOARDS PAGE TESTS:
- Test viewing different leaderboard types
- Test filtering by time period
- Test user rankings display
- Test clicking on user profiles` : ''}
${pageType === 'recap' ? `
RECAP PAGE TESTS:
- Test viewing weekly/monthly recaps
- Test switching between time periods
- Test sharing recap
- Test progress visualization` : ''}
${pageType === 'notifications' ? `
NOTIFICATIONS PAGE TESTS:
- Test marking notifications as read
- Test clearing notifications
- Test notification preferences
- Test notification click navigation` : ''}
${pageType === 'discover' ? `
DISCOVER PAGE TESTS:
- Test searching for content
- Test filtering by category
- Test viewing popular items
- Test joining/following discovered items` : ''}
${pageType === 'referrals' ? `
REFERRALS PAGE TESTS:
- Test copying referral link
- Test viewing referral stats
- Test sharing referral via social
- Test viewing referral rewards` : ''}
${pageType === 'stakes' ? `
STAKES PAGE TESTS:
- Test creating a new stake
- Test viewing active stakes
- Test stake progress tracking
- Test stake payout information` : ''}
${pageType === 'money' ? `
MONEY PAGE TESTS:
- Test viewing balance
- Test transaction history
- Test initiating payout
- Test payment method settings` : ''}
${pageType === 'auth' ? `
AUTH PAGE TESTS:
- Test form validation (empty fields, invalid email)
- Test password requirements display
- Test sign-in/sign-up toggle or link
- Test forgot password link
- Test form submission` : ''}
${pageType === 'landing' ? `
LANDING PAGE TESTS:
- Test hero section CTA buttons
- Test navigation links
- Test sign-up/sign-in links
- Test feature section links
- Test scroll behavior` : ''}

Generate test cases in this JSON format:
{
  "testCases": [
    {
      "name": "Descriptive test case name",
      "priority": "high|medium|low",
      "steps": [
        {
          "action": "click|fill|navigate|wait|assert|hover|select",
          "selector": "VALID CSS selector",
          "value": "value for fill/navigate actions (optional)",
          "expectedResult": "what should happen"
        }
      ],
      "expectedOutcome": "Overall expected outcome"
    }
  ]
}

SELECTOR RULES (MUST FOLLOW):
1. PREFER data-testid: [data-testid="button-name"]
2. Use IDs: #element-id
3. Use classes: .class-name or button.class-name
4. Use attributes: input[type="email"], a[href="/path"]
5. NEVER use :first, :last, :contains() - NOT valid CSS
6. Use :first-of-type or :nth-child(1) instead

TEST GENERATION REQUIREMENTS:
1. Generate 10-15 test cases covering ALL visible buttons and important links
2. Test EVERY button you find - each button should have at least one test
3. Test navigation links to ensure they work
4. For forms: fill ALL fields before clicking submit
5. Use mock data: test@example.com, TestPassword123!, "Test Value"
6. Test both success and error scenarios where applicable
7. Test any modals, dropdowns, or interactive components
8. Include hover states for important elements

Respond ONLY with valid JSON. NO markdown.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        // Remove markdown code blocks if present
        let jsonText = content.text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        // Find JSON object in the response
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
        
        const result = JSON.parse(jsonText);
        console.log(`   ✅ Generated ${result.testCases.length} test cases`);
        return result.testCases;
      }
    } catch (error: any) {
      console.error(`   ❌ Error generating test cases: ${error.message}`);
      // Return basic test cases as fallback
      return this.generateFallbackTestCases(buttons, links, inputs);
    }
    
    return [];
  }

  /**
   * Determine the page type from URL path for context-aware test generation
   */
  private getPageType(urlPath: string): string {
    const path = urlPath.toLowerCase();

    // Core features
    if (path.includes('/habits')) return 'habits';
    if (path.includes('/squads')) return 'squads';
    if (path.includes('/challenges')) return 'challenges';
    if (path.includes('/workspaces')) return 'workspaces';

    // Analytics and stats
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/leaderboards')) return 'leaderboards';
    if (path.includes('/recap')) return 'recap';

    // User management
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/notifications')) return 'notifications';

    // Social and discovery
    if (path.includes('/discover')) return 'discover';
    if (path.includes('/referrals')) return 'referrals';

    // Monetization
    if (path.includes('/stakes')) return 'stakes';
    if (path.includes('/money')) return 'money';

    // Dashboard
    if (path.includes('/dashboard') || path.includes('/home')) return 'dashboard';

    // Auth pages
    if (path.includes('/auth') || path.includes('/sign-in') || path.includes('/sign-up')) return 'auth';

    // Support
    if (path.includes('/help') || path.includes('/support')) return 'support';

    // Marketing/landing
    if (path === '/' || path === '') return 'landing';

    return 'other';
  }

  /**
   * Generate basic test cases if AI fails
   */
  private generateFallbackTestCases(buttons: any[], links: any[], inputs: any[]): TestCase[] {
    const testCases: TestCase[] = [];

    // Test visible, enabled buttons
    buttons.filter(b => b.visible && !b.disabled).slice(0, 5).forEach((btn, i) => {
      let selector = 'button';
      if (btn.id) {
        selector = `#${btn.id}`;
      } else if (btn.className && btn.className.trim()) {
        // Use the first class name
        const firstClass = btn.className.split(' ')[0];
        if (firstClass && !firstClass.includes(':')) {
          selector = `button.${firstClass}`;
        }
      }

      testCases.push({
        name: `Click button: ${btn.text || 'Button ' + i}`,
        priority: 'medium',
        steps: [{
          action: 'click',
          selector: selector,
          expectedResult: 'Button should respond to click'
        }],
        expectedOutcome: 'Button click should trigger expected action'
      });
    });

    // Test visible inputs
    inputs.filter(i => i.visible).slice(0, 3).forEach((input, i) => {
      let selector = 'input';
      if (input.type) {
        selector = `input[type="${input.type}"]`;
      }
      if (input.placeholder) {
        selector = `input[placeholder="${input.placeholder}"]`;
      }

      testCases.push({
        name: `Fill input: ${input.name || input.type || 'Input ' + i}`,
        priority: 'medium',
        steps: [{
          action: 'fill',
          selector: selector,
          value: input.type === 'email' ? 'test@example.com' : 'test value',
          expectedResult: 'Input should accept value'
        }],
        expectedOutcome: 'Input should be fillable'
      });
    });

    // Test visible links
    links.filter(l => l.visible && l.href && l.href.startsWith('/')).slice(0, 3).forEach((link, i) => {
      testCases.push({
        name: `Click link: ${link.text || link.href}`,
        priority: 'low',
        steps: [{
          action: 'click',
          selector: `a[href="${link.href}"]`,
          expectedResult: 'Link should navigate'
        }],
        expectedOutcome: 'Navigation should occur'
      });
    });

    return testCases;
  }

  /**
   * Execute a test case
   */
  async executeTestCase(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      name: testCase.name,
      priority: testCase.priority,
      status: 'passed',
      errors: [],
      warnings: [],
      duration: 0,
      screenshots: []
    };

    console.log(`      🧪 ${testCase.name}`);

    try {
      for (let i = 0; i < testCase.steps.length; i++) {
        const step = testCase.steps[i];
        try {
          await this.executeStep(step, testCase.name, i);
          await this.page.waitForTimeout(500); // Brief pause between steps
        } catch (error: any) {
          result.status = 'failed';
          const screenshot = await this.captureScreenshot(testCase.name, `step-${i}-error`);
          result.errors.push({
            step: `${step.action} ${step.selector}`,
            message: error.message,
            screenshot
          });
          console.log(`         ❌ Failed: ${error.message}`);
          break; // Stop on first error
        }
      }

      if (result.status === 'passed') {
        console.log(`         ✅ Passed`);
      }
    } catch (error: any) {
      result.status = 'failed';
      result.errors.push({
        step: 'general',
        message: error.message
      });
      console.log(`         ❌ Error: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    this.testResults.push(result);
    return result;
  }

  /**
   * Normalize and validate a selector, converting invalid patterns to valid ones
   */
  private normalizeSelector(selector: string): string {
    // Remove invalid :first and :last pseudo-selectors (convert to :first-of-type/:last-of-type)
    let normalized = selector
      .replace(/:first(?!\-)/g, ':first-of-type')
      .replace(/:last(?!\-)/g, ':last-of-type')
      .replace(/:contains\([^)]+\)/g, ''); // Remove :contains() - we'll handle text matching differently

    return normalized.trim();
  }

  /**
   * Check if a string looks like a valid CSS selector
   */
  private isValidSelector(selector: string): boolean {
    // Plain text descriptions are not valid selectors
    if (/^[a-z\s]+$/i.test(selector) && !selector.includes('[') && !selector.includes('.') && !selector.includes('#')) {
      // Could be plain text like "email input field"
      const commonWords = ['input', 'field', 'button', 'link', 'text', 'email', 'password', 'the', 'a', 'an'];
      const words = selector.toLowerCase().split(/\s+/);
      if (words.length > 1 && words.some(w => commonWords.includes(w))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Find an element using multiple strategies
   */
  private async findElement(selector: string, action: string): Promise<import('@playwright/test').Locator> {
    const normalizedSelector = this.normalizeSelector(selector);

    // Strategy 1: Try data-testid if selector looks like one
    if (normalizedSelector.includes('data-testid')) {
      return this.page.locator(normalizedSelector);
    }

    // Strategy 2: If it's a valid CSS selector, try it directly
    if (this.isValidSelector(normalizedSelector)) {
      try {
        const locator = this.page.locator(normalizedSelector);
        if (await locator.count() > 0) {
          return locator.first();
        }
      } catch {
        // Selector might be invalid, try other strategies
      }
    }

    // Strategy 3: Extract text from selector and use text-based matching
    const textMatch = normalizedSelector.match(/["']([^"']+)["']/);
    if (textMatch) {
      const text = textMatch[1];
      if (action === 'click') {
        // Try button, link, or any clickable element with this text
        const buttonLocator = this.page.getByRole('button', { name: text });
        if (await buttonLocator.count() > 0) return buttonLocator.first();

        const linkLocator = this.page.getByRole('link', { name: text });
        if (await linkLocator.count() > 0) return linkLocator.first();

        return this.page.getByText(text).first();
      }
    }

    // Strategy 4: Try common patterns based on action type
    if (action === 'fill') {
      // For fill actions, look for input/textarea elements
      if (normalizedSelector.toLowerCase().includes('email')) {
        const emailInput = this.page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
        if (await emailInput.count() > 0) return emailInput.first();
      }
      if (normalizedSelector.toLowerCase().includes('password')) {
        const passwordInput = this.page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
        if (await passwordInput.count() > 0) return passwordInput.first();
      }
    }

    // Strategy 5: Last resort - try the normalized selector directly
    return this.page.locator(normalizedSelector).first();
  }

  /**
   * Fill form fields with mock data if a submit button is disabled
   */
  private async fillFormWithMockData(): Promise<void> {
    // Find all input fields in forms on the page
    const inputs = await this.page.$$eval('form input[type="text"], form input[type="email"], form input[type="password"], form textarea', 
      (inputs) => inputs.map((input: any) => ({
        type: input.type || 'text',
        name: input.name || '',
        placeholder: input.placeholder || '',
        required: input.hasAttribute('required'),
        id: input.id || ''
      }))
    );

    // Fill each input with appropriate mock data
    for (const input of inputs) {
      try {
        let mockValue = '';
        let selector = '';

        if (input.type === 'email') {
          mockValue = 'test@example.com';
          selector = input.id ? `#${input.id}` : `input[type="email"]${input.name ? `[name="${input.name}"]` : ''}`;
        } else if (input.type === 'password') {
          mockValue = 'TestPassword123!';
          selector = input.id ? `#${input.id}` : `input[type="password"]${input.name ? `[name="${input.name}"]` : ''}`;
        } else if (input.type === 'text') {
          // Determine mock data based on placeholder or name
          const placeholder = input.placeholder.toLowerCase();
          const name = input.name.toLowerCase();
          
          if (placeholder.includes('email') || name.includes('email')) {
            mockValue = 'test@example.com';
          } else if (placeholder.includes('password') || name.includes('password')) {
            mockValue = 'TestPassword123!';
          } else if (placeholder.includes('name') || name.includes('name')) {
            mockValue = 'Test User';
          } else {
            mockValue = 'Test Value';
          }
          selector = input.id ? `#${input.id}` : `input[type="text"]${input.name ? `[name="${input.name}"]` : ''}`;
        } else {
          mockValue = 'Test Value';
          selector = input.id ? `#${input.id}` : 'input';
        }

        // Try to fill the input
        const element = this.page.locator(selector).first();
        if (await element.count() > 0) {
          await element.fill(mockValue, { timeout: 2000 });
          await this.page.waitForTimeout(200); // Brief pause between fills
        }
      } catch (e) {
        // Continue with next input if this one fails
        continue;
      }
    }

    // Wait a moment for form validation to update button states
    await this.page.waitForTimeout(500);
  }

  /**
   * Execute a single test step
   */
  private async executeStep(step: TestStep, testName: string, stepIndex: number): Promise<void> {
    switch (step.action) {
      case 'click':
        try {
          const element = await this.findElement(step.selector, 'click');
          
          // Check if the button is disabled
          const isDisabled = await element.isDisabled({ timeout: 1000 }).catch(() => false);
          
          // If disabled and it's likely a submit button, try to fill the form first
          if (isDisabled) {
            const elementText = await element.textContent().catch(() => '');
            const elementType = await element.getAttribute('type').catch(() => '');
            const isSubmitButton = elementType === 'submit' || 
                                  elementText?.toLowerCase().includes('sign') ||
                                  elementText?.toLowerCase().includes('submit') ||
                                  elementText?.toLowerCase().includes('start') ||
                                  elementText?.toLowerCase().includes('send') ||
                                  elementText?.toLowerCase().includes('create') ||
                                  step.selector.toLowerCase().includes('button') ||
                                  step.selector.toLowerCase().includes('submit');

            if (isSubmitButton) {
              console.log(`         📝 Form button disabled, filling form with mock data...`);
              await this.fillFormWithMockData();
              
              // Wait for button to become enabled
              await element.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
              const stillDisabled = await element.isDisabled({ timeout: 1000 }).catch(() => true);
              
              if (stillDisabled) {
                // Try waiting a bit more
                await this.page.waitForTimeout(500);
              }
            }
          }
          
          await element.click({ timeout: 5000, force: false });
        } catch (e: any) {
          // If click failed because button is disabled, try filling form and retrying
          if (e.message?.includes('not enabled') || e.message?.includes('disabled')) {
            try {
              console.log(`         📝 Button was disabled, filling form with mock data...`);
              await this.fillFormWithMockData();
              await this.page.waitForTimeout(500);
              
              const element = await this.findElement(step.selector, 'click');
              await element.click({ timeout: 5000 });
            } catch (retryError: any) {
              // Try with text content as fallback
              const textMatch = step.selector.match(/["']([^"']+)["']/) ||
                               step.selector.match(/:has-text\(["']?([^"')]+)["']?\)/);
              if (textMatch) {
                await this.page.getByText(textMatch[1]).first().click({ timeout: 5000 });
              } else {
                throw retryError;
              }
            }
          } else {
            // Try with text content as fallback
            const textMatch = step.selector.match(/["']([^"']+)["']/) ||
                             step.selector.match(/:has-text\(["']?([^"')]+)["']?\)/);
            if (textMatch) {
              await this.page.getByText(textMatch[1]).first().click({ timeout: 5000 });
            } else {
              throw e;
            }
          }
        }
        break;

      case 'fill':
        try {
          const element = await this.findElement(step.selector, 'fill');
          await element.fill(step.value || '', { timeout: 5000 });
        } catch (e: any) {
          throw e;
        }
        break;

      case 'navigate':
        // Validate URL before navigation
        const url = step.value || '';
        if (!url || url.trim() === '') {
          throw new Error('Cannot navigate to empty URL');
        }
        try {
          new URL(url); // Validate it's a proper URL
        } catch {
          throw new Error(`Invalid URL: ${url}`);
        }
        await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        break;

      case 'wait':
        await this.page.waitForTimeout(parseInt(step.value || '1000'));
        break;

      case 'assert':
        try {
          const element = await this.findElement(step.selector, 'assert');
          const count = await element.count();
          if (count === 0 && step.expectedResult !== 'not exists') {
            throw new Error(`Element ${step.selector} not found`);
          }
          if (count > 0 && step.expectedResult === 'not exists') {
            throw new Error(`Element ${step.selector} should not exist but does`);
          }
        } catch (e: any) {
          if (step.expectedResult === 'not exists') {
            // Element not found is expected
            return;
          }
          throw e;
        }
        break;

      case 'hover':
        try {
          const element = await this.findElement(step.selector, 'hover');
          await element.hover({ timeout: 5000 });
        } catch (e: any) {
          throw e;
        }
        break;

      case 'select':
        try {
          const element = await this.findElement(step.selector, 'select');
          await element.selectOption(step.value || '', { timeout: 5000 });
        } catch (e: any) {
          throw e;
        }
        break;
    }
  }

  /**
   * Crawl entire application and discover all pages with seed URLs
   */
  async crawlApplicationWithSeeds(
    startUrl: string, 
    maxDepth: number = 4, 
    seedUrls: string[] = []
  ): Promise<string[]> {
    console.log(`\n🕷️  Crawling application starting from: ${startUrl}`);
    if (seedUrls.length > 0) {
      console.log(`   🌱 Seeding crawl with ${seedUrls.length} known routes`);
    }
    
    const visited = new Set<string>();
    const toVisit: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
    
    // Add seed URLs at depth 1 so they get crawled early
    for (const seedUrl of seedUrls) {
      try {
        const normalizedSeed = seedUrl.split('?')[0].split('#')[0];
        if (!visited.has(normalizedSeed) && normalizedSeed !== startUrl) {
          toVisit.push({ url: normalizedSeed, depth: 1 });
        }
      } catch (e) {
        // Invalid seed URL, skip
      }
    }
    
    const allUrls: string[] = [];
    const baseURL = new URL(startUrl);
    
    // Continue with the same crawling logic...
    return this.continueCrawl(toVisit, visited, allUrls, baseURL, maxDepth);
  }

  /**
   * Shared crawl logic for both regular and seeded crawls
   */
  private async continueCrawl(
    toVisit: Array<{ url: string; depth: number }>,
    visited: Set<string>,
    allUrls: string[],
    baseURL: URL,
    maxDepth: number
  ): Promise<string[]> {
    while (toVisit.length > 0) {
      const { url, depth } = toVisit.shift()!;
      
      // Normalize URL
      const normalizedUrl = url.split('?')[0].split('#')[0];
      
      if (visited.has(normalizedUrl) || depth > maxDepth) continue;
      
      visited.add(normalizedUrl);
      allUrls.push(normalizedUrl);
      console.log(`   📄 Discovered: ${normalizedUrl} (depth: ${depth})`);

      try {
        await this.page.goto(normalizedUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Check if this page is a 404
        if (await this.is404Page()) {
          console.log(`   🚨 404 PAGE: ${normalizedUrl}`);
        }

        // Find all links on the page
        const links = await this.page.$$eval('a[href]', links =>
          links.map(link => link.getAttribute('href')).filter(Boolean) as string[]
        );

        for (const link of links) {
          try {
            const absoluteUrl = new URL(link, normalizedUrl).href;
            const absoluteUrlNormalized = absoluteUrl.split('?')[0].split('#')[0];
            
            // Only visit URLs from the same domain
            if (
              new URL(absoluteUrl).origin === baseURL.origin &&
              !visited.has(absoluteUrlNormalized) &&
              !absoluteUrlNormalized.match(/\.(pdf|jpg|jpeg|png|gif|zip|mp4)$/i) &&
              !absoluteUrlNormalized.includes('/api/')
            ) {
              toVisit.push({ url: absoluteUrlNormalized, depth: depth + 1 });
            }
          } catch (e) {
            // Invalid URL, skip
          }
        }
      } catch (error: any) {
        console.error(`   ⚠️  Error crawling ${normalizedUrl}: ${error.message}`);
      }
    }

    console.log(`\n✅ Crawling complete. Found ${allUrls.length} unique pages\n`);
    return allUrls;
  }

  /**
   * Crawl entire application and discover all pages
   */
  async crawlApplication(startUrl: string, maxDepth: number = 3): Promise<string[]> {
    console.log(`\n🕷️  Crawling application starting from: ${startUrl}`);
    
    const visited = new Set<string>();
    const toVisit: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
    const allUrls: string[] = [];
    const baseURL = new URL(startUrl);
    
    return this.continueCrawl(toVisit, visited, allUrls, baseURL, maxDepth);
  }

  /**
   * Test all interactive elements on a page
   */
  async testAllInteractiveElements(): Promise<InteractionReport> {
    console.log(`      🔘 Testing all interactive elements...`);

    const report: InteractionReport = {
      buttons: [],
      links: [],
      inputs: [],
      forms: [],
      notFoundPages: []
    };

    const startUrl = this.page.url();

    // Test all buttons
    const buttons = await this.page.$$('button:visible');
    console.log(`         Testing ${buttons.length} buttons`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      try {
        const text = (await button.textContent())?.trim() || '';
        const isDisabled = await button.isDisabled();
        
        if (!isDisabled) {
          const urlBefore = this.page.url();
          await button.click({ timeout: 3000 });
          await this.page.waitForTimeout(500);
          const urlAfter = this.page.url();
          const causedNavigation = urlBefore !== urlAfter;

          // Check for 404 after navigation
          let caused404 = false;
          if (causedNavigation) {
            caused404 = await this.is404Page();
            if (caused404) {
              console.log(`         🚨 404 DETECTED: Button "${text}" navigated to missing page: ${urlAfter}`);
              report.notFoundPages.push({
                url: urlAfter,
                triggeredBy: `Button: ${text || `Button ${i}`}`
              });
              // Navigate back to continue testing
              await this.page.goto(startUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
            }
          }

          report.buttons.push({
            index: i,
            text: text || `Button ${i}`,
            status: 'clickable',
            causedNavigation,
            caused404
          });
        } else {
          report.buttons.push({
            index: i,
            text: text || `Button ${i}`,
            status: 'disabled'
          });
        }
      } catch (error: any) {
        report.buttons.push({
          index: i,
          text: `Button ${i}`,
          status: 'error',
          error: error.message
        });
      }
    }

    // Test visible links - actually navigate to check for 404s
    const links = await this.page.$$('a:visible');
    console.log(`         Testing ${links.length} links (checking for 404s)`);

    // Get all internal link hrefs first
    const linkData: Array<{href: string; text: string}> = [];
    for (let i = 0; i < Math.min(links.length, 20); i++) {
      const link = links[i];
      try {
        const href = await link.getAttribute('href');
        const text = (await link.textContent())?.trim() || '';
        if (href && href.startsWith('/') && !href.includes('/api/')) {
          linkData.push({ href, text });
        }
      } catch {
        // Skip inaccessible links
      }
    }

    // Test each unique internal link by navigating
    const testedHrefs = new Set<string>();
    for (let i = 0; i < linkData.length; i++) {
      const { href, text } = linkData[i];

      // Skip duplicates
      if (testedHrefs.has(href)) continue;
      testedHrefs.add(href);

      try {
        const baseUrl = new URL(startUrl);
        const fullUrl = new URL(href, baseUrl).href;

        // Navigate to the link
        await this.page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await this.page.waitForTimeout(300);

        // Check for 404
        const is404 = await this.is404Page();

        if (is404) {
          console.log(`         🚨 404 DETECTED: Link "${text}" points to missing page: ${fullUrl}`);
          report.links.push({
            index: i,
            text: text || `Link ${i}`,
            href: href,
            status: '404',
            error: `Page not found: ${fullUrl}`
          });
          report.notFoundPages.push({
            url: fullUrl,
            triggeredBy: `Link: ${text || href}`
          });
        } else {
          report.links.push({
            index: i,
            text: text || `Link ${i}`,
            href: href,
            status: 'working'
          });
        }
      } catch (error: any) {
        report.links.push({
          index: i,
          text: text || `Link ${i}`,
          href: href,
          status: 'broken',
          error: error.message
        });
      }
    }

    // Navigate back to original page
    await this.page.goto(startUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Test inputs
    const inputs = await this.page.$$('input:visible, textarea:visible');
    console.log(`         Testing ${inputs.length} inputs`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      try {
        const type = await input.getAttribute('type') || 'text';
        const name = await input.getAttribute('name') || '';
        
        // Try to interact with the input
        await input.fill('test', { timeout: 2000 });
        await input.fill('', { timeout: 2000 });
        
        report.inputs.push({
          index: i,
          type: type,
          name: name || `Input ${i}`,
          status: 'functional'
        });
      } catch (error: any) {
        report.inputs.push({
          index: i,
          type: 'unknown',
          name: `Input ${i}`,
          status: 'error',
          error: error.message
        });
      }
    }

    return report;
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport(): Promise<any> {
    console.log(`\n📊 Generating comprehensive report...`);
    
    const summary = {
      total: this.testResults.length,
      passed: this.testResults.filter(r => r.status === 'passed').length,
      failed: this.testResults.filter(r => r.status === 'failed').length,
      warnings: this.testResults.reduce((sum, r) => sum + r.warnings.length, 0),
      totalDuration: this.testResults.reduce((sum, r) => sum + r.duration, 0)
    };

    // Use Claude to analyze results
    console.log(`   🤖 Analyzing results with AI...`);
    
    let insights = {
      criticalIssues: [] as string[],
      patterns: [] as string[],
      recommendations: [] as string[],
      riskLevel: 'low' as 'low' | 'medium' | 'high' | 'critical'
    };

    if (!anthropic) {
      console.log(`   ⚠️  Anthropic API key not found. Skipping AI analysis.`);
    } else {
      try {
        const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Analyze these test results and provide insights:

Summary:
- Total tests: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}

Failed Tests:
${JSON.stringify(this.testResults.filter(r => r.status === 'failed'), null, 2)}

Provide analysis in JSON format:
{
  "criticalIssues": ["List of critical issues that need immediate attention"],
  "patterns": ["Patterns or commonalities in the failures"],
  "recommendations": ["Specific recommendations for improvement"],
  "riskLevel": "low|medium|high|critical"
}

Respond ONLY with valid JSON.`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        let jsonText = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
          insights = JSON.parse(jsonText);
        }
      } catch (error: any) {
        console.error(`   ⚠️  Error analyzing results: ${error.message}`);
      }
    }

    const report = {
      summary,
      insights,
      detailedResults: this.testResults,
      timestamp: new Date().toISOString()
    };

    console.log(`\n✅ Report generation complete`);
    return report;
  }

  private async captureScreenshot(testName: string, step: string): Promise<string> {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
      const sanitizedName = testName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const filename = `${sanitizedName}-${step}-${Date.now()}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      await this.page.screenshot({ path: filepath, fullPage: true });
      return filename;
    } catch (error: any) {
      console.error(`Failed to capture screenshot: ${error.message}`);
      return '';
    }
  }
}

