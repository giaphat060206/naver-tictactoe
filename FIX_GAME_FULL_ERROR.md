# Fix: "Game is full" Error on Single Browser Window

## Problem
You were getting "Game is full. Only 2 players allowed" error even when opening only ONE browser window.

## Root Causes

### 1. **React Strict Mode Double Mounting** (Development Mode)
In development, React 19 + Next.js runs components twice to help detect side effects. This means:
- Your WebSocket hook runs twice
- Two connections are created almost simultaneously
- First connection gets "Odd Player"
- Second connection gets "Even Player"
- Any additional connection (or page refresh) gets rejected as "game full"

### 2. **Dead Connections Not Cleaned Up**
When the server restarts or connections drop, the server wasn't properly cleaning up old connections before accepting new ones.

## Solutions Applied

### Fix 1: Server-Side Connection Cleanup ✅
Added `cleanupDeadConnections()` function to server:

```javascript
function cleanupDeadConnections() {
  clients.forEach((clientInfo, clientId) => {
    if (clientInfo.ws.readyState === WebSocket.CLOSED || 
        clientInfo.ws.readyState === WebSocket.CLOSING) {
      console.log(`🧹 Cleaning up dead connection: ${clientId}`);
      clients.delete(clientId);
      
      // Remove from game state
      if (gameState.players.odd === clientId) {
        gameState.players.odd = null;
      }
      if (gameState.players.even === clientId) {
        gameState.players.even = null;
      }
    }
  });
}
```

This runs **before** assigning new players, ensuring slots are available.

### Fix 2: Prevent Multiple Simultaneous Connections ✅
Added connection guard in `useWebSocket.ts`:

```typescript
const isConnecting = useRef(false);

const connect = useCallback(() => {
  // Prevent multiple simultaneous connections
  if (isConnecting.current || 
      (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING)) {
    console.log('⚠️ Already connecting, skipping...');
    return;
  }

  // Close existing connection if any
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    console.log('⚠️ Already connected, skipping...');
    return;
  }

  isConnecting.current = true;
  // ... rest of connection logic
}, [handlers]);
```

This ensures only ONE connection is created even if React renders twice.

## How to Test the Fix

### Test 1: Single Browser Window ✅
1. Close all browser windows
2. Restart the server: `npm run server`
3. Open ONE browser window: `http://localhost:3000`
4. You should see: **"You are the ODD player - You go first!"**
5. Connection status: **"Waiting for opponent..."**
6. No error message!

### Test 2: Page Refresh ✅
1. With the first window open, press `F5` or `Ctrl+R`
2. The connection should be re-established
3. You should still be assigned as "Odd Player"
4. No "game full" error!

### Test 3: Two Browser Windows ✅
1. Keep first window open (Odd Player)
2. Open second window: `http://localhost:3000` (incognito/private mode)
3. Second window becomes **"Even Player"**
4. Both status bars turn green: **"Both players connected - Game ready!"**
5. Game board becomes clickable!

### Test 4: Third Connection (Should Reject) ✅
1. With both windows open and playing
2. Try to open a third window
3. Should see: **"Error: Game is full. Only 2 players allowed."**
4. This is correct behavior!

## Server Log Output (What You Should See)

### Good Single Connection:
```
🔌 New connection attempt: 1729123456789.123
🧹 Cleaning up dead connections
📊 Active players - Odd: No, Even: No
👤 Client 1729123456789.123 assigned as ODD player
```

### Good Second Connection:
```
🔌 New connection attempt: 1729123456999.456
🧹 Cleaning up dead connections
📊 Active players - Odd: Yes, Even: No
👤 Client 1729123456999.456 assigned as EVEN player
🎮 Both players connected - game can start!
```

### Good Third Connection (Rejected):
```
🔌 New connection attempt: 1729123457111.789
🧹 Cleaning up dead connections
📊 Active players - Odd: Yes, Even: Yes
❌ Client 1729123457111.789 rejected - game full (Odd: ..., Even: ...)
```

## Additional Notes

### Why Does React Mount Twice in Development?
React 19 + Next.js runs effects twice in development (not production) to help you find bugs:
- First mount: Create connection
- Unmount: Should cleanup
- Second mount: Create connection again

Our fix ensures only ONE connection survives this process.

### Production Build
When you build for production (`npm run build`), React Strict Mode is disabled, so this double-mounting won't happen.

### If You Still See Issues

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart both servers:**
   ```powershell
   # Kill all Node processes
   taskkill /F /IM node.exe
   
   # Restart server
   npm run server
   
   # In another terminal, restart client
   npm run dev
   ```
3. **Check browser console** for connection logs
4. **Check server terminal** for connection messages

## Summary
✅ Server now cleans up dead connections before assigning new players  
✅ Client prevents multiple simultaneous WebSocket connections  
✅ Single browser window works correctly  
✅ Page refresh works correctly  
✅ Two player multiplayer still works  
✅ Third player correctly rejected  

The error should now be resolved! 🎉
