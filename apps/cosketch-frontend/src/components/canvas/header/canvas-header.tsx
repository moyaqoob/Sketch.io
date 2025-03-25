import React from 'react';
import ShareButton from '../share-button';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  roomId: string;
}

const CanvasHeader = ({ roomId }: HeaderProps) => {
  return (
    <header className='flex items-center justify-between px-20 pt-6'>
      <button className='flex cursor-pointer items-center gap-2 rounded-lg bg-white px-2 py-2 text-black transition'>
        <ChevronLeft className='h-6 w-8 cursor-pointer' />
      </button>
      <nav></nav>
      <ShareButton roomId={roomId} />
    </header>
  );
};

export default CanvasHeader;
