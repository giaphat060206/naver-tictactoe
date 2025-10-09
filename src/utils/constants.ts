/**
 * Game Constants
 * Centralized constants for the Tic Tac Toe game
 */

export const GAME_CONSTANTS = {
  BOARD_SIZE: 9,
  WINNING_COMBINATIONS: [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ],
  PLAYERS: {
    HUMAN: 'X',
    AI: 'O'
  },
  GAME_MODES: {
    PVP: 'pvp',
    EASY_AI: 'easy',
    HARD_AI: 'hard'
  },
  AI_DELAY: 300 // milliseconds
} as const;

export const MESSAGES = {
  WIN: {
    HUMAN: 'You win! 🎉',
    AI: 'AI wins! 🤖',
    PLAYER: (player: string) => `Player ${player} wins!`
  },
  TIE: "It's a tie! 🤝",
  TURN: {
    HUMAN: 'Your turn',
    AI: 'AI is thinking... 🤔',
    PLAYER: (player: string) => `Player ${player}'s turn`
  }
} as const;