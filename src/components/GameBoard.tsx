import React, { useState, useEffect } from 'react';
import { Board, Player } from '../types/game';

interface GameBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  isGameOver: boolean;
  winningCombination: number[] | null;
}

/**
 * Game Board Component
 * Renders the 3x3 Tic Tac Toe board with winning combination highlighting and fade-in animations
 */
const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  isGameOver, 
  winningCombination 
}) => {
  const [animatingCells, setAnimatingCells] = useState<Set<number>>(new Set());
  const [previousBoard, setPreviousBoard] = useState<Board>(board);

  // Track board changes to trigger animations
  useEffect(() => {
    const newAnimatingCells = new Set<number>();
    
    board.forEach((cell, index) => {
      if (cell && cell !== previousBoard[index]) {
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
    const isAnimating = animatingCells.has(position);
    
    let baseColor = '';
    if (isWinningCell) {
      // Make winning pieces stand out more
      if (player === 'X') baseColor = 'text-blue-800 font-extrabold drop-shadow-lg';
      if (player === 'O') baseColor = 'text-red-800 font-extrabold drop-shadow-lg';
    } else {
      if (player === 'X') baseColor = 'text-blue-600';
      if (player === 'O') baseColor = 'text-red-600';
    }
    
    // Add fade-in animation for newly placed pieces
    if (isAnimating) {
      baseColor += ' animate-pulse opacity-0 animate-fade-in';
    }
    
    return baseColor;
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
          <span 
            className={`${getPlayerColor(cell, index)} transition-all duration-300 ${
              animatingCells.has(index) ? 'animate-fade-in' : ''
            }`}
          >
            {cell}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;