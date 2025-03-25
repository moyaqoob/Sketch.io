'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const CanvasZoom = () => {
  const [zoom, setZoom] = useState(10); // Default 100%

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300)); // Max 300%
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 10)); // Min 10%

  return (
    <div className='flex items-center gap-4 rounded-lg bg-gray-100 px-3 py-1 shadow-md'>
      <button
        onClick={handleZoomOut}
        className='cursor-pointer rounded-full p-2 hover:bg-gray-200'
      >
        <Minus className='h-5 w-5 text-gray-600' />
      </button>

      <span className='text-lg font-semibold'>{zoom}%</span>

      <button
        onClick={handleZoomIn}
        className='cursor-pointer rounded-full p-2 hover:bg-gray-200'
      >
        <Plus className='h-5 w-5 text-gray-600' />
      </button>
    </div>
  );
};

export default CanvasZoom;
