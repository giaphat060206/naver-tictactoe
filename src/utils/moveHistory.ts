import { Move, Player, Board } from '../types/game';

/**
 * Move History Utility
 * Manages move history tracking and formatting
 */
export class MoveHistoryManager {
  /**
   * Creates a new move record
   */
  static createMove(
    position: number,
    player: Player,
    moveNumber: number,
    boardSnapshot: Board,
    isAI: boolean = false
  ): Move {
    return {
      position,
      player,
      moveNumber,
      timestamp: Date.now(),
      isAI,
      boardSnapshot: [...boardSnapshot] // Create a copy of the board
    };
  }

  /**
   * Adds a move to the history
   */
  static addMove(
    history: Move[],
    position: number,
    player: Player,
    boardSnapshot: Board,
    isAI: boolean = false
  ): Move[] {
    const moveNumber = history.length + 1;
    const newMove = this.createMove(position, player, moveNumber, boardSnapshot, isAI);
    return [...history, newMove];
  }

  /**
   * Converts position number to board coordinates (A1, B2, etc.)
   */
  static positionToCoordinate(position: number): string {
    const row = Math.floor(position / 3);
    const col = position % 3;
    const rowLabel = ['A', 'B', 'C'][row];
    const colLabel = (col + 1).toString();
    return `${rowLabel}${colLabel}`;
  }

  /**
   * Formats move for display
   */
  static formatMove(move: Move, gameMode: string): string {
    const coordinate = this.positionToCoordinate(move.position);
    const playerDisplay = this.getPlayerDisplay(move.player, move.isAI || false, gameMode);
    return `${move.moveNumber}. ${playerDisplay} → ${coordinate}`;
  }

  /**
   * Gets player display name based on context
   */
  private static getPlayerDisplay(player: Player, isAI: boolean, gameMode: string): string {
    if (gameMode === 'pvp') {
      return `Player ${player}`;
    } else {
      if (player === 'X') {
        return 'You';
      } else {
        return isAI ? 'AI' : 'Player O';
      }
    }
  }

  /**
   * Formats timestamp for display
   */
  static formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  /**
   * Gets move duration between two moves
   */
  static getMoveDuration(currentMove: Move, previousMove?: Move): number {
    if (!previousMove) return 0;
    return currentMove.timestamp - previousMove.timestamp;
  }

  /**
   * Formats duration for display
   */
  static formatDuration(durationMs: number): string {
    if (durationMs < 1000) {
      return `${Math.round(durationMs)}ms`;
    } else {
      return `${(durationMs / 1000).toFixed(1)}s`;
    }
  }

  /**
   * Gets game statistics from move history
   */
  static getGameStats(history: Move[]) {
    if (history.length === 0) {
      return {
        totalMoves: 0,
        gameDuration: 0,
        averageMoveTime: 0,
        humanMoves: 0,
        aiMoves: 0
      };
    }

    const firstMove = history[0];
    const lastMove = history[history.length - 1];
    const gameDuration = lastMove.timestamp - firstMove.timestamp;
    
    const humanMoves = history.filter(move => !move.isAI).length;
    const aiMoves = history.filter(move => move.isAI).length;
    
    const averageMoveTime = history.length > 1 ? gameDuration / (history.length - 1) : 0;

    return {
      totalMoves: history.length,
      gameDuration,
      averageMoveTime,
      humanMoves,
      aiMoves
    };
  }

  /**
   * Clears move history
   */
  static clearHistory(): Move[] {
    return [];
  }

  /**
   * Reverts the game to a specific move by index
   * Returns the truncated history up to that move
   */
  static revertToMove(history: Move[], moveIndex: number): Move[] {
    if (moveIndex < 0 || moveIndex >= history.length) {
      throw new Error('Invalid move index');
    }
    return history.slice(0, moveIndex + 1);
  }

  /**
   * Gets the board state from a specific move
   */
  static getBoardFromMove(move: Move): Board {
    return [...move.boardSnapshot];
  }

  /**
   * Gets the next player after reverting to a specific move
   */
  static getNextPlayerAfterRevert(history: Move[], moveIndex: number): Player {
    if (moveIndex < 0 || moveIndex >= history.length) {
      return 'X'; // Default to X if invalid index
    }
    
    // The next player is the opposite of the player who made the move at moveIndex
    const lastPlayer = history[moveIndex].player;
    return lastPlayer === 'X' ? 'O' : 'X';
  }

  /**
   * Exports move history as string for sharing/saving
   */
  static exportHistory(history: Move[], gameMode: string): string {
    if (history.length === 0) return 'No moves played';
    
    const gameStats = this.getGameStats(history);
    let export_str = `Tic Tac Toe Game History (${gameMode.toUpperCase()})\n`;
    export_str += `===========================================\n`;
    export_str += `Total Moves: ${gameStats.totalMoves}\n`;
    export_str += `Game Duration: ${this.formatDuration(gameStats.gameDuration)}\n`;
    export_str += `Average Move Time: ${this.formatDuration(gameStats.averageMoveTime)}\n\n`;
    
    export_str += `Move Sequence:\n`;
    history.forEach((move, index) => {
      const prevMove = index > 0 ? history[index - 1] : undefined;
      const duration = this.getMoveDuration(move, prevMove);
      const time = this.formatTimestamp(move.timestamp);
      const formatted = this.formatMove(move, gameMode);
      
      export_str += `${formatted} [${time}]`;
      if (duration > 0) {
        export_str += ` (+${this.formatDuration(duration)})`;
      }
      export_str += '\n';
    });
    
    return export_str;
  }
}