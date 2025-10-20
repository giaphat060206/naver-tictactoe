// Export all types
export * from './types/game';

// Export logic modules
export * from './logic/gameLogic';
export * from './logic/scoreManager';

// Export hooks
export * from './hooks/useGameState';
export * from './hooks/useScoreTracking';

// Export components
export { default as TicTacToe } from './components/TicTacToe';
export { default as GameBoard } from './components/GameBoard';
export { default as GameModeSelect } from './components/GameModeSelect';
export { default as GameStatus } from './components/GameStatus';
export { default as GameInstructions } from './components/GameInstructions';
export { default as ScoreBoard } from './components/ScoreBoard';

// Export constants
export * from './utils/constants';