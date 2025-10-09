import React from 'react';
import { GameMode } from '../types/game';

interface GameInstructionsProps {
  gameMode: GameMode;
}

/**
 * Game Instructions Component
 * Displays how to play based on current game mode
 */
const GameInstructions: React.FC<GameInstructionsProps> = ({ gameMode }) => {
  return (
    <div className="mt-8 text-center text-gray-600">
      <h2 className="text-lg font-semibold mb-2">How to Play:</h2>
      <ul className="text-sm space-y-1">
        {gameMode === 'pvp' ? (
          <>
            <li>• Player 1 (X) goes first</li>
            <li>• Player 2 (O) goes second</li>
            <li>• Get 3 in a row to win!</li>
          </>
        ) : (
          <>
            <li>• You are X, AI is O</li>
            <li>• You go first</li>
            <li>• Easy AI makes random moves</li>
            <li>• Hard AI plays optimally</li>
            <li>• Get 3 in a row to win!</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default GameInstructions;