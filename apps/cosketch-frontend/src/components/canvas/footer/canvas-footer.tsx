import React from 'react';
import CanvasZoom from './canvas-zoom';
import EncryptionBadge from './Encryption';

const CanvasFooter = () => {
  return (
    <footer className='fixed bottom-0 left-0 flex w-full items-center justify-between px-20 py-4 shadow-md'>
      <CanvasZoom />
      <EncryptionBadge />
    </footer>
  );
};

export default CanvasFooter;
