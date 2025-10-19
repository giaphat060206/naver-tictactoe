# 🚨 STOP THE CONNECTION LOOP - FOLLOW THESE STEPS EXACTLY

## The Problem
Your browser still has tabs open that are creating hundreds of connections per second.

## THE SOLUTION (Do this NOW):

### Step 1: CLOSE ALL BROWSER TABS ❌
1. Close **EVERY** tab showing `localhost:3000`
2. Close **EVERY** incognito window
3. Better yet: **Close the entire browser**

### Step 2: STOP ALL SERVERS 🛑
In your VS Code terminal, press `Ctrl+C` multiple times to stop all running processes.

Or run this command:
```powershell
Stop-Process -Name "node" -Force
```

### Step 3: WAIT ⏳
Wait 5 seconds for everything to fully stop.

### Step 4: START THE SERVER 🎮
In VS Code terminal:
```powershell
npm run server
```

Wait until you see:
```
🎮 Odd/Even Game Server started on port 8080
✅ Server ready for connections
```

### Step 5: START THE CLIENT 🌐
In a **NEW** terminal:
```powershell
npm run dev
```

Wait until you see:
```
✓ Ready in XXXXms
```

### Step 6: OPEN BROWSER CAREFULLY 🌐

**FIRST WINDOW:**
1. Open a **FRESH** browser window (not tabs you had before!)
2. Go to: `http://localhost:3000`
3. You should see: "You are the ODD player" + "Waiting for opponent..."
4. **STOP** - Don't do anything else yet!

**Check the server terminal:** You should see ONE connection:
```
🔌 New connection attempt: ...
👤 Client ... assigned as ODD player
```

If you see MANY connections, **CLOSE THE BROWSER** and start over.

**SECOND WINDOW:**
1. Open an **INCOGNITO/PRIVATE** window
2. Go to: `http://localhost:3000`
3. You should see: "You are the EVEN player" + "Both players connected!"

**Check the server terminal:** You should see ONE more connection:
```
🔌 New connection attempt: ...
👤 Client ... assigned as EVEN player
🎮 Both players connected - game can start!
```

### Step 7: PLAY! 🎮
Now both players can click squares and play the game!

---

## ⚠️ If You Still See the Loop

The connection loop means React is still creating multiple connections. Here's the NUCLEAR option:

### Option A: Disable React Strict Mode (Recommended for testing)

Edit `src/app/layout.tsx` and wrap the children without StrictMode, or just test with:

```powershell
# Build for production (Strict Mode is disabled)
npm run build
npm start
```

Then open `http://localhost:3000`

### Option B: Use a different port for testing

Change the WebSocket URL in `src/hooks/useWebSocket.ts`:
```typescript
const WS_URL = 'ws://localhost:8080';
```

Make sure this matches your server port.

---

## 🎯 Quick Checklist

- [ ] All browser tabs closed
- [ ] All Node processes stopped
- [ ] Server started and shows "ready for connections"  
- [ ] Client started and shows "Ready in"
- [ ] First browser window shows ONE "ODD player" connection
- [ ] Second browser window shows ONE "EVEN player" connection
- [ ] Server log shows EXACTLY 2 connections total
- [ ] No rapid connection spam in server logs
- [ ] Game board is clickable

---

## 📞 If Nothing Works

Try this emergency reset:

```powershell
# 1. Kill everything
taskkill /F /IM node.exe
taskkill /F /IM msedge.exe
taskkill /F /IM chrome.exe

# 2. Wait 10 seconds

# 3. Restart ONLY the server
npm run server

# 4. Wait until ready

# 5. Open ONE browser window
# Go to localhost:3000

# 6. Check server logs - should see ONLY ONE connection

# 7. If good, open second window
```

The key is: **ONE window at a time, verify each step!**
