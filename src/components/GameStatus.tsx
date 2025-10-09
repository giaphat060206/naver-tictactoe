import React from 'react';
import { GameMode } from '../types/game';

interface GameStatusProps {
  status: string;
  gameMode: GameMode;
}

/**
 * Game Status Component
 * Displays current game status and instructions
 */
const GameStatus: React.FC<GameStatusProps> = ({ status, gameMode }) => {
  return (
    <div className="text-center mb-6">
      <p className="text-xl font-semibold text-gray-700">
        {status}
      </p>
    </div>
  );
};

export default GameStatus;