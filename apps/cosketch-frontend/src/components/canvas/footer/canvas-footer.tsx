import React from 'react';
import CanvasZoom from './canvas-zoom';
import EncryptionBadge from './Encryption';

const CanvasFooter = () => {
  return (
    <footer className='flex items-center justify-between px-20'>
      <CanvasZoom />
      <EncryptionBadge />
    </footer>
  );
};

export default CanvasFooter;
