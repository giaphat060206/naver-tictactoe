import { useState, useCallback } from 'react';
import { PerformanceMetrics, GameMode } from '../types/game';
import { OddEvenAI } from '../logic/aiLogic';

/**
 * Custom hook for managing AI performance metrics
 */
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => 
    OddEvenAI.createInitialMetrics()
  );

  /**
   * Updates performance metrics with new AI move data
   */
  const updateMetrics = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(currentMetrics => 
      OddEvenAI.updateCumulativeMetrics(currentMetrics, newMetrics)
    );
  }, []);

  /**
   * Resets performance metrics
   */
  const resetMetrics = useCallback(() => {
    setMetrics(OddEvenAI.createInitialMetrics());
  }, []);

  /**
   * Gets formatted performance data for display
   */
  const getFormattedMetrics = useCallback((gameMode: GameMode) => {
    if (gameMode === 'pvp') {
      return null; // No AI performance metrics for PvP
    }

    return {
      lastMove: {
        positions: metrics.positionsEvaluated,
        time: Math.round(metrics.thinkingTimeMs * 100) / 100, // Round to 2 decimal places
      },
      cumulative: {
        totalPositions: metrics.totalPositionsEvaluated,
        averageTime: Math.round(metrics.averageThinkingTime * 100) / 100,
        movesPlayed: metrics.movesPlayed,
        efficiency: metrics.movesPlayed > 0 ? 
          Math.round((metrics.totalPositionsEvaluated / metrics.movesPlayed) * 10) / 10 : 0
      }
    };
  }, [metrics]);

  /**
   * Gets performance insights based on metrics
   */
  const getPerformanceInsights = useCallback((gameMode: GameMode) => {
    if (gameMode === 'pvp' || metrics.movesPlayed === 0) {
      return null;
    }

    const insights = [];
    
    if (gameMode === 'hard') {
      if (metrics.averageThinkingTime < 1) {
        insights.push('⚡ Lightning fast analysis');
      } else if (metrics.averageThinkingTime < 10) {
        insights.push('🚀 Quick thinking');
      } else {
        insights.push('🧠 Deep analysis');
      }

      const avgPositions = metrics.totalPositionsEvaluated / metrics.movesPlayed;
      if (avgPositions < 100) {
        insights.push('🎯 Efficient pruning');
      } else if (avgPositions < 500) {
        insights.push('⚖️ Balanced search');
      } else {
        insights.push('🔍 Thorough evaluation');
      }
    } else if (gameMode === 'easy') {
      insights.push('🎲 Random selection');
      if (metrics.averageThinkingTime < 0.1) {
        insights.push('⚡ Instant moves');
      }
    }

    return insights;
  }, [metrics]);

  return {
    metrics,
    updateMetrics,
    resetMetrics,
    getFormattedMetrics,
    getPerformanceInsights
  };
};