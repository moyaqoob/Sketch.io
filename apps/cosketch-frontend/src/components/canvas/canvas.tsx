import React from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  return (
    <div className='relative h-screen w-screen bg-black'>
      <CanvasHeader roomId={roomId} />
      <div className='absolute inset-0 overflow-auto'>
        <div className='flex min-h-full w-full items-center justify-center'>
          <div className='flex h-full w-full items-center justify-center text-5xl text-white'>
            Canvas Room ID: {roomId}
          </div>
        </div>
      </div>
      <CanvasFooter />
    </div>
  );
};

export default Canvas;
