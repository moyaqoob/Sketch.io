import { useEffect, useState } from 'react';
import { WS_URL } from '@/config';
import toast from 'react-hot-toast';

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL as string);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
      setLoading(false);
      setError(null);

      // Join the room when connected
      ws.send(JSON.stringify({ type: 'join_room', roomId }));
    };

    ws.onerror = event => {
      console.error('WebSocket error', event);
      setError('WebSocket connection failed');
    };

    ws.onclose = () => {
      console.warn('WebSocket closed');
      setLoading(false);
      setSocket(null);
    };

    // Listen for messages
    ws.onmessage = event => {
      const data = JSON.parse(event.data);

      if (data.type === 'user_joined') {
        toast.success(`${data.username} joined the room 🎉`);
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return { socket, loading, error };
};
