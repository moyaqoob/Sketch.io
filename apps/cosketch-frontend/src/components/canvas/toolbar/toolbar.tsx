'use client';

import React, { useState, useEffect } from 'react';
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
  LockKeyholeOpen,
  LockKeyhole,
} from 'lucide-react';
import ToolbarButton from './toolbar-button';

const tools = [
  { icon: MousePointer, tool: 'MousePointer', id: 1 },
  { icon: Square, tool: 'Square', id: 2 },
  { icon: Diamond, tool: 'Diamond', id: 3 },
  { icon: MoveRight, tool: 'MoveRight', id: 4 },
  { icon: Minus, tool: 'Minus', id: 5 },
  { icon: Pencil, tool: 'Pencil', id: 6 },
  { icon: Type, tool: 'Type', id: 7 },
  { icon: Eraser, tool: 'Eraser', id: 8 },
];

const Toolbar = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedTool, setSelectedTool] = useState('MousePointer'); // Default tool

  const toggleLock = () => {
    setIsLocked(prev => !prev);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  useEffect(() => {
    const resetTool = () => {
      if (!isLocked) {
        setSelectedTool('MousePointer');
      }
    };

    window.addEventListener('mouseup', resetTool);

    return () => {
      window.removeEventListener('mouseup', resetTool);
    };
  }, [isLocked]);

  return (
    <nav className='bg-background flex items-center justify-between gap-2 rounded-lg px-4 py-1 text-white shadow-md'>
      {/* Lock Toggle Button */}
      <button
        onClick={toggleLock}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded ${isLocked ? 'bg-tool_select' : 'hover:bg-light_background'}`}
        aria-label='Toggle lock'
      >
        {isLocked ? <LockKeyhole size={16} /> : <LockKeyholeOpen size={16} />}
      </button>

      {/* Toolbar Buttons */}
      <div className='flex gap-2 border-x border-gray-700 px-4'>
        {tools.map((tool, index) => (
          <ToolbarButton
            key={index}
            icon={tool.icon}
            isSelected={selectedTool === tool.tool}
            onClick={() => handleToolSelect(tool.tool)}
            id={tool.id}
          />
        ))}
      </div>

      {/* Clear Button */}
      <button
        className='hover:bg-light_background flex h-9 w-9 cursor-pointer items-center justify-center rounded p-2'
        aria-label='Clear canvas'
      >
        <Trash size={16} className='text-red-500' />
      </button>
    </nav>
  );
};

export default Toolbar;
