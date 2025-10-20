import { GameMode, Player, GameModeScores, ScoreData } from '../types/game';

/**
 * Score Management Module
 * Handles score tracking, persistence, and calculations
 */
export class ScoreManager {
  private static readonly STORAGE_KEY = 'tictactoe-scores';

  /**
   * Creates initial score data structure
   */
  private static createInitialScoreData(): ScoreData {
    return {
      wins: 0,
      losses: 0,
      draws: 0,
      currentStreak: 0,
      streakType: null,
      gamesPlayed: 0
    };
  }

  /**
   * Creates initial scores for all game modes
   */
  static createInitialScores(): GameModeScores {
    return {
      pvp: {
        odd: this.createInitialScoreData(),
        even: this.createInitialScoreData()
      }
    };
  }

  /**
   * Loads scores from localStorage
   */
  static loadScores(): GameModeScores {
    try {
      // Check if we're on the client side (not during SSR)
      if (typeof window === 'undefined') {
        return this.createInitialScores();
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate structure and merge with defaults for backward compatibility
        return {
          ...this.createInitialScores(),
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to load scores from localStorage:', error);
    }
    return this.createInitialScores();
  }

  /**
   * Saves scores to localStorage
   */
  static saveScores(scores: GameModeScores): void {
    try {
      // Check if we're on the client side (not during SSR)
      if (typeof window === 'undefined') {
        return;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.warn('Failed to save scores to localStorage:', error);
    }
  }

  /**
   * Updates score data based on game result
   */
  private static updateScoreData(
    scoreData: ScoreData, 
    result: 'win' | 'loss' | 'draw'
  ): ScoreData {
    const newScoreData = { ...scoreData };
    
    // Update counters
    newScoreData.gamesPlayed++;
    
    switch (result) {
      case 'win':
        newScoreData.wins++;
        break;
      case 'loss':
        newScoreData.losses++;
        break;
      case 'draw':
        newScoreData.draws++;
        break;
    }

    // Update streak
    if (newScoreData.streakType === result) {
      newScoreData.currentStreak++;
    } else {
      newScoreData.currentStreak = 1;
      newScoreData.streakType = result;
    }

    return newScoreData;
  }

  /**
   * Records a game result and updates scores
   */
  static recordGameResult(
    scores: GameModeScores,
    gameMode: GameMode,
    winner: Player
  ): GameModeScores {
    const newScores = { ...scores };

    // In PvP mode, update both players
    if (winner === 'odd') {
      newScores.pvp.odd = this.updateScoreData(scores.pvp.odd, 'win');
      newScores.pvp.even = this.updateScoreData(scores.pvp.even, 'loss');
    } else if (winner === 'even') {
      newScores.pvp.odd = this.updateScoreData(scores.pvp.odd, 'loss');
      newScores.pvp.even = this.updateScoreData(scores.pvp.even, 'win');
    } else {
      // Draw
      newScores.pvp.odd = this.updateScoreData(scores.pvp.odd, 'draw');
      newScores.pvp.even = this.updateScoreData(scores.pvp.even, 'draw');
    }

    this.saveScores(newScores);
    return newScores;
  }

  /**
   * Resets all scores
   */
  static resetAllScores(): GameModeScores {
    const newScores = this.createInitialScores();
    this.saveScores(newScores);
    return newScores;
  }

  /**
   * Resets scores for a specific game mode
   */
  static resetScoresByMode(scores: GameModeScores, _gameMode: GameMode): GameModeScores {
    const newScores = { ...scores };
    
    // Only PvP mode available
    newScores.pvp = {
      odd: this.createInitialScoreData(),
      even: this.createInitialScoreData()
    };
    
    this.saveScores(newScores);
    return newScores;
  }

  /**
   * Calculates win percentage
   */
  static getWinPercentage(scoreData: ScoreData): number {
    if (scoreData.gamesPlayed === 0) return 0;
    return Math.round((scoreData.wins / scoreData.gamesPlayed) * 100);
  }

  /**
   * Gets formatted streak text
   */
  static getStreakText(scoreData: ScoreData): string {
    if (!scoreData.streakType || scoreData.currentStreak === 0) {
      return 'No streak';
    }
    
    const streakTypeText = scoreData.streakType === 'win' ? 'Win' : 
                          scoreData.streakType === 'loss' ? 'Loss' : 'Draw';
    
    return `${scoreData.currentStreak} ${streakTypeText} streak`;
  }

  /**
   * Gets score summary for display
   */
  static getScoreSummary(scores: GameModeScores, _gameMode: GameMode): {
    primary: ScoreData;
    secondary?: ScoreData;
    labels: { primary: string; secondary?: string };
  } {
    // Only PvP mode available
    return {
      primary: scores.pvp.odd,
      secondary: scores.pvp.even,
      labels: {
        primary: 'Odd Player',
        secondary: 'Even Player'
      }
    };
  }
}