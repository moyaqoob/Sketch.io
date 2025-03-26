'use client';

import Canvas from '@/components/canvas/canvas';
import { useParams } from 'next/navigation';
import React from 'react';

const CanvasClient = () => {
  const { roomId } = useParams() as { roomId: string };

  return <Canvas roomId={roomId} />;
};

export default CanvasClient;
