import { Board, Player, GameResult } from '../types/game';

/**
 * Game Logic Module
 * Contains all the core game mechanics for Odd/Even number game
 */
export class OddEvenGame {
  private static readonly WINNING_COMBINATIONS = [
    // Rows
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  /**
   * Creates an empty game board (5x5 with all zeros)
   */
  static createEmptyBoard(): Board {
    return Array(25).fill(0);
  }

  /**
   * Checks if a move can be made at a position (always true for odd/even game)
   */
  static isValidMove(board: Board, position: number): boolean {
    return position >= 0 && position < 25; // Any position is valid for incrementing
  }

  /**
   * Makes a move by incrementing the number at the position
   */
  static makeMove(board: Board, position: number, _player: Player): Board {
    if (!this.isValidMove(board, position)) {
      throw new Error('Invalid move: position out of bounds');
    }
    
    const newBoard = [...board];
    newBoard[position] = newBoard[position] + 1; // Increment the number
    return newBoard;
  }

  /**
   * Checks for a winner based on odd/even patterns
   */
  static checkWinner(board: Board): { winner: Player; winningCombination: number[] | null } {
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c, d, e] = combination;
      const values = [board[a], board[b], board[c], board[d], board[e]];
      
      // Check if all values are odd and greater than 0
      if (values.every(val => val > 0 && val % 2 === 1)) {
        return {
          winner: 'odd',
          winningCombination: combination
        };
      }
      
      // Check if all values are even and greater than 0
      if (values.every(val => val > 0 && val % 2 === 0)) {
        return {
          winner: 'even',
          winningCombination: combination
        };
      }
    }
    return {
      winner: null,
      winningCombination: null
    };
  }

  /**
   * Legacy method for backward compatibility - returns only the winner
   */
  static getWinner(board: Board): Player {
    return this.checkWinner(board).winner;
  }

  /**
   * Checks if the game should end (when someone wins)
   */
  static isBoardFull(_board: Board): boolean {
    // In odd/even game, board is never "full" - game ends only when someone wins
    return false;
  }

  /**
   * Gets all positions that can be clicked (all positions in odd/even game)
   */
  static getEmptyPositions(_board: Board): number[] {
    return Array.from({ length: 25 }, (_, index) => index);
  }

  /**
   * Evaluates the game state and returns the result
   */
  static evaluateGame(board: Board): GameResult {
    const winnerResult = this.checkWinner(board);
    const isGameOver = winnerResult.winner !== null || this.isBoardFull(board);
    
    return {
      winner: winnerResult.winner,
      isGameOver,
      winningCombination: winnerResult.winningCombination
    };
  }

  /**
   * Gets the next player
   */
  static getNextPlayer(currentPlayer: Player): Player {
    return currentPlayer === 'odd' ? 'even' : 'odd';
  }

  /**
   * Validates if a board state is valid
   */
  static isValidBoardState(board: Board): boolean {
    if (board.length !== 25) return false;
    
    // All values should be non-negative numbers
    return board.every(cell => typeof cell === 'number' && cell >= 0);
  }

  /**
   * Determines which player would benefit from clicking a position
   */
  static getPlayerForMove(board: Board, position: number): Player {
    const currentValue = board[position];
    const nextValue = currentValue + 1;
    
    // Return the player type that the next value would favor
    return nextValue % 2 === 1 ? 'odd' : 'even';
  }
}