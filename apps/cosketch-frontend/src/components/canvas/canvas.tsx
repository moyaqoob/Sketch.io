import React, { useEffect, useRef } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';
import { DrawController } from '@/canvas_engine/draw_controller';
import Sidebar from './sidebar/sidebar';
import { useCanvasEngineStore } from '@/stores/canvas.store';
import { useIsShapeSelectedStore } from '@/stores/shape_selected.store';
import { useCanvasStyleStore } from '@/stores/canvas_style.store';
import { useToolStore } from '@/stores/tool.store';

interface CanvasProps {
  roomId: string;
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
  const { canvasEngine, setCanvasEngine } = useCanvasEngineStore();

  // Canvas style properties
  const {
    strokeColor,
    backgroundColor,
    strokeWidth,
    strokeStyle,
    roughness,
    fillStyle,
  } = useCanvasStyleStore();

  const selectedTool = useToolStore(s => s.selectedTool);

  // Initialize canvas and controllers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = new DrawController(canvas, roomId);
    setCanvasEngine(draw);

    // Mouse event handlers with optimized state updates
    const handleMouseEvent = () => {
      const currentSelection = draw.getSelectedShape();
      const isSelected = !!currentSelection;
      const currentState = useIsShapeSelectedStore.getState().isShapeSelected;
      if (isSelected !== currentState) {
        useIsShapeSelectedStore.setState({ isShapeSelected: isSelected });
      }
    };

    canvas.addEventListener('mousedown', handleMouseEvent);
    canvas.addEventListener('mouseup', handleMouseEvent);

    return () => {
      draw.destroy();
      canvas.removeEventListener('mousedown', handleMouseEvent);
      canvas.removeEventListener('mouseup', handleMouseEvent);
    };
  }, []);

  // Update selected tool
  useEffect(() => {
    if (!canvasEngine) return;

    const currentTool = canvasEngine.getSelectedTool();
    if (currentTool !== selectedTool) {
      canvasEngine.setSelectedTool(selectedTool);
    }
  }, [canvasEngine, selectedTool]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor style
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = cursorStyles[selectedTool] || cursorStyles.default;
    }
  }, [selectedTool]);

  // Style properties update
  useEffect(() => {
    if (!canvasEngine) return;

    canvasEngine.setStrokeColor(strokeColor);
    canvasEngine.setFillColor(backgroundColor);
    canvasEngine.setStrokeWidth(strokeWidth);
    canvasEngine.setStrokeStyle(strokeStyle);
    canvasEngine.setRoughness(roughness);
    canvasEngine.setFillStyle(fillStyle);
  }, [
    canvasEngine,
    strokeColor,
    backgroundColor,
    strokeWidth,
    strokeStyle,
    roughness,
    fillStyle,
  ]);

  return (
    <>
      <CanvasHeader roomId={roomId} />
      <Sidebar selectedTool={selectedTool} />
      <canvas ref={canvasRef} className='bg-black text-white' />
      <CanvasFooter />
    </>
  );
};

export default React.memo(Canvas);
