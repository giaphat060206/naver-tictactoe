'use client';

import React, { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'pvp' | 'easy' | 'hard';

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  gameMode: GameMode;
}

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false,
    gameMode: 'pvp'
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

  // AI Helper Functions
  const getEmptyCells = (board: Board): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  };

  const makeRandomMove = (board: Board): number => {
    const emptyCells = getEmptyCells(board);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const minimax = (
    board: Board, 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number = -Infinity, 
    beta: number = Infinity
  ): number => {
    const winner = checkWinner(board);
    
    // Terminal states
    if (winner === 'O') return 10 - depth; // AI wins (prefer faster wins)
    if (winner === 'X') return depth - 10; // Human wins (prefer slower losses)
    if (isBoardFull(board)) return 0; // Tie
    
    const emptyCells = getEmptyCells(board);
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const cell of emptyCells) {
        board[cell] = 'O'; // AI move
        const evaluation = minimax(board, depth + 1, false, alpha, beta);
        board[cell] = null; // Undo move
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const cell of emptyCells) {
        board[cell] = 'X'; // Human move
        const evaluation = minimax(board, depth + 1, true, alpha, beta);
        board[cell] = null; // Undo move
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  };

  const getBestMove = (board: Board): number => {
    let bestMove = -1;
    let bestValue = -Infinity;
    const emptyCells = getEmptyCells(board);
    
    for (const cell of emptyCells) {
      board[cell] = 'O'; // AI move
      const moveValue = minimax(board, 0, false);
      board[cell] = null; // Undo move
      
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = cell;
      }
    }
    
    return bestMove;
  };

  const makeAIMove = (board: Board, gameMode: GameMode): number => {
    if (gameMode === 'easy') {
      return makeRandomMove(board);
    } else if (gameMode === 'hard') {
      return getBestMove(board);
    }
    return -1; // Should never reach here
  };

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.isGameOver) {
      return;
    }

    // Human player makes move
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    let winner = checkWinner(newBoard);
    let isFull = isBoardFull(newBoard);
    let nextPlayer: Player = gameState.currentPlayer === 'X' ? 'O' : 'X';

    // Check if game is over after human move
    if (winner || isFull) {
      setGameState({
        ...gameState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: winner,
        isGameOver: true
      });
      return;
    }

    // If playing against AI and it's AI's turn
    if (gameState.gameMode !== 'pvp' && nextPlayer === 'O') {
      const aiMoveIndex = makeAIMove(newBoard, gameState.gameMode);
      if (aiMoveIndex !== -1) {
        newBoard[aiMoveIndex] = 'O';
        winner = checkWinner(newBoard);
        isFull = isBoardFull(newBoard);
        nextPlayer = 'X'; // Back to human
      }
    }

    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winner,
      isGameOver: winner !== null || isFull
    });
  };

  const resetGame = () => {
    setGameState({
      ...gameState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false
    });
  };

  const changeGameMode = (newMode: GameMode) => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false,
      gameMode: newMode
    });
  };

  const getGameStatus = (): string => {
    if (gameState.winner) {
      if (gameState.gameMode === 'pvp') {
        return `Player ${gameState.winner} wins!`;
      } else {
        return gameState.winner === 'X' ? 'You win!' : 'AI wins!';
      }
    }
    if (gameState.isGameOver) {
      return "It's a tie!";
    }
    if (gameState.gameMode === 'pvp') {
      return `Player ${gameState.currentPlayer}'s turn`;
    } else {
      return gameState.currentPlayer === 'X' ? 'Your turn' : 'AI is thinking...';
    }
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
        
        {/* Game Mode Selection */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => changeGameMode('pvp')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gameState.gameMode === 'pvp'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            2 Players
          </button>
          <button
            onClick={() => changeGameMode('easy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gameState.gameMode === 'easy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Easy AI
          </button>
          <button
            onClick={() => changeGameMode('hard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gameState.gameMode === 'hard'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hard AI
          </button>
        </div>
        
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
            {gameState.gameMode === 'pvp' ? (
              <>
                <li>• Player 1 (X) goes first</li>
                <li>• Player 2 (O) goes second</li>
                <li>• Get 3 in a row to win!</li>
              </>
            ) : (
              <>
                <li>• You are X, AI is O</li>
                <li>• You go first</li>
                <li>• Easy AI makes random moves</li>
                <li>• Hard AI plays optimally</li>
                <li>• Get 3 in a row to win!</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;