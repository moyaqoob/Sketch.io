import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Spinner from '@/components/spinner';

// Define types for the context value
type CanvasEventType =
  | 'canvas:draw'
  | 'canvas:clear'
  | 'canvas:erase'
  | 'canvas:update';

interface SocketContextType {
  isConnected: boolean;
  currentRoom: string | null;
  lastMessage: any;
  usersInRoom: string[];
  joinRoom: (room: string) => boolean;
  leaveRoom: () => boolean;
  sendCanvasEvent: (eventType: CanvasEventType, payload: any) => boolean;
  disconnect: () => void;
  reconnect: () => void;
}

// Create the context with a default value
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Props for the provider component
interface SocketProviderProps {
  children: ReactNode;
  token: string;
  serverUrl: string;
}

// Socket Provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  token,
  serverUrl,
}) => {
  const socket = useSocket({
    token,
    serverUrl,
    onUserConnected: message => {
      console.log('User connected:', message);
    },
    onUserDisconnected: message => {
      console.log('User disconnected:', message);
    },
    onCanvasEvent: message => {
      console.log('Canvas event received:', message);
    },
    onError: error => {
      console.error('Socket error:', error);
    },
  });

  if (!socket.isConnected) {
    return (
      <div className='bg-background_yellow flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          {/* Animated Spinner */}
          <Spinner />
          {/* Loading Text */}
          <p className='text-xl font-medium text-gray-700'>Connecting...</p>
        </div>
      </div>
    );
  }
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
