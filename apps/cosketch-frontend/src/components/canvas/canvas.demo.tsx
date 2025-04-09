import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';
// import { Draw } from '@/canvas_engine/draw';
import { Tool } from '@/type/tool';

interface CanvasProps {
  roomId: string;
}

const cursorStyles = {
  Eraser: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PC9zdmc+") 20 20, auto`,
  FreeDraw: 'crosshair',
  Text: 'text',
  Selection: 'pointer',
  Rectangle: 'crosshair',
  Diamond: 'crosshair',
  Ellipse: 'crosshair',
  Arrow: 'default',
  Line: 'crosshair',
  default: 'crosshair',
};

const Canvas: React.FC<CanvasProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [canvasEngine, setCanvasEngine] = useState<Draw>();
  const [selectedTool, setSelectedTool] = useState<Tool>('Selection');

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // const draw = new Draw(canvas, roomId);
      // setCanvasEngine(draw);
      // return () => draw.destroy();
    }
  }, [canvasRef]);

  useEffect(() => {
    // canvasEngine?.setSelectedTool(selectedTool);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = cursorStyles[selectedTool] || cursorStyles.default;
    }
  }, [selectedTool]);

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
