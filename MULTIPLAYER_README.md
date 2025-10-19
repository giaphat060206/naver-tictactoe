# Odd/Even Multiplayer Game - Week 2 Assignment

A real-time multiplayer Odd/Even game built with **React**, **Next.js**, and **WebSocket**.

## 🎮 Game Rules

- **5x5 board** (25 squares), all starting at 0
- **First player** is the **Odd Player**, second player is the **Even Player**
- Both players can **click any square at any time** (no turns!)
- Each click **increments** the square's number by 1 (0→1→2→3...)
- Multiple clicks on the same square keep incrementing
- **Odd Player wins** if any row, column, or diagonal has all 5 odd numbers
- **Even Player wins** if any row, column, or diagonal has all 5 even numbers

## 🏗️ Architecture

### Server Authority (The Key Concept!)
The **server maintains the single source of truth**:

1. Client sends `INCREMENT` message to server
2. Client WAITS (doesn't update UI yet!)
3. Server receives message and increments: `board[12] += 1`
4. Server broadcasts `UPDATE` message to ALL clients
5. ALL clients (including you) update their UI

### Why This Matters - Simultaneous Clicks:
```
Square 12 currently shows: 5

Both players click at the exact same time

Server receives both messages and processes them in order:
- Receives: INCREMENT square 12 → Processes: board[12] = 5 + 1 = 6
- Broadcasts: UPDATE square 12, value 6
- Receives: INCREMENT square 12 → Processes: board[12] = 6 + 1 = 7  
- Broadcasts: UPDATE square 12, value 7

Result: BOTH clicks counted! ✅
```

This is **Operational Transforms** - sending operations, not states!

## 🚀 How to Run

### Terminal 1: Start the WebSocket Server
```bash
npm run server
```
Server starts on `ws://localhost:8080`

### Terminal 2: Start the Next.js Client
```bash
npm run dev
```
Client starts on `http://localhost:3000`

### OR: Run Both Together (Windows PowerShell)
```powershell
# Terminal 1
npm run server

# Terminal 2 (new terminal)
npm run dev
```

## 🧪 How to Test

1. Open `http://localhost:3000` in your browser
   - You'll be assigned as the **Odd Player**
   - Status shows: "Waiting for opponent..."

2. Open `http://localhost:3000` in a **second browser window** (or incognito)
   - Second window is assigned as the **Even Player**
   - Both status bars turn green: "Both players connected - Game ready!"

3. **Test simultaneous clicks:**
   - Click the same square in both windows at the same time
   - Watch the number increment by 2!
   - Both clicks are processed

4. **Test winning:**
   - Odd player: Make a row/column/diagonal of all odd numbers (1, 3, 5, 7, 9)
   - Even player: Make a row/column/diagonal of all even numbers (2, 4, 6, 8, 10)
   - Server detects winner and broadcasts `GAME_OVER`

## 📡 WebSocket Messages

### Client → Server
```javascript
// Increment a square
{ type: 'INCREMENT', square: 12 }

// Reset the game
{ type: 'RESET' }
```

### Server → Client
```javascript
// Player assignment
{ type: 'PLAYER_ASSIGNED', player: 'odd', board: [0, 0, ...] }

// Player connected
{ type: 'PLAYER_CONNECTED', player: 'even', bothPlayersConnected: true }

// Game started
{ type: 'GAME_START', board: [0, 0, ...] }

// Board updated
{ type: 'UPDATE', square: 12, value: 6, board: [...] }

// Game over
{ type: 'GAME_OVER', winner: 'odd', winningLine: [0, 6, 12, 18, 24], board: [...] }

// Player disconnected
{ type: 'PLAYER_DISCONNECTED', player: 'even', message: 'Even player disconnected. Game ended.' }
```

## 🔑 Key Concepts Implemented

### ✅ 1. Server Authority
- Server maintains the game state
- Clients send operations, not states
- Server is the single source of truth

### ✅ 2. Operational Transforms
- Send `INCREMENT` operations instead of `SET_VALUE` states
- Operations compose naturally: 5 + 1 + 1 = 7
- Simultaneous operations both count

### ✅ 3. WebSocket Communication
- Real-time bidirectional communication
- Client → Server: INCREMENT messages
- Server → All Clients: UPDATE broadcasts

### ✅ 4. Win Detection
- Server checks all winning combinations after each move
- 5 rows, 5 columns, 2 diagonals = 12 combinations
- Broadcasts `GAME_OVER` when winner detected

### ✅ 5. Player Assignment
- First WebSocket connection = Odd Player
- Second WebSocket connection = Even Player
- Third connection = Rejected (game full)

### ✅ 6. Connection Management
- Display connection status (Connecting/Waiting/Connected/Disconnected)
- Game cannot start until both players connected
- Game ends immediately if a player disconnects

## 📁 Project Structure

```
src/
├── components/
│   ├── TicTacToe.tsx              # Main game component (multiplayer)
│   ├── ConnectionStatusDisplay.tsx # Connection status UI
│   ├── GameBoard.tsx              # 5x5 grid display
│   ├── GameStatus.tsx             # Game status display
│   └── ...
├── hooks/
│   ├── useMultiplayerGameState.ts # Main game state hook (WebSocket)
│   ├── useWebSocket.ts            # WebSocket connection hook
│   └── ...
├── types/
│   └── game.ts                    # TypeScript types (includes WebSocket message types)
└── ...

server/
└── game-server.js                 # WebSocket server (Node.js)
```

## 🎯 Assignment Requirements Met

- ✅ 5x5 grid displaying numbers (starts at 0)
- ✅ Clear visual indication of which player you are (Odd or Even)
- ✅ Display current board state clearly
- ✅ Click any square to increment by 1
- ✅ Connection status ("Connected" / "Disconnected" / "Waiting for opponent...")
- ✅ Client sends INCREMENT message to server
- ✅ Server applies operation and broadcasts UPDATE
- ✅ Server is the single source of truth
- ✅ Simultaneous clicks both count (operational transforms)
- ✅ First WebSocket connection becomes Odd Player
- ✅ Second WebSocket connection becomes Even Player
- ✅ Game cannot start until both players connected
- ✅ Win detection (all 5 numbers in a line are odd/even)
- ✅ Display "Game Over" screen showing who won
- ✅ If a player disconnects, game ends immediately

## 🐛 Testing Tips

**Q: How do I test this alone?**
A: Open two browser windows side-by-side and play against yourself!

**Q: What if both players click at exactly the same time?**
A: The server processes messages in the order it receives them. Both operations apply!

**Q: What if the server crashes?**
A: Client will show "Disconnected" and attempt to reconnect every 3 seconds.

**Q: Can I have more than 2 players?**
A: Currently no - third connection is rejected. You could add spectator mode!

## 🎓 Understanding Distributed Systems

This assignment teaches you:
- **Why send operations (INCREMENT) instead of states (SET_VALUE)**
- **How Google Docs handles simultaneous edits**
- **Why the server needs to be "in charge" of the truth**
- **How operational transforms solve concurrent action problems**
- **Real-time bidirectional communication with WebSockets**

## 📚 Technologies Used

- **React 19** - UI library
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **WebSocket (ws)** - Real-time communication
- **Node.js** - Server runtime

## 🏆 Success Criteria

You've succeeded when:
- ✅ Two players can play simultaneously in different browsers
- ✅ Both players clicking the same square makes it increment by 2
- ✅ Win detection works correctly
- ✅ You can explain why sending operations is better than sending states

---

**Good luck, and have fun!** 🎮🌐
