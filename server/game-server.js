/**
 * WebSocket Game Server for Odd/Even Multiplayer
 * Implements server authority and operational transforms
 */
const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// Game state - Server is the single source of truth
let gameState = {
  board: Array(25).fill(0), // 5x5 grid
  players: {
    odd: null,
    even: null
  },
  gameOver: false,
  winner: null,
  winningLine: null
};

// Store connected clients
const clients = new Map();

console.log(`🎮 Odd/Even Game Server started on port ${PORT}`);

// Winning combinations for 5x5 board
const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

/**
 * Check if a player has won
 */
function checkWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const values = combination.map(pos => board[pos]);
    
    // Check if all 5 values are odd
    if (values.every(v => v > 0 && v % 2 === 1)) {
      return { winner: 'odd', winningLine: combination };
    }
    
    // Check if all 5 values are even
    if (values.every(v => v > 0 && v % 2 === 0)) {
      return { winner: 'even', winningLine: combination };
    }
  }
  
  return { winner: null, winningLine: null };
}

/**
 * Broadcast message to all connected clients
 */
function broadcast(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr);
    }
  });
}

/**
 * Send message to a specific client
 */
function sendToClient(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Reset the game state
 */
function resetGame() {
  gameState.board = Array(25).fill(0);
  gameState.gameOver = false;
  gameState.winner = null;
  gameState.winningLine = null;
  console.log('🔄 Game reset');
}

/**
 * Clean up disconnected clients
 */
function cleanupDeadConnections() {
  clients.forEach((clientInfo, clientId) => {
    if (clientInfo.ws.readyState === WebSocket.CLOSED || clientInfo.ws.readyState === WebSocket.CLOSING) {
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

/**
 * Handle new client connection
 */
wss.on('connection', (ws) => {
  const clientId = Date.now() + Math.random();
  console.log(`🔌 New connection attempt: ${clientId}`);
  
  // Clean up any dead connections first
  cleanupDeadConnections();
  
  // Count actual active connections
  const activeOddPlayer = gameState.players.odd && clients.has(gameState.players.odd);
  const activeEvenPlayer = gameState.players.even && clients.has(gameState.players.even);
  
  console.log(`📊 Active players - Odd: ${activeOddPlayer ? 'Yes' : 'No'}, Even: ${activeEvenPlayer ? 'Yes' : 'No'}`);
  
  // Assign player role
  let assignedPlayer = null;
  if (!activeOddPlayer) {
    assignedPlayer = 'odd';
    gameState.players.odd = clientId;
    console.log(`👤 Client ${clientId} assigned as ODD player`);
  } else if (!activeEvenPlayer) {
    assignedPlayer = 'even';
    gameState.players.even = clientId;
    console.log(`👤 Client ${clientId} assigned as EVEN player`);
  } else {
    // Third player - reject or make spectator
    console.log(`❌ Client ${clientId} rejected - game full (Odd: ${gameState.players.odd}, Even: ${gameState.players.even})`);
    sendToClient(ws, {
      type: 'ERROR',
      message: 'Game is full. Only 2 players allowed.'
    });
    ws.close();
    return;
  }
  
  // Store client info
  clients.set(clientId, { ws, player: assignedPlayer });
  
  // Send player assignment
  sendToClient(ws, {
    type: 'PLAYER_ASSIGNED',
    player: assignedPlayer,
    board: gameState.board
  });
  
  // Notify all clients about connection status
  broadcast({
    type: 'PLAYER_CONNECTED',
    player: assignedPlayer,
    bothPlayersConnected: gameState.players.odd && gameState.players.even
  });
  
  // If both players connected, start the game
  if (gameState.players.odd && gameState.players.even) {
    console.log('🎮 Both players connected - game can start!');
    resetGame();
    broadcast({
      type: 'GAME_START',
      board: gameState.board
    });
  }
  
  /**
   * Handle incoming messages from client
   */
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      // Ignore messages if game is over
      if (gameState.gameOver && message.type !== 'RESET') {
        return;
      }
      
      switch (message.type) {
        case 'INCREMENT':
          handleIncrement(clientId, message);
          break;
          
        case 'RESET':
          handleReset();
          break;
          
        default:
          console.log(`⚠️ Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  /**
   * Handle client disconnect
   */
  ws.on('close', () => {
    console.log(`🔌 Client ${clientId} disconnected`);
    
    const clientInfo = clients.get(clientId);
    if (clientInfo) {
      const { player } = clientInfo;
      
      // Remove player from game state
      if (gameState.players.odd === clientId) {
        gameState.players.odd = null;
      }
      if (gameState.players.even === clientId) {
        gameState.players.even = null;
      }
      
      clients.delete(clientId);
      
      // Notify remaining clients
      broadcast({
        type: 'PLAYER_DISCONNECTED',
        player: player,
        message: `${player} player disconnected. Game ended.`
      });
      
      // End the game
      gameState.gameOver = true;
      
      // If no players left, reset the game
      if (clients.size === 0) {
        resetGame();
      }
    }
  });
});

/**
 * Handle INCREMENT operation (Operational Transform approach)
 */
function handleIncrement(clientId, message) {
  const { square } = message;
  const clientInfo = clients.get(clientId);
  
  if (!clientInfo) {
    console.log(`⚠️ Client ${clientId} not found`);
    return;
  }
  
  // Validate square position
  if (square < 0 || square >= 25) {
    console.log(`⚠️ Invalid square: ${square}`);
    return;
  }
  
  // Check if both players are connected
  if (!gameState.players.odd || !gameState.players.even) {
    console.log(`⚠️ Cannot play - waiting for both players`);
    return;
  }
  
  // Apply the increment operation
  gameState.board[square] += 1;
  const newValue = gameState.board[square];
  
  console.log(`🎯 Player ${clientInfo.player} incremented square ${square} to ${newValue}`);
  
  // Check for winner after the update
  const result = checkWinner(gameState.board);
  if (result.winner) {
    gameState.gameOver = true;
    gameState.winner = result.winner;
    gameState.winningLine = result.winningLine;
    
    console.log(`🏆 ${result.winner.toUpperCase()} player wins!`);
    
    // Broadcast game over
    broadcast({
      type: 'GAME_OVER',
      winner: result.winner,
      winningLine: result.winningLine,
      board: gameState.board
    });
  } else {
    // Broadcast the update to all clients
    broadcast({
      type: 'UPDATE',
      square: square,
      value: newValue,
      board: gameState.board
    });
  }
}

/**
 * Handle game reset
 */
function handleReset() {
  console.log('🔄 Game reset requested');
  resetGame();
  broadcast({
    type: 'GAME_RESET',
    board: gameState.board
  });
}

// Handle server errors
wss.on('error', (error) => {
  console.error('❌ WebSocket server error:', error);
});

console.log('✅ Server ready for connections');
