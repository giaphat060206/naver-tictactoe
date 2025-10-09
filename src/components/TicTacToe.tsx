'use client';

import React from 'react';
import { useGameState } from '../hooks/useGameState';
import GameModeSelect from './GameModeSelect';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameInstructions from './GameInstructions';

/**
 * Main Tic Tac Toe Component
 * Orchestrates the game UI using clean architecture principles
 */
const TicTacToe: React.FC = () => {
  const { gameState, makeMove, resetGame, changeGameMode, getGameStatus } = useGameState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>
        
        <GameModeSelect
          currentMode={gameState.gameMode}
          onModeChange={changeGameMode}
        />
        
        <GameStatus
          status={getGameStatus()}
          gameMode={gameState.gameMode}
        />

        <GameBoard
          board={gameState.board}
          onCellClick={makeMove}
          isGameOver={gameState.isGameOver}
        />

        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>

        <GameInstructions gameMode={gameState.gameMode} />
      </div>
    </div>
  );
};

export default TicTacToe;