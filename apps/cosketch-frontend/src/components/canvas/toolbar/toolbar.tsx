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
  Circle,
} from 'lucide-react';
import ToolbarButton from './toolbar-button';
import Tooltip from './tooltip';

const tools = [
  { icon: MousePointer, tool: 'Selection', id: 1, tooltip: 'Selection - 1' },
  { icon: Square, tool: 'Rectangle', id: 2, tooltip: 'Rectangle - 2' },
  { icon: Diamond, tool: 'Diamond', id: 3, tooltip: 'Diamond - 3' },
  { icon: Circle, tool: 'Circle', id: 4, tooltip: 'Circle - 4' },
  { icon: MoveRight, tool: 'Arrow', id: 5, tooltip: 'Arrow - 5' },
  { icon: Minus, tool: 'Line', id: 6, tooltip: 'Line - 6' },
  { icon: Pencil, tool: 'FreeDraw', id: 7, tooltip: 'Draw - 7' },
  { icon: Type, tool: 'Text', id: 8, tooltip: 'Text - 8' },
  { icon: Eraser, tool: 'Eraser', id: 9, tooltip: 'Eraser - 9' },
];

interface ToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, setSelectedTool }) => {
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = () => {
    setIsLocked(prev => !prev);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= '1' && key <= '9') {
        const tool = tools.find(t => t.id === Number(key));
        if (tool) {
          handleToolSelect(tool.tool);
        }
      }
    };

    const resetTool = () => {
      if (!isLocked) {
        setSelectedTool('Selection');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', resetTool);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', resetTool);
    };
  }, [isLocked]);

  return (
    <nav className='bg-background flex items-center justify-between gap-2 rounded-lg px-4 py-1 text-white shadow-md'>
      {/* Lock Toggle Button */}
      <div className='group relative'>
        <button
          onClick={toggleLock}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded ${
            isLocked ? 'bg-tool_select' : 'hover:bg-light_background'
          }`}
          aria-label='Toggle lock'
        >
          {isLocked ? <LockKeyhole size={16} /> : <LockKeyholeOpen size={16} />}
          {/* Tooltip */}
          <Tooltip tooltip={'Keep selected toom active after drawing'} />
        </button>
      </div>

      {/* Toolbar Buttons */}
      <div className='flex gap-2 border-x border-gray-700 px-4'>
        {tools.map((tool, index) => (
          <ToolbarButton
            key={index}
            id={tool.id}
            icon={tool.icon}
            tooltip={tool.tooltip}
            onClick={() => handleToolSelect(tool.tool)}
            isSelected={selectedTool === tool.tool}
          />
        ))}
      </div>

      {/* Clear Button */}
      <div className='group relative'>
        <button
          className='hover:bg-light_background flex h-9 w-9 cursor-pointer items-center justify-center rounded p-2'
          aria-label='Clear canvas'
        >
          <Trash size={16} className='text-red-500' />
        </button>
        {/* Tooltip */}
        <Tooltip tooltip={'Clear Canvas'} />
      </div>
    </nav>
  );
};

export default Toolbar;
