'use client';

import EncryptionBadge from '@/components/canvas/Encryption';
import ShareButton from '@/components/canvas/share-button';
import { useParams } from 'next/navigation';
import React from 'react';

const Canvas = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <>
      <div className='flex h-screen w-screen items-center justify-center text-5xl'>
        Canvas Room ID: {roomId}
        <ShareButton roomId={roomId} />
        <EncryptionBadge />
      </div>
    </>
  );
};

export default Canvas;
