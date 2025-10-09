import { Board, Player, GameMode } from '../types/game';
import { TicTacToeGame } from './gameLogic';

/**
 * AI Logic Module
 * Contains all AI algorithms separated from game logic and UI
 */
export class TicTacToeAI {
  /**
   * Makes a random move from available positions
   */
  static makeRandomMove(board: Board): number {
    const emptyPositions = TicTacToeGame.getEmptyPositions(board);
    
    if (emptyPositions.length === 0) {
      throw new Error('No empty positions available');
    }
    
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return emptyPositions[randomIndex];
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   * Returns the evaluation score for a given board state
   */
  private static minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number {
    const gameResult = TicTacToeGame.evaluateGame(board);
    
    // Terminal states
    if (gameResult.winner === 'O') return 10 - depth; // AI wins (prefer faster wins)
    if (gameResult.winner === 'X') return depth - 10; // Human wins (prefer slower losses)
    if (gameResult.isGameOver) return 0; // Tie
    
    const emptyPositions = TicTacToeGame.getEmptyPositions(board);
    
    if (isMaximizing) {
      let maxEvaluation = -Infinity;
      
      for (const position of emptyPositions) {
        const newBoard = TicTacToeGame.makeMove(board, position, 'O');
        const evaluation = this.minimax(newBoard, depth + 1, false, alpha, beta);
        maxEvaluation = Math.max(maxEvaluation, evaluation);
        alpha = Math.max(alpha, evaluation);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return maxEvaluation;
    } else {
      let minEvaluation = Infinity;
      
      for (const position of emptyPositions) {
        const newBoard = TicTacToeGame.makeMove(board, position, 'X');
        const evaluation = this.minimax(newBoard, depth + 1, true, alpha, beta);
        minEvaluation = Math.min(minEvaluation, evaluation);
        beta = Math.min(beta, evaluation);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return minEvaluation;
    }
  }

  /**
   * Finds the best move using minimax algorithm
   */
  static getBestMove(board: Board): number {
    const emptyPositions = TicTacToeGame.getEmptyPositions(board);
    
    if (emptyPositions.length === 0) {
      throw new Error('No empty positions available');
    }
    
    let bestMove = emptyPositions[0];
    let bestValue = -Infinity;
    
    for (const position of emptyPositions) {
      const newBoard = TicTacToeGame.makeMove(board, position, 'O');
      const moveValue = this.minimax(newBoard, 0, false);
      
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = position;
      }
    }
    
    return bestMove;
  }

  /**
   * Makes an AI move based on the specified difficulty
   */
  static makeAIMove(board: Board, gameMode: GameMode): number {
    switch (gameMode) {
      case 'easy':
        return this.makeRandomMove(board);
      case 'hard':
        return this.getBestMove(board);
      default:
        throw new Error(`Unsupported AI game mode: ${gameMode}`);
    }
  }

  /**
   * Evaluates the difficulty of beating the AI
   */
  static getAIDifficulty(gameMode: GameMode): string {
    switch (gameMode) {
      case 'easy':
        return 'Random moves - Good for beginners';
      case 'hard':
        return 'Optimal play - Nearly unbeatable';
      default:
        return 'Unknown difficulty';
    }
  }
}