import { Shape } from '@repo/types';
import { useEffect, useRef, useCallback } from 'react';

type CanvasMessage =
  | { type: 'room:join' | 'room:leave'; room: string }
  | {
      type: 'canvas:draw' | 'canvas:erase' | 'canvas:update';
      room: string;
      data: Shape;
    }
  | { type: 'canvas:clear'; room: string };

type EventCallback = (message: CanvasMessage) => void;

export const useSocket = ({
  roomId,
  userId,
  onMessage,
  onOpen,
  onClose,
}: {
  roomId: string;
  userId: string;
  onMessage?: EventCallback;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const socketRef = useRef<WebSocket | null>(null);

  // Send a message to the server
  const sendMessage = useCallback((message: CanvasMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Handle connection lifecycle
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001`); // Adjust to your server

    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      sendMessage({ type: 'room:join', room: roomId });
      onOpen?.();
    };

    socket.onmessage = event => {
      const message: CanvasMessage = JSON.parse(event.data);
      onMessage?.(message);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      onClose?.();
    };

    socket.onerror = err => {
      console.error('WebSocket error:', err);
    };

    return () => {
      sendMessage({ type: 'room:leave', room: roomId });
      socket.close();
    };
  }, [roomId, userId, onMessage, onOpen, onClose, sendMessage]);

  return {
    sendMessage,
    socket: socketRef.current,
  };
};
