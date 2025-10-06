'use client';

import React, { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
}

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false
  });

  const checkWinner = (board: Board): Player => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const isBoardFull = (board: Board): boolean => {
    return board.every(cell => cell !== null);
  };

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.isGameOver) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const isFull = isBoardFull(newBoard);

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner: winner,
      isGameOver: winner !== null || isFull
    });
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false
    });
  };

  const getGameStatus = (): string => {
    if (gameState.winner) {
      return `Player ${gameState.winner} wins!`;
    }
    if (gameState.isGameOver) {
      return "It's a tie!";
    }
    return `Player ${gameState.currentPlayer}'s turn`;
  };

  const getCellStyle = (index: number): string => {
    const baseStyle = "w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-3xl font-bold cursor-pointer transition-colors hover:bg-gray-100";
    
    if (gameState.board[index]) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-gray-700">
            {getGameStatus()}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-6 mx-auto w-fit">
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              className={getCellStyle(index)}
              onClick={() => handleCellClick(index)}
              disabled={gameState.isGameOver || cell !== null}
            >
              <span className={getPlayerColor(cell)}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <h2 className="text-lg font-semibold mb-2">How to Play:</h2>
          <ul className="text-sm space-y-1">
            <li>• Player 1 (X) goes first</li>
            <li>• Player 2 (O) goes second</li>
            <li>• Get 3 in a row to win!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;