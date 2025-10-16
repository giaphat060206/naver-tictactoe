import { Board, GameMode, PerformanceMetrics, AIResult } from '../types/game';
import { OddEvenGame } from './gameLogic';

/**
 * AI Logic Module
 * Contains all AI algorithms for the Odd/Even number game
 */
export class OddEvenAI {
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
    
    const availablePositions = OddEvenGame.getEmptyPositions(board);
    
    if (availablePositions.length === 0) {
      throw new Error('No positions available');
    }
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const position = availablePositions[randomIndex];
    
    const endTime = performance.now();
    const thinkingTime = endTime - startTime;

    const metrics: PerformanceMetrics = {
      positionsEvaluated: availablePositions.length,
      thinkingTimeMs: thinkingTime,
      lastMoveTime: thinkingTime,
      totalPositionsEvaluated: availablePositions.length,
      averageThinkingTime: thinkingTime,
      movesPlayed: 1
    };

    return { position, metrics };
  }

  /**
   * Minimax algorithm adapted for odd/even game
   */
  private static minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    aiPlayer: 'odd' | 'even',
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number {
    this.incrementPositionCounter();
    
    const gameResult = OddEvenGame.evaluateGame(board);
    
    // Terminal states
    if (gameResult.winner === aiPlayer) return 10 - depth; // AI wins
    if (gameResult.winner && gameResult.winner !== aiPlayer) return depth - 10; // Human wins
    
    // For odd/even game, we need to limit depth to avoid infinite recursion
    if (depth >= 3) return 0; // Neutral evaluation at max depth
    
    const availablePositions = OddEvenGame.getEmptyPositions(board);
    
    if (isMaximizing) {
      let maxEvaluation = -Infinity;
      
      for (const position of availablePositions) {
        const newBoard = OddEvenGame.makeMove(board, position, aiPlayer);
        const evaluation = this.minimax(newBoard, depth + 1, false, aiPlayer, alpha, beta);
        maxEvaluation = Math.max(maxEvaluation, evaluation);
        alpha = Math.max(alpha, evaluation);
        
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return maxEvaluation;
    } else {
      let minEvaluation = Infinity;
      const humanPlayer = aiPlayer === 'odd' ? 'even' : 'odd';
      
      for (const position of availablePositions) {
        const newBoard = OddEvenGame.makeMove(board, position, humanPlayer);
        const evaluation = this.minimax(newBoard, depth + 1, true, aiPlayer, alpha, beta);
        minEvaluation = Math.min(minEvaluation, evaluation);
        beta = Math.min(beta, evaluation);
        
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return minEvaluation;
    }
  }

  /**
   * Finds the best move using minimax algorithm adapted for odd/even game
   */
  static getBestMove(board: Board, aiPlayer: 'odd' | 'even' = 'even'): AIResult {
    const startTime = performance.now();
    this.resetPositionCounter();
    
    const availablePositions = OddEvenGame.getEmptyPositions(board);
    
    if (availablePositions.length === 0) {
      throw new Error('No positions available');
    }
    
    let bestMove = availablePositions[0];
    let bestValue = -Infinity;
    
    for (const position of availablePositions) {
      const newBoard = OddEvenGame.makeMove(board, position, aiPlayer);
      const moveValue = this.minimax(newBoard, 0, false, aiPlayer);
      
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
   * Makes an AI move based on the specified difficulty
   */
  static makeAIMove(board: Board, gameMode: GameMode, aiPlayer: 'odd' | 'even' = 'even'): AIResult {
    switch (gameMode) {
      case 'easy':
        return this.makeRandomMove(board);
      case 'hard':
        return this.getBestMove(board, aiPlayer);
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
        return 'Strategic play - Challenging opponent';
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