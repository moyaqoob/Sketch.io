import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';
import { Draw } from '@/canvas_engine/draw';
import { Tool } from '@/type/tool';

interface CanvasProps {
  roomId: string;
}

const Canvas: React.FC<CanvasProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasEngine, setCanvasEngine] = useState<Draw>();
  const [selectedTool, setSelectedTool] = useState<Tool>('Selection');

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const draw = new Draw(canvas, roomId);
      setCanvasEngine(draw);

      return () => draw.destroy();
    }
  }, [canvasRef]);

  useEffect(() => {
    canvasEngine?.setSelectedTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [roomId, canvasRef]);

  return (
    <>
      <CanvasHeader
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        roomId={roomId}
      />
      <canvas ref={canvasRef} className='bg-black text-white'></canvas>
      <CanvasFooter />
    </>
  );
};

export default Canvas;
