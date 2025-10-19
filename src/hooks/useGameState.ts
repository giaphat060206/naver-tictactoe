import { useState, useCallback } from 'react';
import { GameState, GameMode, Player } from '../types/game';
import { OddEvenGame } from '../logic/gameLogic';
import { useScoreTracking } from './useScoreTracking';
import { MoveHistoryManager } from '../utils/moveHistory';

/**
 * Custom hook for managing Odd/Even game state
 * Encapsulates all game logic and provides clean interface for UI components
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: OddEvenGame.createEmptyBoard(),
    currentPlayer: 'odd',
    winner: null,
    isGameOver: false,
    gameMode: 'pvp',
    winningCombination: null,
    moveHistory: []
  });

  const { scores, recordGameResult, resetAllScores, resetScoresByMode, getScoreSummary } = useScoreTracking();

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: OddEvenGame.createEmptyBoard(),
      currentPlayer: 'odd',
      winner: null,
      isGameOver: false,
      winningCombination: null,
      moveHistory: MoveHistoryManager.clearHistory()
    }));
  }, []);

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
    const gameResult = OddEvenGame.evaluateGame(revertedBoard);

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
      board: OddEvenGame.createEmptyBoard(),
      currentPlayer: 'odd',
      winner: null,
      isGameOver: false,
      gameMode: newMode,
      winningCombination: null,
      moveHistory: MoveHistoryManager.clearHistory()
    });
  }, []);

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
    if (gameState.isGameOver || !OddEvenGame.isValidMove(gameState.board, position)) {
      return;
    }

    // Make human move
    const newBoard = OddEvenGame.makeMove(gameState.board, position, gameState.currentPlayer);
    const gameResult = OddEvenGame.evaluateGame(newBoard);
    const nextPlayer = OddEvenGame.getNextPlayer(gameState.currentPlayer);

    // Record the human move
    const updatedMoveHistory = MoveHistoryManager.addMove(
      gameState.moveHistory,
      position,
      gameState.currentPlayer,
      newBoard
    );

    // Update state
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
  }, [gameState, handleGameEnd]);

  /**
   * Gets the current game status message
   */
  const getGameStatus = useCallback((): string => {
    if (gameState.winner) {
      return gameState.winner === 'odd' ? 'Odd Player wins! 🔢' : 'Even Player wins! 🔢';
    }
    
    if (gameState.isGameOver) {
      return "It's a tie! 🤝";
    }
    
    return gameState.currentPlayer === 'odd' ? 'Odd Player\'s turn' : 'Even Player\'s turn';
  }, [gameState]);

  return {
    gameState,
    scores,
    makeMove,
    resetGame,
    revertToMove,
    changeGameMode,
    getGameStatus,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary
  };
};