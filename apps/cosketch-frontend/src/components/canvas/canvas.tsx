import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';

import { DrawController } from '@/canvas_engine/draw_controller';
import { Tool } from '@/type/tool';
import Sidebar from './sidebar/sidebar';
import { useSocketContext } from '@/contexts/socket_context';

interface CanvasProps {
  roomId: string;
  // socket: WebSocket;
}

const cursorStyles = {
  Eraser: '',
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
  const [canvasEngine, setCanvasEngine] = useState<DrawController>();
  const [isShapeSelected, setIsShapeSelected] = useState(false);

  console.log('in');
  // Selected Tool
  const [selectedTool, setSelectedTool] = useState<Tool>('Selection');
  // const context = useSocketContext();

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
      const draw = new DrawController(canvas, roomId);
      setCanvasEngine(draw);

      // Update shape selection state when mouse events occur
      const handleMouseDown = () => {
        if (draw.getSelectedShape()) {
          setIsShapeSelected(true);
        } else {
          setIsShapeSelected(false);
        }
      };

      const handleMouseUp = () => {
        if (draw.getSelectedShape()) {
          setIsShapeSelected(true);
        } else {
          setIsShapeSelected(false);
        }
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);

      return () => {
        draw.destroy();
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
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
        isShapeSelected={isShapeSelected}
        styles={styles}
        setStyles={setStyles}
      />

      <canvas ref={canvasRef} className='bg-black text-white'></canvas>
      <CanvasFooter />
    </>
  );
};

export default Canvas;
