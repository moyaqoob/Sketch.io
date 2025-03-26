import React from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  return (
    <>
      <CanvasHeader roomId={roomId} />
      <div className='flex h-[87vh] w-screen items-center justify-center text-5xl text-white'>
        Canvas Room ID: {roomId}
      </div>
      <CanvasFooter />;
    </>
  );
};

export default Canvas;
