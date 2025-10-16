'use client';

import React from 'react';
import { useGameState } from '../hooks/useGameState';
import GameModeSelect from './GameModeSelect';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameInstructions from './GameInstructions';
import ScoreBoard from './ScoreBoard';
import { MoveHistory } from './MoveHistory';

/**
 * Main Odd/Even Game Component
 * Orchestrates the game UI using clean architecture principles
 */
const TicTacToe: React.FC = () => {
  const { 
    gameState, 
    makeMove, 
    resetGame,
    revertToMove,
    changeGameMode, 
    getGameStatus,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary
  } = useGameState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Odd/Even Game
        </h1>
        
        <GameModeSelect
          currentMode={gameState.gameMode}
          onModeChange={changeGameMode}
        />

        <div className="mb-6 flex justify-center">
          <ScoreBoard
            gameMode={gameState.gameMode}
            scoreSummary={getScoreSummary(gameState.gameMode)}
            onResetScores={() => resetScoresByMode(gameState.gameMode)}
            onResetAllScores={resetAllScores}
          />
        </div>
        
        <GameStatus
          status={getGameStatus()}
          gameMode={gameState.gameMode}
          isGameOver={gameState.isGameOver}
          winner={gameState.winner}
        />

        <GameBoard
          board={gameState.board}
          onCellClick={makeMove}
          isGameOver={gameState.isGameOver}
          winningCombination={gameState.winningCombination}
          gameMode={gameState.gameMode}
          currentPlayer={gameState.currentPlayer}
        />

        {gameState.moveHistory.length > 0 && (
          <div className="mt-6">
            <MoveHistory
              moves={gameState.moveHistory}
              gameMode={gameState.gameMode}
              onRevertToMove={revertToMove}
              className="max-w-md mx-auto"
            />
          </div>
        )}

        <div className="text-center mt-6">
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