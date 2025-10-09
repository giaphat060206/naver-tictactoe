import React from 'react';
import { GameMode } from '../types/game';

interface PerformanceMetricsProps {
  gameMode: GameMode;
  formattedMetrics: {
    lastMove: {
      positions: number;
      time: number;
    };
    cumulative: {
      totalPositions: number;
      averageTime: number;
      movesPlayed: number;
      efficiency: number;
    };
  } | null;
  insights: string[] | null;
}

/**
 * Performance Metrics Component
 * Displays AI performance statistics and insights
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  gameMode, 
  formattedMetrics, 
  insights 
}) => {
  // Don't render for PvP mode or when no metrics available
  if (gameMode === 'pvp' || !formattedMetrics) {
    return null;
  }

  const { lastMove, cumulative } = formattedMetrics;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="text-purple-600 mr-2">⚡</span>
          AI Performance Metrics
        </h2>
        <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          {gameMode === 'easy' ? 'Easy Mode' : 'Hard Mode'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Last Move Metrics */}
        <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Last Move</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Thinking Time:</span>
              <span className="font-bold text-blue-600">
                {lastMove.time.toFixed(2)}ms
              </span>
            </div>
            {gameMode === 'hard' && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Positions Evaluated:</span>
                <span className="font-bold text-green-600">
                  {lastMove.positions.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cumulative Metrics */}
        <div className="bg-white rounded-lg p-3 border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Game Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Avg. Time:</span>
              <span className="font-bold text-purple-600">
                {cumulative.averageTime.toFixed(2)}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">AI Moves:</span>
              <span className="font-bold text-gray-700">
                {cumulative.movesPlayed}
              </span>
            </div>
            {gameMode === 'hard' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Positions:</span>
                  <span className="font-bold text-orange-600">
                    {cumulative.totalPositions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Avg. per Move:</span>
                  <span className="font-bold text-red-600">
                    {cumulative.efficiency.toFixed(1)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-white rounded-lg p-3 border-l-4 border-yellow-500">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Performance Insights</h3>
          <div className="flex flex-wrap gap-2">
            {insights.map((insight, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-700 rounded-full border"
              >
                {insight}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        {gameMode === 'easy' ? (
          '🎲 Random selection algorithm - No position evaluation'
        ) : (
          '🧠 Minimax with Alpha-Beta pruning - Evaluating game tree positions'
        )}
      </div>
    </div>
  );
};

export default PerformanceMetrics;