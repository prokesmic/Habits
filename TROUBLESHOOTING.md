# Troubleshooting - Terminal Shows Nothing

If `pnpm dev` shows absolutely nothing in the terminal, try these steps:

## Step 1: Check if pnpm is working
```bash
pnpm --version
```
If this doesn't work, pnpm might not be installed or in your PATH.

## Step 2: Try npm instead
```bash
cd "/Users/michal/Prague Family Events Cursor/Habit Tracker/habit-social"
npm run dev
```

## Step 3: Try with verbose output
```bash
npm run dev:verbose
```

## Step 4: Try simple dev command
```bash
npm run dev:simple
```

## Step 5: Check if Node.js is working
```bash
node --version
which node
```

## Step 6: Try running Next.js directly
```bash
cd "/Users/michal/Prague Family Events Cursor/Habit Tracker/habit-social"
npx next dev
```

## Step 7: Check if something is already running on port 3000
```bash
lsof -i :3000
```

## Step 8: Check for stuck processes
```bash
ps aux | grep node
ps aux | grep next
```

## Step 9: If terminal is completely frozen
- Try opening a NEW terminal window/tab
- Don't use the same terminal that seems frozen
- Make sure you're in the correct directory

## Step 10: Verify you're in the right directory
```bash
pwd
ls -la
```
You should see `package.json`, `next.config.ts`, and `src/` folder.

