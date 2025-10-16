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
  const modes = [
    { key: 'pvp' as GameMode, label: 'Odd vs Even', color: 'bg-purple-500' },
    { key: 'easy' as GameMode, label: 'Easy AI', color: 'bg-green-500' },
    { key: 'hard' as GameMode, label: 'Hard AI', color: 'bg-red-500' }
  ];

  return (
    <div className="flex justify-center gap-2 mb-6">
      {modes.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => onModeChange(key)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentMode === key
              ? `${color} text-white`
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default GameModeSelect;