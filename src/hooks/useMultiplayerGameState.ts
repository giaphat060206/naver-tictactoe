import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Board } from '../types/game';
import { useScoreTracking } from './useScoreTracking';
import { MoveHistoryManager } from '../utils/moveHistory';
import { useWebSocket } from './useWebSocket';

/**
 * Custom hook for managing Odd/Even multiplayer game state with WebSocket
 */
export const useMultiplayerGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(25).fill(0),
    currentPlayer: 'odd',
    winner: null,
    isGameOver: false,
    gameMode: 'pvp',
    winningCombination: null,
    moveHistory: MoveHistoryManager.clearHistory(),
    connectionStatus: 'connecting',
    assignedPlayer: null,
    bothPlayersConnected: false
  });

  const { scores, recordGameResult, resetAllScores, resetScoresByMode, getScoreSummary } = useScoreTracking();

  /**
   * WebSocket message handlers
   */
  const { sendMessage, connectionStatus, assignedPlayer, isConnected } = useWebSocket({
    onPlayerAssigned: useCallback((player: Player, board: Board) => {
      console.log(`🎮 You are assigned as: ${player?.toUpperCase()} player`);
      setGameState(prev => ({
        ...prev,
        assignedPlayer: player,
        board: board,
        currentPlayer: 'odd'
      }));
    }, []),

    onPlayerConnected: useCallback((player: Player, bothPlayersConnected: boolean) => {
      console.log(`👥 Player connected: ${player}, Both players: ${bothPlayersConnected}`);
      setGameState(prev => ({
        ...prev,
        bothPlayersConnected
      }));
    }, []),

    onGameStart: useCallback((board: Board) => {
      console.log('🎮 Game started!');
      setGameState(prev => ({
        ...prev,
        board: board,
        currentPlayer: 'odd',
        winner: null,
        isGameOver: false,
        winningCombination: null,
        moveHistory: MoveHistoryManager.clearHistory(),
        bothPlayersConnected: true
      }));
    }, []),

    onUpdate: useCallback((square: number, value: number, board: Board) => {
      console.log(`📊 Square ${square} updated to ${value}`);
      setGameState(prev => {
        // Determine which player made this move based on the value
        const player: Player = value % 2 === 1 ? 'odd' : 'even';
        
        // Add to move history
        const newHistory = MoveHistoryManager.addMove(
          prev.moveHistory,
          square,
          player,
          board
        );

        return {
          ...prev,
          board: board,
          moveHistory: newHistory,
          currentPlayer: value % 2 === 1 ? 'even' : 'odd' // Next player
        };
      });
    }, []),

    onGameOver: useCallback((winner: Player, winningLine: number[], board: Board) => {
      console.log(`🏆 Game over! Winner: ${winner?.toUpperCase()}`);
      setGameState(prev => ({
        ...prev,
        board: board,
        winner: winner,
        isGameOver: true,
        winningCombination: winningLine
      }));

      // Record the game result
      recordGameResult('pvp', winner);
    }, [recordGameResult]),

    onGameReset: useCallback((board: Board) => {
      console.log('🔄 Game reset');
      setGameState(prev => ({
        ...prev,
        board: board,
        currentPlayer: 'odd',
        winner: null,
        isGameOver: false,
        winningCombination: null,
        moveHistory: MoveHistoryManager.clearHistory()
      }));
    }, []),

    onPlayerDisconnected: useCallback((player: Player, message: string) => {
      console.log(`❌ Player disconnected: ${message}`);
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        bothPlayersConnected: false
      }));
      alert(message);
    }, []),

    onError: useCallback((message: string) => {
      console.error(`❌ Error: ${message}`);
      alert(`Error: ${message}`);
    }, [])
  });

  // Update connection status in game state
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      connectionStatus,
      assignedPlayer
    }));
  }, [connectionStatus, assignedPlayer]);

  /**
   * Makes a move at the specified position
   * Sends INCREMENT message to server instead of updating locally
   */
  const makeMove = useCallback((position: number) => {
    // Don't allow moves if game is over or not connected
    if (gameState.isGameOver || !isConnected) {
      return;
    }

    // Don't allow moves if both players aren't connected
    if (!gameState.bothPlayersConnected) {
      console.log('⚠️ Waiting for opponent...');
      return;
    }

    // Send INCREMENT message to server
    sendMessage({
      type: 'INCREMENT',
      square: position
    });

    console.log(`🎯 Sent INCREMENT for square ${position}`);
  }, [gameState.isGameOver, gameState.bothPlayersConnected, isConnected, sendMessage]);

  /**
   * Resets the game
   */
  const resetGame = useCallback(() => {
    sendMessage({
      type: 'RESET'
    });
  }, [sendMessage]);

  /**
   * Changes the game mode (not applicable in multiplayer, but keeping for compatibility)
   */
  const changeGameMode = useCallback(() => {
    // In multiplayer, we can't change game mode
    console.log('Game mode change not supported in multiplayer');
  }, []);

  /**
   * Reverts to a move (not supported in real-time multiplayer)
   */
  const revertToMove = useCallback(() => {
    console.log('Revert to move not supported in multiplayer');
  }, []);

  return {
    // Game state
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    isGameOver: gameState.isGameOver,
    gameMode: gameState.gameMode,
    winningCombination: gameState.winningCombination,
    moveHistory: gameState.moveHistory,
    
    // Multiplayer state (guaranteed to be defined in multiplayer mode)
    connectionStatus: gameState.connectionStatus!,
    assignedPlayer: gameState.assignedPlayer!,
    bothPlayersConnected: gameState.bothPlayersConnected!,
    isConnected,
    
    // Actions
    makeMove,
    resetGame,
    changeGameMode,
    revertToMove,
    
    // Score tracking
    scores,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary
  };
};
