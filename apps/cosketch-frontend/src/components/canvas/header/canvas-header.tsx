import React from 'react';
import ShareButton from '../share-button';
import { ChevronLeft } from 'lucide-react';
import Toolbar from '../toolbar/toolbar';

interface HeaderProps {
  roomId: string;
}

const CanvasHeader = ({ roomId }: HeaderProps) => {
  return (
    <header className='fixed top-0 left-0 z-50 flex w-full items-center justify-between px-20 pt-6'>
      <button className='bg-background hover:bg-light_background flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-white transition'>
        <ChevronLeft size={16} className='h-5 w-8 cursor-pointer' />
      </button>
      <Toolbar />
      <ShareButton roomId={roomId} />
    </header>
  );
};

export default CanvasHeader;
