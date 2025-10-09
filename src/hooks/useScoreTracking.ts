import { useState, useCallback, useEffect } from 'react';
import { GameModeScores, GameMode, Player } from '../types/game';
import { ScoreManager } from '../logic/scoreManager';

/**
 * Custom hook for managing score state and operations
 */
export const useScoreTracking = () => {
  const [scores, setScores] = useState<GameModeScores>(() => 
    ScoreManager.loadScores()
  );

  /**
   * Records a game result and updates scores
   */
  const recordGameResult = useCallback((gameMode: GameMode, winner: Player) => {
    const newScores = ScoreManager.recordGameResult(scores, gameMode, winner);
    setScores(newScores);
  }, [scores]);

  /**
   * Resets all scores
   */
  const resetAllScores = useCallback(() => {
    const newScores = ScoreManager.resetAllScores();
    setScores(newScores);
  }, []);

  /**
   * Resets scores for a specific game mode
   */
  const resetScoresByMode = useCallback((gameMode: GameMode) => {
    const newScores = ScoreManager.resetScoresByMode(scores, gameMode);
    setScores(newScores);
  }, [scores]);

  /**
   * Gets score summary for a specific game mode
   */
  const getScoreSummary = useCallback((gameMode: GameMode) => {
    return ScoreManager.getScoreSummary(scores, gameMode);
  }, [scores]);

  /**
   * Effect to save scores whenever they change
   */
  useEffect(() => {
    ScoreManager.saveScores(scores);
  }, [scores]);

  return {
    scores,
    recordGameResult,
    resetAllScores,
    resetScoresByMode,
    getScoreSummary
  };
};