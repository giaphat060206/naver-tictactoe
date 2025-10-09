import { useState, useCallback, useEffect } from 'react';
import { GameState, GameMode, Player } from '../types/game';
import { TicTacToeGame } from '../logic/gameLogic';
import { TicTacToeAI } from '../logic/aiLogic';

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
    gameMode: 'pvp'
  });

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: TicTacToeGame.createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false
    }));
  }, []);

  /**
   * Changes the game mode and resets the game
   */
  const changeGameMode = useCallback((newMode: GameMode) => {
    setGameState({
      board: TicTacToeGame.createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false,
      gameMode: newMode
    });
  }, []);

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
    let nextPlayer = TicTacToeGame.getNextPlayer(gameState.currentPlayer);

    // If game is over after human move, update state and return
    if (gameResult.isGameOver) {
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult.winner,
        isGameOver: true
      }));
      return;
    }

    // If playing against AI and it's AI's turn
    if (gameState.gameMode !== 'pvp' && nextPlayer === 'O') {
      try {
        const aiPosition = TicTacToeAI.makeAIMove(newBoard, gameState.gameMode);
        const boardWithAIMove = TicTacToeGame.makeMove(newBoard, aiPosition, 'O');
        const finalGameResult = TicTacToeGame.evaluateGame(boardWithAIMove);
        
        setGameState(prevState => ({
          ...prevState,
          board: boardWithAIMove,
          currentPlayer: 'X', // Back to human
          winner: finalGameResult.winner,
          isGameOver: finalGameResult.isGameOver
        }));
      } catch (error) {
        console.error('AI move failed:', error);
        // Fallback to just human move
        setGameState(prevState => ({
          ...prevState,
          board: newBoard,
          currentPlayer: nextPlayer,
          winner: gameResult.winner,
          isGameOver: gameResult.isGameOver
        }));
      }
    } else {
      // PvP mode or human's turn
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult.winner,
        isGameOver: gameResult.isGameOver
      }));
    }
  }, [gameState]);

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
      return gameState.currentPlayer === 'X' ? 'Your turn' : 'AI is thinking... 🤔';
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
    makeMove,
    resetGame,
    changeGameMode,
    getGameStatus
  };
};