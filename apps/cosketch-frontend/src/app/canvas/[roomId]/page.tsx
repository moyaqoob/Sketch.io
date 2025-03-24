'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const CanvasPage = () => {
  const { roomId } = useParams(); // ✅ Extract dynamic room ID from URL

  return (
    <div className='flex h-screen w-screen items-center justify-center text-5xl'>
      Canvas Room ID: {roomId}
    </div>
  );
};

export default CanvasPage;
