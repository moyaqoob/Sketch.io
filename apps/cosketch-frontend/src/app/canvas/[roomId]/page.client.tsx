'use client';

import Canvas from '@/components/canvas/canvas';
import CanvasFooter from '@/components/canvas/footer/canvas-footer';
import CanvasHeader from '@/components/canvas/header/canvas-header';
import { useParams } from 'next/navigation';
import React from 'react';

const CanvasClient = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <>
      <CanvasHeader roomId={roomId} />
      <Canvas roomId={roomId} />;
      <CanvasFooter />
    </>
  );
};

export default CanvasClient;
