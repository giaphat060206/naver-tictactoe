import React from 'react';
import { GameMode } from '../types/game';

interface GameInstructionsProps {
  gameMode: GameMode;
}

/**
 * Game Instructions Component
 * Displays how to play the Odd/Even number game
 */
const GameInstructions: React.FC<GameInstructionsProps> = ({ gameMode }) => {
  return (
    <div className="mt-8 text-center text-gray-600">
      <h2 className="text-lg font-semibold mb-2">How to Play Odd/Even:</h2>
      <ul className="text-sm space-y-1">
        <li>• <span className="text-blue-600 font-semibold">Odd Player</span> goes first</li>
        <li>• <span className="text-red-600 font-semibold">Even Player</span> goes second</li>
        <li>• Click any square to increment its number (0→1→2→3...)</li>
        <li>• Get 5 consecutive <span className="text-blue-600 font-semibold">odd numbers</span> or <span className="text-red-600 font-semibold">even numbers</span> in a row to win!</li>
        <li>• Rows, columns, or diagonals all count</li>
      </ul>
    </div>
  );
};

export default GameInstructions;