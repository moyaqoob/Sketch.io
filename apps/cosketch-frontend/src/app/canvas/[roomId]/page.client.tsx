'use client';

import Canvas from '@/components/canvas/canvas';
import CanvasFooter from '@/components/canvas/footer/canvas-footer';
import CanvasHeader from '@/components/canvas/header/canvas-header';
import ProtectCanvasRoute from '@/higher-order-component/protectCanvasRoute';
import { useParams } from 'next/navigation';
import React from 'react';

const CanvasClient = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <ProtectCanvasRoute roomId={roomId}>
      <section className='h-[100vh] overflow-hidden bg-black'>
        <CanvasHeader roomId={roomId} />
        <Canvas />;
        <CanvasFooter />
      </section>
    </ProtectCanvasRoute>
  );
};

export default CanvasClient;
