import React from 'react';
import { Board, Player } from '../types/game';

interface GameBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  isGameOver: boolean;
}

/**
 * Game Board Component
 * Renders the 3x3 Tic Tac Toe board
 */
const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, isGameOver }) => {
  const getCellStyle = (position: number): string => {
    const baseStyle = "w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-3xl font-bold cursor-pointer transition-colors hover:bg-gray-100";
    
    if (board[position] || isGameOver) {
      return baseStyle + " cursor-not-allowed";
    }
    
    return baseStyle;
  };

  const getPlayerColor = (player: Player): string => {
    if (player === 'X') return 'text-blue-600';
    if (player === 'O') return 'text-red-600';
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
          aria-label={`Cell ${index + 1}, ${cell || 'empty'}`}
        >
          <span className={getPlayerColor(cell)}>
            {cell}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;