import React from 'react';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  return <>Canvas Room ID: {roomId}</>;
};

export default Canvas;
