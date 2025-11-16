# Debugging Steps for Blank Page Issue

## 1. Check Terminal Output
Look at the terminal where `pnpm dev` or `npm run dev` is running. 
- Are there any errors in red?
- Does it say "Ready" or "Compiling"?
- What port does it say it's running on? (might not be 3000)

## 2. Clear Next.js Cache and Rebuild
Run these commands:
```bash
cd "/Users/michal/Prague Family Events Cursor/Habit Tracker/habit-social"
rm -rf .next
pnpm dev
```

## 3. Check if Server is Actually Running
Open a new terminal and try:
```bash
curl http://localhost:3000
```
If you get HTML back, the server is working. If you get connection refused, the server isn't running.

## 4. Check for Port Conflicts
Maybe something else is using port 3000:
```bash
lsof -i :3000
```

## 5. Try a Different Port
Stop the server and run:
```bash
PORT=3001 pnpm dev
```
Then visit http://localhost:3001

## 6. Check Browser Network Tab
- Open DevTools (F12)
- Go to Network tab
- Reload the page
- Look for any requests - are they pending, failed, or not showing up at all?

## 7. Check for TypeScript Errors
Run:
```bash
pnpm typecheck
```

## 8. Minimal Test
Try creating the simplest possible Next.js page to test if Next.js works at all.

