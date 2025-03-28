import React from 'react';
import ShareButton from '../share-button';
import { LogOut } from 'lucide-react';
import Toolbar from '../toolbar/toolbar';
import Tooltip from '../toolbar/tooltip';

interface HeaderProps {
  roomId: string;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const CanvasHeader = ({
  roomId,
  selectedTool,
  setSelectedTool,
}: HeaderProps) => {
  return (
    <header className='fixed top-0 left-0 z-50 flex w-full items-center justify-between px-15 pt-6 lg:px-20'>
      <div className='group relative'>
        <button className='bg-background hover:bg-light_background flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 text-white transition'>
          <LogOut size={20} className='h-5 w-8 cursor-pointer' />
          <Tooltip tooltip='leave room' />
        </button>
      </div>
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <ShareButton roomId={roomId} />
    </header>
  );
};

export default CanvasHeader;
