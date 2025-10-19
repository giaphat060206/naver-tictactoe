import React from 'react';
import { ConnectionStatus, Player } from '../types/game';

interface ConnectionStatusDisplayProps {
  connectionStatus: ConnectionStatus;
  assignedPlayer: Player;
  bothPlayersConnected: boolean;
}

/**
 * Connection Status Display Component
 * Shows the current connection state and player assignment
 */
export const ConnectionStatusDisplay: React.FC<ConnectionStatusDisplayProps> = ({
  connectionStatus,
  assignedPlayer,
  bothPlayersConnected
}) => {
  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          text: 'Connecting to server...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: '🔄'
        };
      case 'waiting':
        return {
          text: 'Waiting for opponent...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: '⏳'
        };
      case 'connected':
        return {
          text: 'Both players connected - Game ready!',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '✅'
        };
      case 'disconnected':
        return {
          text: 'Disconnected from server',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: '❌'
        };
      case 'error':
        return {
          text: 'Connection error',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: '⚠️'
        };
      default:
        return {
          text: 'Unknown status',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: '❓'
        };
    }
  };

  const status = getStatusDisplay();
  const playerColor = assignedPlayer === 'odd' ? 'text-blue-600' : 'text-red-600';
  const playerBgColor = assignedPlayer === 'odd' ? 'bg-blue-100' : 'bg-red-100';

  return (
    <div className="space-y-2">
      {/* Connection Status */}
      <div className={`${status.bgColor} ${status.color} px-4 py-2 rounded-lg text-center font-semibold`}>
        <span className="mr-2">{status.icon}</span>
        {status.text}
      </div>

      {/* Player Assignment */}
      {assignedPlayer && (
        <div className={`${playerBgColor} ${playerColor} px-4 py-2 rounded-lg text-center font-semibold`}>
          You are the <span className="uppercase font-bold">{assignedPlayer}</span> player
          {assignedPlayer === 'odd' && ' - You go first! 🔵'}
          {assignedPlayer === 'even' && ' - You go second! 🔴'}
        </div>
      )}

      {/* Instructions */}
      {!bothPlayersConnected && connectionStatus === 'waiting' && (
        <div className="text-sm text-gray-600 text-center italic">
          Open this page in another browser window to start playing!
        </div>
      )}
    </div>
  );
};
