# Crawl Configuration Guide

This guide explains how to configure the test agent to crawl more pages, especially authenticated routes.

## Configuration Options

### 1. Start from Dashboard (Authenticated Crawl)

The test agent now automatically starts from the dashboard when authenticated. This is configured in `tests/test-runner.ts`:

```typescript
if (authenticated) {
  crawlStartUrl = `${baseUrl}/dashboard`;
  crawlDepth = 4; // Increased depth for authenticated app
}
```

### 2. Adjust Crawl Depth

You can change the crawl depth in `tests/test-runner.ts`:

**For Authenticated Tests:**
```typescript
crawlDepth = 4; // Default is 4 for authenticated
```

**For Unauthenticated Tests:**
```typescript
crawlDepth = 2; // Default is 2 for unauthenticated
```

**What does depth mean?**
- Depth 0: Starting page only
- Depth 1: Starting page + all pages linked directly from it
- Depth 2: Depth 1 + all pages linked from those pages
- Depth 3: And so on...

### 3. Seed URLs (Known Routes)

When authenticated, the test agent automatically seeds the crawl with known authenticated routes:

```typescript
const seedUrls = [
  `${baseUrl}/dashboard`,
  `${baseUrl}/habits`,
  `${baseUrl}/squads`,
  `${baseUrl}/challenges`,
  `${baseUrl}/analytics`,
  `${baseUrl}/profile`,
  `${baseUrl}/settings`,
  `${baseUrl}/workspaces`,
  `${baseUrl}/notifications`,
  `${baseUrl}/leaderboards`,
  `${baseUrl}/discover`,
  `${baseUrl}/referrals`,
  `${baseUrl}/stakes`,
  `${baseUrl}/money`,
  `${baseUrl}/recap`
];
```

To add more routes, edit `tests/test-runner.ts` and add URLs to the `seedUrls` array.

## How It Works

### Authenticated Crawl Flow:

1. **Authenticate** - Sign in with credentials
2. **Start from Dashboard** - Begin crawling from `/dashboard`
3. **Seed Known Routes** - Add known authenticated routes to crawl queue at depth 1
4. **Follow Links** - Discover more pages by following links from each page
5. **Respect Depth** - Stop crawling when max depth is reached

### Unauthenticated Crawl Flow:

1. **Start from Homepage** - Begin crawling from the base URL
2. **Follow Links** - Discover pages by following links
3. **Respect Depth** - Stop crawling when max depth is reached

## Customizing Crawl Settings

### Option 1: Modify in Code

Edit `tests/test-runner.ts` around line 137-165:

```typescript
if (authenticated) {
  crawlStartUrl = `${baseUrl}/dashboard`;
  crawlDepth = 5; // Change to 5 for deeper crawl
  
  seedUrls = [
    // Add your routes here
    `${baseUrl}/your-new-route`,
  ];
}
```

### Option 2: Environment Variables (Future Enhancement)

You could add environment variables:
```bash
export CRAWL_DEPTH=5
export CRAWL_START_URL=/dashboard
```

## Tips

1. **Balance Depth vs Time**: 
   - Depth 3-4: Good balance (discovers most routes)
   - Depth 5+: Very thorough but slow

2. **Seed Important Routes**: 
   - Always seed critical routes you want to test
   - They'll be tested even if not linked from starting page

3. **Authentication Required**:
   - Make sure credentials are set
   - Authentication happens automatically before crawling

## Current Configuration

- **Authenticated**: Starts from `/dashboard`, depth 4, 15 seed URLs
- **Unauthenticated**: Starts from homepage, depth 2

## Running Tests

The crawl settings are used automatically when you run:

```bash
npm run test:ai
```

The agent will:
1. Authenticate (if credentials provided)
2. Use appropriate crawl settings based on authentication status
3. Discover and test all found pages

