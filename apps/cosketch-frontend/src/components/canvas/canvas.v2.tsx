import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';

import { DrawV2 } from '@/canvas_engine/draw.v2';
import { Tool } from '@/type/tool';
import Sidebar from './sidebar/sidebar';

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

const CanvasV2: React.FC<CanvasProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasEngine, setCanvasEngine] = useState<DrawV2>();

  // Selected Tool
  const [selectedTool, setSelectedTool] = useState<Tool>('Selection');

  // Shape Styling
  const [styles, setStyles] = useState({
    strokeColor: 'white',
    backgroundColor: 'transparent',
    strokeWidth: 'thin' as 'thin' | 'medium' | 'thick',
    strokeStyle: 'solid' as 'solid' | 'dashed' | 'dotted',
    roughness: 'none' as 'none' | 'normal' | 'high',
    fillStyle: 'hachure' as 'hachure' | 'solid' | 'cross-hatch',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const draw = new DrawV2(canvas, roomId);
      setCanvasEngine(draw);

      return () => draw.destroy();
    }
  }, [canvasRef]);

  useEffect(() => {
    canvasEngine?.setSelectedTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (canvasEngine) {
      canvasEngine.setStrokeColor(styles.strokeColor);
      canvasEngine.setFillColor(styles.backgroundColor);
      canvasEngine.setStrokeWidth(styles.strokeWidth);
      canvasEngine.setStrokeStyle(styles.strokeStyle);
      canvasEngine.setRoughness(styles.roughness);
      canvasEngine.setFillStyle(styles.fillStyle);
    }
  }, [styles]);

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

      <Sidebar
        selectedTool={selectedTool}
        styles={styles}
        setStyles={setStyles}
      />

      <canvas ref={canvasRef} className='bg-black text-white'></canvas>
      <CanvasFooter />
    </>
  );
};

export default CanvasV2;
