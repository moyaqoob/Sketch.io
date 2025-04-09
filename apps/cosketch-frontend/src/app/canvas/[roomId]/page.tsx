'use client';

import ProtectCanvasRoute from '@/components/guards/protectCanvasRoute';
import Canvas from '@/components/canvas/canvas';
import { WS_URL } from '@/config';

import { useParams } from 'next/navigation';
import { SocketProvider } from '@/contexts/socket_context';
import { useEffect, useState } from 'react';

const CanvasPage = () => {
  const { roomId } = useParams() as { roomId: string };
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || '';
    const token = storedToken?.split(' ')[1];
    setToken(token);
  }, []);

  return (
    <ProtectCanvasRoute roomId={roomId}>
      {/* <SocketProvider token={token} serverUrl={WS_URL as string}> */}
      <section className='h-[100vh] overflow-hidden'>
        <Canvas roomId={roomId} />
      </section>
      {/* </SocketProvider> */}
    </ProtectCanvasRoute>
  );
};

export default CanvasPage;
