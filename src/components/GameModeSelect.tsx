import React from 'react';

/**
 * Game Mode Select Component
 * Displays current game mode (PvP only for multiplayer)
 */
const GameModeSelect: React.FC = () => {
  // Only PvP mode available
  return (
    <div className="flex justify-center gap-2 mb-6">
      <div className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white">
        Odd vs Even (PvP)
      </div>
    </div>
  );
};

export default GameModeSelect;