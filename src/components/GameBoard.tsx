import React from 'react';
import { Board, Player } from '../types/game';

interface GameBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  isGameOver: boolean;
  winningCombination: number[] | null;
}

/**
 * Game Board Component
 * Renders the 3x3 Tic Tac Toe board with winning combination highlighting
 */
const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  isGameOver, 
  winningCombination 
}) => {
  const getCellStyle = (position: number): string => {
    let baseStyle = "w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300";
    
    // Check if this cell is part of the winning combination
    const isWinningCell = winningCombination?.includes(position);
    
    if (isWinningCell) {
      // Highlight winning cells with a golden glow
      baseStyle += " bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400 shadow-lg ring-2 ring-yellow-400 animate-pulse";
    } else if (board[position] || isGameOver) {
      baseStyle += " cursor-not-allowed hover:bg-gray-100";
    } else {
      baseStyle += " hover:bg-gray-100";
    }
    
    return baseStyle;
  };

  const getPlayerColor = (player: Player, position: number): string => {
    const isWinningCell = winningCombination?.includes(position);
    
    if (isWinningCell) {
      // Make winning pieces stand out more
      if (player === 'X') return 'text-blue-800 font-extrabold drop-shadow-lg';
      if (player === 'O') return 'text-red-800 font-extrabold drop-shadow-lg';
    } else {
      if (player === 'X') return 'text-blue-600';
      if (player === 'O') return 'text-red-600';
    }
    return '';
  };

  return (
    <div className="grid grid-cols-3 gap-1 mb-6 mx-auto w-fit">
      {board.map((cell, index) => (
        <button
          key={index}
          className={getCellStyle(index)}
          onClick={() => onCellClick(index)}
          disabled={isGameOver || cell !== null}
          aria-label={`Cell ${index + 1}, ${cell || 'empty'}${
            winningCombination?.includes(index) ? ', winning cell' : ''
          }`}
        >
          <span className={getPlayerColor(cell, index)}>
            {cell}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;