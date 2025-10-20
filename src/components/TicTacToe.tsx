'use client';

import React from 'react';
import { useMultiplayerGameState } from '../hooks/useMultiplayerGameState';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import ScoreBoard from './ScoreBoard';
import { MoveHistory } from './MoveHistory';
import { ConnectionStatusDisplay } from './ConnectionStatusDisplay';

/**
 * Main Odd/Even Multiplayer Game Component
 * Real-time multiplayer using WebSocket
 */
const TicTacToe: React.FC = () => {
  const { 
    board,
    currentPlayer,
    winner,
    isGameOver,
    winningCombination,
    moveHistory,
    gameMode,
    connectionStatus,
    assignedPlayer,
    bothPlayersConnected,
    isConnected,
    makeMove, 
    resetGame,
    // scores, // Not currently used in multiplayer mode
    resetAllScores,
    resetScoresByMode,
    getScoreSummary
  } = useMultiplayerGameState();

  const getGameStatus = () => {
    if (!isConnected) return 'Connecting...';
    if (!bothPlayersConnected) return 'Waiting for opponent...';
    if (isGameOver) {
      if (winner) {
        return `${winner.charAt(0).toUpperCase() + winner.slice(1)} Player wins! 🏆`;
      }
      return "It's a tie! 🤝";
    }
    const playerName = currentPlayer || 'Unknown';
    return `${playerName.charAt(0).toUpperCase() + playerName.slice(1)} Player's turn`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          🎮 Odd/Even Multiplayer
        </h1>
        
        <div className="mb-6">
          <ConnectionStatusDisplay
            connectionStatus={connectionStatus}
            assignedPlayer={assignedPlayer}
            bothPlayersConnected={bothPlayersConnected}
          />
        </div>

        <div className="mb-6 flex justify-center">
          <ScoreBoard
            gameMode={gameMode}
            scoreSummary={getScoreSummary(gameMode)}
            onResetScores={() => resetScoresByMode(gameMode)}
            onResetAllScores={resetAllScores}
          />
        </div>
        
        <GameStatus
          status={getGameStatus()}
          gameMode={gameMode}
          isGameOver={isGameOver}
          winner={winner}
        />

        <GameBoard
          board={board}
          onCellClick={makeMove}
          isGameOver={isGameOver || !bothPlayersConnected}
          winningCombination={winningCombination}
        />

        {moveHistory.length > 0 && (
          <div className="mt-6">
            <MoveHistory
              moves={moveHistory}
              gameMode={gameMode}
              onRevertToMove={() => {}}
              className="max-w-md mx-auto"
            />
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            disabled={!bothPlayersConnected}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            New Game
          </button>
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>💡 <strong>How to play:</strong> Both players can click any square at any time!</p>
          <p>Each click increments the number. Get 5 consecutive odd/even numbers to win!</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;