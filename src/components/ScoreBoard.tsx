import React from 'react';
import { GameMode, ScoreData } from '../types/game';
import { ScoreManager } from '../logic/scoreManager';

interface ScoreBoardProps {
  gameMode: GameMode;
  scoreSummary: {
    primary: ScoreData;
    secondary?: ScoreData;
    labels: { primary: string; secondary?: string };
  };
  onResetScores: () => void;
  onResetAllScores: () => void;
}

/**
 * Score Board Component
 * Displays current scores, streaks, and statistics
 */
const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  gameMode, 
  scoreSummary, 
  onResetScores, 
  onResetAllScores 
}) => {
  const renderScoreCard = (scoreData: ScoreData, label: string, isPrimary: boolean = true) => {
    const winPercentage = ScoreManager.getWinPercentage(scoreData);
    const streakText = ScoreManager.getStreakText(scoreData);
    
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${isPrimary ? 'border-l-4 border-blue-500' : 'border-l-4 border-green-500'}`}>
        <h3 className="font-semibold text-gray-800 mb-2">{label}</h3>
        
        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
          <div className="text-center">
            <div className="font-bold text-green-600">{scoreData.wins}</div>
            <div className="text-gray-500">Wins</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">{scoreData.losses}</div>
            <div className="text-gray-500">Losses</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">{scoreData.draws}</div>
            <div className="text-gray-500">Draws</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div>Games: {scoreData.gamesPlayed}</div>
          <div>Win Rate: {winPercentage}%</div>
          <div className={`font-medium ${
            scoreData.streakType === 'win' ? 'text-green-600' : 
            scoreData.streakType === 'loss' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {streakText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Score Tracker</h2>
        <div className="flex gap-2">
          <button
            onClick={onResetScores}
            className="text-xs px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
            title={`Reset ${gameMode.toUpperCase()} scores`}
          >
            Reset Mode
          </button>
          <button
            onClick={onResetAllScores}
            className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            title="Reset all scores"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${scoreSummary.secondary ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {renderScoreCard(scoreSummary.primary, scoreSummary.labels.primary, true)}
        {scoreSummary.secondary && scoreSummary.labels.secondary && 
          renderScoreCard(scoreSummary.secondary, scoreSummary.labels.secondary, false)
        }
      </div>
    </div>
  );
};

export default ScoreBoard;