import { Board, Player, GameResult } from '../types/game';

/**
 * Game Logic Module
 * Contains all the core game mechanics separated from UI
 */
export class TicTacToeGame {
  private static readonly WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  /**
   * Creates an empty game board
   */
  static createEmptyBoard(): Board {
    return Array(9).fill(null);
  }

  /**
   * Checks if a position on the board is empty
   */
  static isValidMove(board: Board, position: number): boolean {
    return board[position] === null;
  }

  /**
   * Makes a move on the board and returns a new board
   */
  static makeMove(board: Board, position: number, player: Player): Board {
    if (!this.isValidMove(board, position)) {
      throw new Error('Invalid move: position already occupied');
    }
    
    const newBoard = [...board];
    newBoard[position] = player;
    return newBoard;
  }

  /**
   * Checks for a winner on the board
   */
  static checkWinner(board: Board): Player {
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  /**
   * Checks if the board is completely filled
   */
  static isBoardFull(board: Board): boolean {
    return board.every(cell => cell !== null);
  }

  /**
   * Gets all empty positions on the board
   */
  static getEmptyPositions(board: Board): number[] {
    return board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
  }

  /**
   * Evaluates the game state and returns the result
   */
  static evaluateGame(board: Board): GameResult {
    const winner = this.checkWinner(board);
    const isGameOver = winner !== null || this.isBoardFull(board);
    
    return {
      winner,
      isGameOver
    };
  }

  /**
   * Gets the next player
   */
  static getNextPlayer(currentPlayer: Player): Player {
    return currentPlayer === 'X' ? 'O' : 'X';
  }

  /**
   * Validates if a board state is valid
   */
  static isValidBoardState(board: Board): boolean {
    if (board.length !== 9) return false;
    
    const xCount = board.filter(cell => cell === 'X').length;
    const oCount = board.filter(cell => cell === 'O').length;
    
    // X goes first, so X count should be equal to O count or one more
    return xCount === oCount || xCount === oCount + 1;
  }
}