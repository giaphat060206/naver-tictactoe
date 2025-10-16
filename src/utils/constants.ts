/**
 * Game Constants
 * Centralized constants for the Tic Tac Toe game
 */

export const GAME_CONSTANTS = {
  BOARD_SIZE: 25, // 5x5 grid
  BOARD_WIDTH: 5,
  BOARD_HEIGHT: 5,
  WINNING_COMBINATIONS: [
    // Rows
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ],
  PLAYERS: {
    ODD: 'odd',
    EVEN: 'even'
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
    ODD: 'Odd Player wins! 🔢',
    EVEN: 'Even Player wins! 🔢',
    PLAYER: (player: string) => `${player.charAt(0).toUpperCase() + player.slice(1)} Player wins!`
  },
  TIE: "It's a tie! 🤝",
  TURN: {
    ODD: 'Odd Player\'s turn (make numbers odd)',
    EVEN: 'Even Player\'s turn (make numbers even)',
    PLAYER: (player: string) => `${player.charAt(0).toUpperCase() + player.slice(1)} Player's turn`
  }
} as const;