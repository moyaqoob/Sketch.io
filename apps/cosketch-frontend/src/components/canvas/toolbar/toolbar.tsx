import React from 'react';
import {
  MousePointer,
  Square,
  Diamond,
  MoveRight,
  Minus,
  Pencil,
  Type,
  Eraser,
  Trash,
} from 'lucide-react';
import ToolbarButton from './toolbar-button';

const Toolbar = () => {
  return (
    <nav className='bg-background flex items-center justify-between gap-2 rounded-lg px-4 py-2 text-white shadow-md'>
      {/* Tool Buttons */}
      <div className='flex gap-2 border-r pr-4'>
        <ToolbarButton icon={MousePointer} />
        <ToolbarButton icon={Square} />
        <ToolbarButton icon={Diamond} />
        <ToolbarButton icon={MoveRight} />
        <ToolbarButton icon={Minus} />
        <ToolbarButton icon={Pencil} />
        <ToolbarButton icon={Type} />
        <ToolbarButton icon={Eraser} />
      </div>

      {/* Clear Button */}
      <button
        className='hover:bg-light_background cursor-pointer rounded p-2'
        aria-label='Clear canvas'
      >
        <Trash size={20} className='text-red-500' />
      </button>
    </nav>
  );
};

export default Toolbar;
