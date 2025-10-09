export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type GameMode = 'pvp' | 'easy' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  gameMode: GameMode;
}

export interface GameResult {
  winner: Player;
  isGameOver: boolean;
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
    playerX: ScoreData;
    playerO: ScoreData;
  };
  easy: ScoreData;
  hard: ScoreData;
}