/**
 * WebSocket Hook for Multiplayer Game
 * Manages WebSocket connection and message handling
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import type { Player, Board, ConnectionStatus, WSMessage } from '../types/game';

const WS_URL = 'ws://localhost:8080';

export interface UseWebSocketReturn {
  sendMessage: (message: WSMessage) => void;
  connectionStatus: ConnectionStatus;
  assignedPlayer: Player;
  isConnected: boolean;
}

interface MessageHandler {
  onPlayerAssigned?: (player: Player, board: Board) => void;
  onUpdate?: (square: number, value: number, board: Board) => void;
  onGameOver?: (winner: Player, winningLine: number[], board: Board) => void;
  onGameStart?: (board: Board) => void;
  onGameReset?: (board: Board) => void;
  onPlayerConnected?: (player: Player, bothPlayersConnected: boolean) => void;
  onPlayerDisconnected?: (player: Player, message: string) => void;
  onError?: (message: string) => void;
}

export function useWebSocket(handlers: MessageHandler): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [assignedPlayer, setAssignedPlayer] = useState<Player>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIntentionalClose = useRef(false);
  const isConnecting = useRef(false); // Prevent multiple simultaneous connections
  const handlersRef = useRef(handlers);
  
  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  /**
   * Send message to server
   */
  const sendMessage = useCallback((message: WSMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    // Prevent multiple simultaneous connections
    if (isConnecting.current || (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('⚠️ Already connecting, skipping...');
      return;
    }

    // Close existing connection if any
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('⚠️ Already connected, skipping...');
      return;
    }

    try {
      console.log('🔌 Connecting to WebSocket server...');
      isConnecting.current = true;
      setConnectionStatus('connecting');

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        isConnecting.current = false;
        setConnectionStatus('waiting');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          console.log('📨 Received message:', message);

          switch (message.type) {
            case 'PLAYER_ASSIGNED':
              {
                const { player, board } = message as { player: Player; board: Board };
                setAssignedPlayer(player);
                setConnectionStatus('waiting');
                handlersRef.current.onPlayerAssigned?.(player, board);
              }
              break;

            case 'PLAYER_CONNECTED':
              {
                const { player, bothPlayersConnected } = message as {
                  player: Player;
                  bothPlayersConnected: boolean;
                };
                if (bothPlayersConnected) {
                  setConnectionStatus('connected');
                }
                handlersRef.current.onPlayerConnected?.(player, bothPlayersConnected);
              }
              break;

            case 'GAME_START':
              {
                const { board } = message as { board: Board };
                setConnectionStatus('connected');
                handlersRef.current.onGameStart?.(board);
              }
              break;

            case 'UPDATE':
              {
                const { square, value, board } = message as {
                  square: number;
                  value: number;
                  board: Board;
                };
                handlersRef.current.onUpdate?.(square, value, board);
              }
              break;

            case 'GAME_OVER':
              {
                const { winner, winningLine, board } = message as {
                  winner: Player;
                  winningLine: number[];
                  board: Board;
                };
                handlersRef.current.onGameOver?.(winner, winningLine, board);
              }
              break;

            case 'GAME_RESET':
              {
                const { board } = message as { board: Board };
                handlersRef.current.onGameReset?.(board);
              }
              break;

            case 'PLAYER_DISCONNECTED':
              {
                const { player, message: msg } = message as {
                  player: Player;
                  message: string;
                };
                setConnectionStatus('disconnected');
                handlersRef.current.onPlayerDisconnected?.(player, msg);
              }
              break;

            case 'ERROR':
              {
                const { message: errorMsg } = message as { message: string };
                setConnectionStatus('error');
                handlersRef.current.onError?.(errorMsg);
              }
              break;

            default:
              console.warn('⚠️ Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        isConnecting.current = false;
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', { code: event.code, reason: event.reason });
        isConnecting.current = false;
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Don't reconnect - let the user manually refresh
        console.log('❌ Connection closed. Please refresh the page to reconnect.');
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      isConnecting.current = false;
      setConnectionStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies - handlers accessed via ref

  /**
   * Cleanup and disconnect
   */
  const disconnect = useCallback(() => {
    isIntentionalClose.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    isIntentionalClose.current = false;
    connect();
    
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    sendMessage,
    connectionStatus,
    assignedPlayer,
    isConnected: connectionStatus === 'connected'
  };
}
