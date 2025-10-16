export type Player = 'odd' | 'even' | null;
export type Board = number[]; // Array of numbers (0-n) representing square values
export type GameMode = 'pvp'; // Only PvP mode

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