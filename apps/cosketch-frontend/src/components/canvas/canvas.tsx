'use client';

import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  selectedTool: string;
}

const Canvas: React.FC<CanvasProps> = ({ selectedTool }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctx.current = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    setupCanvas();

    window.addEventListener('resize', setupCanvas);

    return window.removeEventListener('resize', setupCanvas);
  }, []);

  return (
    <canvas ref={canvasRef} className='bg-amber-50'>
      CoSketch - Canvas{' '}
    </canvas>
  );
};

export default Canvas;
