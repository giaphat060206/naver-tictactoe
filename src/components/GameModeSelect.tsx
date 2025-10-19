import React from 'react';
import { GameMode } from '../types/game';

interface GameModeSelectProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

/**
 * Game Mode Selection Component
 * Handles switching between different Odd/Even game modes
 */
const GameModeSelect: React.FC<GameModeSelectProps> = ({ currentMode, onModeChange }) => {
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