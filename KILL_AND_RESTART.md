# How to Kill and Restart the Server

## Step 1: Kill All Node Processes
The dev server might be stuck. Kill it:

**On Mac/Linux:**
```bash
pkill -f "next dev"
pkill -f "node"
```

**Or find and kill specific processes:**
```bash
lsof -ti:3000 | xargs kill -9
```

## Step 2: Clear Next.js Cache
```bash
cd "/Users/michal/Prague Family Events Cursor/Habit Tracker/habit-social"
rm -rf .next
```

## Step 3: Restart the Server
```bash
pnpm dev
```

## Step 4: Check What Port It's Using
Look at the terminal output - it should say something like:
- "Local: http://localhost:3000" 
- OR "Local: http://localhost:3001" (if 3000 is taken)

**Visit the URL shown in the terminal output!**

## If Still Nothing:
1. Check if the terminal actually shows "Ready" - if it's stuck on "Compiling...", there's a build error
2. Try a different browser (Chrome, Firefox, Safari)
3. Try opening in an incognito/private window
4. Check if you have any browser extensions blocking localhost

