import { useState, useCallback, useEffect } from 'react';
import { GameState, GameMode, Player } from '../types/game';
import { TicTacToeGame } from '../logic/gameLogic';
import { TicTacToeAI } from '../logic/aiLogic';
import { useScoreTracking } from './useScoreTracking';
import { usePerformanceMetrics } from './usePerformanceMetrics';
import { MoveHistoryManager } from '../utils/moveHistory';

/**
 * Custom hook for managing Tic Tac Toe game state
 * Encapsulates all game logic and provides clean interface for UI components
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: TicTacToeGame.createEmptyBoard(),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false,
    gameMode: 'pvp',
    winningCombination: null,
    moveHistory: []
  });

  const { scores, recordGameResult, resetAllScores, resetScoresByMode, getScoreSummary } = useScoreTracking();
  const { metrics, updateMetrics, resetMetrics, getFormattedMetrics, getPerformanceInsights } = usePerformanceMetrics();

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: TicTacToeGame.createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false,
      winningCombination: null,
      moveHistory: MoveHistoryManager.clearHistory()
    }));
    // Reset performance metrics for new game
    resetMetrics();
  }, [resetMetrics]);

  /**
   * Reverts the game to a specific move in the history
   */
  const revertToMove = useCallback((moveIndex: number) => {
    if (moveIndex < 0 || moveIndex >= gameState.moveHistory.length) {
      return;
    }

    const move = gameState.moveHistory[moveIndex];
    const revertedHistory = MoveHistoryManager.revertToMove(gameState.moveHistory, moveIndex);
    const revertedBoard = MoveHistoryManager.getBoardFromMove(move);
    const nextPlayer = MoveHistoryManager.getNextPlayerAfterRevert(gameState.moveHistory, moveIndex);
    
    // Evaluate the game state at this point
    const gameResult = TicTacToeGame.evaluateGame(revertedBoard);

    setGameState(prevState => ({
      ...prevState,
      board: revertedBoard,
      currentPlayer: nextPlayer,
      winner: gameResult.winner,
      isGameOver: gameResult.isGameOver,
      winningCombination: gameResult.winningCombination,
      moveHistory: revertedHistory
    }));
  }, [gameState.moveHistory]);

  /**
   * Changes the game mode and resets the game
   */
  const changeGameMode = useCallback((newMode: GameMode) => {
    setGameState({
      board: TicTacToeGame.createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false,
      gameMode: newMode,
      winningCombination: null,
      moveHistory: MoveHistoryManager.clearHistory()
    });
    // Reset performance metrics when changing modes
    resetMetrics();
  }, [resetMetrics]);

  /**
   * Records the game result when a game ends
   */
  const handleGameEnd = useCallback((winner: Player, gameMode: GameMode) => {
    recordGameResult(gameMode, winner);
  }, [recordGameResult]);

  /**
   * Makes a move at the specified position
   */
  const makeMove = useCallback((position: number) => {
    if (gameState.isGameOver || !TicTacToeGame.isValidMove(gameState.board, position)) {
      return;
    }

    // Make human move
    const newBoard = TicTacToeGame.makeMove(gameState.board, position, gameState.currentPlayer);
    const gameResult = TicTacToeGame.evaluateGame(newBoard);
    const nextPlayer = TicTacToeGame.getNextPlayer(gameState.currentPlayer);

    // Record the human move
    const updatedMoveHistory = MoveHistoryManager.addMove(
      gameState.moveHistory,
      position,
      gameState.currentPlayer,
      newBoard
    );

    // If game is over after human move, update state and record result
    if (gameResult.isGameOver) {
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult.winner,
        isGameOver: true,
        winningCombination: gameResult.winningCombination,
        moveHistory: updatedMoveHistory
      }));
      
      // Record the game result
      handleGameEnd(gameResult.winner, gameState.gameMode);
      return;
    }

    // If playing against AI and it's AI's turn
    if (gameState.gameMode !== 'pvp' && nextPlayer === 'O') {
      // Update to AI's turn first
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult.winner,
        isGameOver: gameResult.isGameOver,
        winningCombination: gameResult.winningCombination,
        moveHistory: updatedMoveHistory
      }));

      // Add 500ms delay before AI makes its move
      setTimeout(() => {
        try {
          // Make AI move with performance tracking
          const aiResult = TicTacToeAI.makeAIMove(newBoard, gameState.gameMode);
          const boardWithAIMove = TicTacToeGame.makeMove(newBoard, aiResult.position, 'O');
          const finalGameResult = TicTacToeGame.evaluateGame(boardWithAIMove);
          
          // Record the AI move
          const finalMoveHistory = MoveHistoryManager.addMove(
            updatedMoveHistory,
            aiResult.position,
            'O',
            boardWithAIMove,
            true // isAI = true
          );
          
          // Update performance metrics
          updateMetrics(aiResult.metrics);
          
          setGameState(prevState => ({
            ...prevState,
            board: boardWithAIMove,
            currentPlayer: 'X', // Back to human
            winner: finalGameResult.winner,
            isGameOver: finalGameResult.isGameOver,
            winningCombination: finalGameResult.winningCombination,
            moveHistory: finalMoveHistory
          }));

          // Record the game result if the game ended
          if (finalGameResult.isGameOver) {
            handleGameEnd(finalGameResult.winner, gameState.gameMode);
          }
        } catch (error) {
          console.error('AI move failed:', error);
          // Fallback to just human move
          setGameState(prevState => ({
            ...prevState,
            board: newBoard,
            currentPlayer: nextPlayer,
            winner: gameResult.winner,
            isGameOver: gameResult.isGameOver,
            winningCombination: gameResult.winningCombination,
            moveHistory: updatedMoveHistory
          }));
          
          if (gameResult.isGameOver) {
            handleGameEnd(gameResult.winner, gameState.gameMode);
          }
        }
      }, 500); // 500ms delay
    } else {
      // PvP mode or human's turn
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult.winner,
        isGameOver: gameResult.isGameOver,
        winningCombination: gameResult.winningCombination,
        moveHistory: updatedMoveHistory
      }));
      
      if (gameResult.isGameOver) {
        handleGameEnd(gameResult.winner, gameState.gameMode);
      }
    }
  }, [gameState, handleGameEnd, updateMetrics]);

  /**
   * Gets the current game status message
   */
  const getGameStatus = useCallback((): string => {
    if (gameState.winner) {
      if (gameState.gameMode === 'pvp') {
        return `Player ${gameState.winner} wins!`;
      } else {
        return gameState.winner === 'X' ? 'You win! 🎉' : 'AI wins! 🤖';
      }
    }
    
    if (gameState.isGameOver) {
      return "It's a tie! 🤝";
    }
    
    if (gameState.gameMode === 'pvp') {
      return `Player ${gameState.currentPlayer}'s turn`;
    } else {
      return gameState.currentPlayer === 'X' ? 'Your turn (X)' : "AI's turn (O)";
    }
  }, [gameState]);

  /**
   * Effect to handle AI delay for better UX
   */
  useEffect(() => {
    // Add slight delay for AI moves to make it feel more natural
    if (gameState.gameMode !== 'pvp' && gameState.currentPlayer === 'O' && !gameState.isGameOver) {
      const timer = setTimeout(() => {
        // This effect is just for visual feedback
        // The actual AI move is handled in makeMove function
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.isGameOver]);

  return {
    gameState,
    scores,
    metrics,
    makeMove,
    resetGame,
    revertToMove,
    changeGameMode,
    getGameStatus,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary,
    getFormattedMetrics,
    getPerformanceInsights
  };
};