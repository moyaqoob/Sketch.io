'use client';

import CanvasFooter from '@/components/canvas/footer/canvas-footer';
import CanvasHeader from '@/components/canvas/header/canvas-header';
import { useParams } from 'next/navigation';
import React from 'react';

const Canvas = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <>
      <CanvasHeader roomId={roomId} />
      <div className='flex h-[86vh] w-screen items-center justify-center text-5xl text-white'>
        Canvas Room ID: {roomId}
      </div>
      <CanvasFooter />
    </>
  );
};

export default Canvas;
