import { Board, GameMode, PerformanceMetrics, AIResult } from '../types/game';
import { TicTacToeGame } from './gameLogic';

/**
 * AI Logic Module
 * Contains all AI algorithms separated from game logic and UI
 */
export class TicTacToeAI {
  // Performance tracking
  private static positionsEvaluated = 0;

  /**
   * Resets the position counter for a new evaluation
   */
  private static resetPositionCounter(): void {
    this.positionsEvaluated = 0;
  }

  /**
   * Increments the position counter
   */
  private static incrementPositionCounter(): void {
    this.positionsEvaluated++;
  }

  /**
   * Gets the current position count
   */
  private static getPositionCount(): number {
    return this.positionsEvaluated;
  }

  /**
   * Makes a random move from available positions
   */
  static makeRandomMove(board: Board): AIResult {
    const startTime = performance.now();
    
    const emptyPositions = TicTacToeGame.getEmptyPositions(board);
    
    if (emptyPositions.length === 0) {
      throw new Error('No empty positions available');
    }
    
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const position = emptyPositions[randomIndex];
    
    const endTime = performance.now();
    const thinkingTime = endTime - startTime;

    const metrics: PerformanceMetrics = {
      positionsEvaluated: emptyPositions.length, // For random, we "evaluate" all available positions
      thinkingTimeMs: thinkingTime,
      lastMoveTime: thinkingTime,
      totalPositionsEvaluated: emptyPositions.length,
      averageThinkingTime: thinkingTime,
      movesPlayed: 1
    };

    return { position, metrics };
  }

  /**
   * Minimax algorithm with alpha-beta pruning and performance tracking
   * Returns the evaluation score for a given board state
   */
  private static minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number {
    // Count this position evaluation
    this.incrementPositionCounter();
    
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
   * Finds the best move using minimax algorithm with performance tracking
   */
  static getBestMove(board: Board): AIResult {
    const startTime = performance.now();
    this.resetPositionCounter();
    
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
    
    const endTime = performance.now();
    const thinkingTime = endTime - startTime;
    const positionsEvaluated = this.getPositionCount();

    const metrics: PerformanceMetrics = {
      positionsEvaluated,
      thinkingTimeMs: thinkingTime,
      lastMoveTime: thinkingTime,
      totalPositionsEvaluated: positionsEvaluated,
      averageThinkingTime: thinkingTime,
      movesPlayed: 1
    };
    
    return { position: bestMove, metrics };
  }

  /**
   * Makes an AI move based on the specified difficulty with performance tracking
   */
  static makeAIMove(board: Board, gameMode: GameMode): AIResult {
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

  /**
   * Updates cumulative performance metrics
   */
  static updateCumulativeMetrics(
    currentMetrics: PerformanceMetrics,
    newMetrics: PerformanceMetrics
  ): PerformanceMetrics {
    const totalMoves = currentMetrics.movesPlayed + 1;
    const totalPositions = currentMetrics.totalPositionsEvaluated + newMetrics.positionsEvaluated;
    const totalTime = (currentMetrics.averageThinkingTime * currentMetrics.movesPlayed) + newMetrics.thinkingTimeMs;
    
    return {
      positionsEvaluated: newMetrics.positionsEvaluated,
      thinkingTimeMs: newMetrics.thinkingTimeMs,
      lastMoveTime: newMetrics.thinkingTimeMs,
      totalPositionsEvaluated: totalPositions,
      averageThinkingTime: totalTime / totalMoves,
      movesPlayed: totalMoves
    };
  }

  /**
   * Creates initial performance metrics
   */
  static createInitialMetrics(): PerformanceMetrics {
    return {
      positionsEvaluated: 0,
      thinkingTimeMs: 0,
      lastMoveTime: 0,
      totalPositionsEvaluated: 0,
      averageThinkingTime: 0,
      movesPlayed: 0
    };
  }
}