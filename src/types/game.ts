export type Player = 'odd' | 'even' | null;
export type Board = number[]; // Array of numbers (0-n) representing square values
export type GameMode = 'pvp'; // Only PvP mode
export type ConnectionStatus = 'connecting' | 'connected' | 'waiting' | 'disconnected' | 'error';

export interface Move {
  position: number;
  player: Player;
  moveNumber: number;
  timestamp: number;
  boardSnapshot: Board; // Board state after this move
  incrementValue: number; // The value the square was incremented to
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  gameMode: GameMode;
  winningCombination: number[] | null;
  moveHistory: Move[];
  // Multiplayer fields
  connectionStatus: ConnectionStatus;
  assignedPlayer: Player;
  bothPlayersConnected: boolean;
}

export interface GameResult {
  winner: Player;
  isGameOver: boolean;
  winningCombination: number[] | null;
}

export interface ScoreData {
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  streakType: 'win' | 'loss' | 'draw' | null;
  gamesPlayed: number;
}

export interface GameModeScores {
  pvp: {
    odd: ScoreData;
    even: ScoreData;
  };
}
// WebSocket Message Types
export interface WSMessage {
  type: string;
  [key: string]: unknown;
}

export interface IncrementMessage extends WSMessage {
  type: 'INCREMENT';
  square: number;
}

export interface UpdateMessage extends WSMessage {
  type: 'UPDATE';
  square: number;
  value: number;
  board: Board;
}

export interface PlayerAssignedMessage extends WSMessage {
  type: 'PLAYER_ASSIGNED';
  player: Player;
  board: Board;
}

export interface PlayerConnectedMessage extends WSMessage {
  type: 'PLAYER_CONNECTED';
  player: Player;
  bothPlayersConnected: boolean;
}

export interface GameOverMessage extends WSMessage {
  type: 'GAME_OVER';
  winner: Player;
  winningLine: number[];
  board: Board;
}

export interface GameStartMessage extends WSMessage {
  type: 'GAME_START';
  board: Board;
}

export interface GameResetMessage extends WSMessage {
  type: 'GAME_RESET';
  board: Board;
}

export interface PlayerDisconnectedMessage extends WSMessage {
  type: 'PLAYER_DISCONNECTED';
  player: Player;
  message: string;
}

export interface ErrorMessage extends WSMessage {
  type: 'ERROR';
  message: string;
}
