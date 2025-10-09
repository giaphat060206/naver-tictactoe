'use client';

import React from 'react';
import { Move, GameMode } from '../types/game';
import { MoveHistoryManager } from '../utils/moveHistory';

interface MoveHistoryProps {
  moves: Move[];
  gameMode: GameMode;
  onRevertToMove?: (moveIndex: number) => void;
  isCompact?: boolean;
  className?: string;
}

export function MoveHistory({ moves, gameMode, onRevertToMove, isCompact = false, className = '' }: MoveHistoryProps) {
  if (moves.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        No moves yet. Start playing to see the game history!
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Move History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {moves.length} move{moves.length !== 1 ? 's' : ''}
            </span>
            {onRevertToMove && moves.length > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Click to revert
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className={`p-4 ${isCompact ? 'max-h-40' : 'max-h-60'} overflow-y-auto`}>
        <div className="space-y-2">
          {moves.map((move, index) => (
            <div
              key={index}
              onClick={() => onRevertToMove && onRevertToMove(index)}
              className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors ${
                onRevertToMove 
                  ? 'hover:bg-blue-50 hover:border-blue-200 border border-transparent cursor-pointer' 
                  : 'hover:bg-gray-100'
              }`}
              title={onRevertToMove ? 'Click to revert to this move' : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                  onRevertToMove ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {index + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      move.player === 'X' 
                        ? 'bg-blue-500' 
                        : 'bg-red-500'
                    }`}
                  >
                    {move.player}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {MoveHistoryManager.formatMove(move, gameMode)}
                  </span>
                </div>
              </div>
              
              {!isCompact && (
                <div className="flex items-center space-x-2">
                  {onRevertToMove && (
                    <span className="text-xs text-blue-600">↶ Revert</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(move.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {moves.length > 0 && !isCompact && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              const historyText = MoveHistoryManager.exportHistory(moves, gameMode);
              navigator.clipboard.writeText(historyText).then(() => {
                // Could add a toast notification here
                console.log('Move history copied to clipboard');
              });
            }}
            className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            📋 Copy History to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version of MoveHistory for sidebar display
 */
export function CompactMoveHistory({ moves, gameMode, onRevertToMove, className = '' }: Omit<MoveHistoryProps, 'isCompact'>) {
  return (
    <MoveHistory 
      moves={moves} 
      gameMode={gameMode}
      onRevertToMove={onRevertToMove}
      isCompact={true} 
      className={className}
    />
  );
}