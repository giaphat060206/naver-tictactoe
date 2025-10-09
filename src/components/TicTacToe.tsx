'use client';

import React from 'react';
import { useGameState } from '../hooks/useGameState';
import GameModeSelect from './GameModeSelect';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameInstructions from './GameInstructions';
import ScoreBoard from './ScoreBoard';
import PerformanceMetrics from './PerformanceMetrics';

/**
 * Main Tic Tac Toe Component
 * Orchestrates the game UI using clean architecture principles
 */
const TicTacToe: React.FC = () => {
  const { 
    gameState, 
    scores, 
    makeMove, 
    resetGame, 
    changeGameMode, 
    getGameStatus,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary,
    getFormattedMetrics,
    getPerformanceInsights
  } = useGameState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>
        
        <GameModeSelect
          currentMode={gameState.gameMode}
          onModeChange={changeGameMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ScoreBoard
            gameMode={gameState.gameMode}
            scoreSummary={getScoreSummary(gameState.gameMode)}
            onResetScores={() => resetScoresByMode(gameState.gameMode)}
            onResetAllScores={resetAllScores}
          />

          <PerformanceMetrics
            gameMode={gameState.gameMode}
            formattedMetrics={getFormattedMetrics(gameState.gameMode)}
            insights={getPerformanceInsights(gameState.gameMode)}
          />
        </div>
        
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