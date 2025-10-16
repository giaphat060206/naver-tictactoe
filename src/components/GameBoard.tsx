import React, { useState, useEffect } from 'react';
import { Board, Player, GameMode } from '../types/game';

interface GameBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  isGameOver: boolean;
  winningCombination: number[] | null;
  gameMode: GameMode;
  currentPlayer: Player;
}

/**
 * Game Board Component
 * Renders the 5x5 Odd/Even number game board with winning combination highlighting
 */
const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  isGameOver, 
  winningCombination,
  gameMode,
  currentPlayer
}) => {
  const [animatingCells, setAnimatingCells] = useState<Set<number>>(new Set());
  const [previousBoard, setPreviousBoard] = useState<Board>(board);

  // Track board changes to trigger animations
  useEffect(() => {
    const newAnimatingCells = new Set<number>();
    
    board.forEach((value, index) => {
      if (value !== previousBoard[index]) {
        newAnimatingCells.add(index);
      }
    });
    
    if (newAnimatingCells.size > 0) {
      setAnimatingCells(newAnimatingCells);
      
      // Remove animation after 300ms
      const timer = setTimeout(() => {
        setAnimatingCells(new Set());
      }, 300);
      
      setPreviousBoard([...board]);
      
      return () => clearTimeout(timer);
    }
  }, [board, previousBoard]);
  const getCellStyle = (position: number): string => {
    let baseStyle = "w-16 h-16 border-2 border-gray-400 flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-300 rounded-lg";
    
    // Check if this cell is part of the winning combination
    const isWinningCell = winningCombination?.includes(position);
    const value = board[position];
    
    if (isWinningCell) {
      // Highlight winning cells with a golden glow
      baseStyle += " bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400 shadow-lg ring-2 ring-yellow-400 animate-pulse";
    } else if (value > 0) {
      // Style based on odd/even value
      if (value % 2 === 1) {
        baseStyle += " bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100";
      } else {
        baseStyle += " bg-red-50 border-red-300 text-red-700 hover:bg-red-100";
      }
    } else {
      baseStyle += " bg-gray-50 hover:bg-gray-100 text-gray-400";
    }
    
    return baseStyle;
  };

  const getValueColor = (value: number, position: number): string => {
    const isWinningCell = winningCombination?.includes(position);
    const isAnimating = animatingCells.has(position);
    
    let baseColor = '';
    if (isWinningCell) {
      // Make winning numbers stand out more
      baseColor = 'text-yellow-800 font-extrabold drop-shadow-lg';
    } else if (value > 0) {
      if (value % 2 === 1) {
        baseColor = 'text-blue-600 font-bold';
      } else {
        baseColor = 'text-red-600 font-bold';
      }
    } else {
      baseColor = 'text-gray-400';
    }
    
    // Add fade-in animation for newly changed values
    if (isAnimating) {
      baseColor += ' animate-pulse opacity-0 animate-fade-in';
    }
    
    return baseColor;
  };

  return (
    <div className="grid grid-cols-5 gap-2 mb-6 mx-auto w-fit"> {/* Changed to 5x5 grid */}
      {board.map((value, index) => (
        <button
          key={index}
          className={getCellStyle(index)}
          onClick={() => onCellClick(index)}
          disabled={isGameOver}
          aria-label={`Square ${index + 1}, value ${value}${
            winningCombination?.includes(index) ? ', winning square' : ''
          }`}
        >
          <span 
            className={`${getValueColor(value, index)} transition-all duration-300 ${
              animatingCells.has(index) ? 'animate-fade-in' : ''
            }`}
          >
            {value > 0 ? value : ''}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;