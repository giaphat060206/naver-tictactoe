import React from 'react';
import { GameMode } from '../types/game';

interface GameStatusProps {
  status: string;
  gameMode: GameMode;
  isGameOver: boolean;
  winner: string | null;
}

/**
 * Game Status Component
 * Displays current game status with enhanced styling for wins
 */
const GameStatus: React.FC<GameStatusProps> = ({ status, gameMode, isGameOver, winner }) => {
  const getStatusStyle = (): string => {
    let baseStyle = "text-xl font-semibold mb-6 transition-all duration-500";
    
    if (isGameOver && winner) {
      // Add celebration styling for wins
      return baseStyle + " text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-bounce text-2xl";
    } else if (isGameOver) {
      // Tie game styling
      return baseStyle + " text-gray-600";
    } else {
      // Regular game status
      return baseStyle + " text-gray-700";
    }
  };

  return (
    <div className="text-center">
      <p className={getStatusStyle()}>
        {status}
      </p>
      {isGameOver && winner && (
        <div className="mb-4">
          <div className="text-4xl animate-bounce">🎉</div>
          <div className="text-sm text-gray-500 mt-2">
            {gameMode === 'pvp' ? 'Great game!' : winner.includes('You') ? 'Amazing victory!' : 'Good try! Play again?'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;