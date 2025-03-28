'use client';

import Canvas from '@/components/canvas/canvas';
import CanvasFooter from '@/components/canvas/footer/canvas-footer';
import CanvasHeader from '@/components/canvas/header/canvas-header';
import ProtectCanvasRoute from '@/higher-order-component/protectCanvasRoute';
// import { useZoom } from '@/hook/useZoom';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const CanvasClient = () => {
  const { roomId } = useParams() as { roomId: string };
  const [selectedTool, setSelectedTool] = useState('Selection');
  // const { zoom, zoomIn, zoomOut } = useZoom();

  return (
    <ProtectCanvasRoute roomId={roomId}>
      <section className='h-[100vh] overflow-hidden bg-black'>
        <CanvasHeader
          roomId={roomId}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        <Canvas selectedTool={selectedTool} />;
        <CanvasFooter />
      </section>
    </ProtectCanvasRoute>
  );
};

export default CanvasClient;
