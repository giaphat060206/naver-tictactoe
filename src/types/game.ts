export type Player = 'odd' | 'even' | null;
export type Board = number[]; // Array of numbers (0-n) representing square values
export type GameMode = 'pvp' | 'easy' | 'hard';

export interface Move {
  position: number;
  player: Player;
  moveNumber: number;
  timestamp: number;
  isAI?: boolean;
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

export interface PerformanceMetrics {
  positionsEvaluated: number;
  thinkingTimeMs: number;
  lastMoveTime: number;
  totalPositionsEvaluated: number;
  averageThinkingTime: number;
  movesPlayed: number;
}

export interface AIResult {
  position: number;
  metrics: PerformanceMetrics;
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
  easy: ScoreData;
  hard: ScoreData;
}