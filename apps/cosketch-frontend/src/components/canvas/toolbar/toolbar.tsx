'use client';

import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
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
import { Tool } from '@/type/tool';

const tools: { icon: LucideIcon; tool: Tool; id: number; tooltip: string }[] = [
  { icon: MousePointer, tool: 'Selection', id: 1, tooltip: 'Selection - 1' },
  { icon: Square, tool: 'Rectangle', id: 2, tooltip: 'Rectangle - 2' },
  { icon: Diamond, tool: 'Diamond', id: 3, tooltip: 'Diamond - 3' },
  { icon: Circle, tool: 'Ellipse', id: 4, tooltip: 'Ellipse - 4' },
  { icon: MoveRight, tool: 'Arrow', id: 5, tooltip: 'Arrow - 5' },
  { icon: Minus, tool: 'Line', id: 6, tooltip: 'Line - 6' },
  { icon: Pencil, tool: 'FreeDraw', id: 7, tooltip: 'Draw - 7' },
  { icon: Type, tool: 'Text', id: 8, tooltip: 'Text - 8' },
  { icon: Eraser, tool: 'Eraser', id: 9, tooltip: 'Eraser - 9' },
];

export interface ToolbarProps {
  selectedTool: Tool;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, setSelectedTool }) => {
  const [isLocked, setIsLocked] = useState(false);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const toggleLock = () => {
    setIsLocked(prev => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= '1' && key <= '9') {
        const tool = tools.find(tool => tool.id === Number(key));
        if (tool) {
          handleToolSelect(tool.tool);
        }
      }
    };

    const resetTool = () => {
      if (
        !isLocked &&
        selectedTool !== 'FreeDraw' &&
        selectedTool !== 'Eraser'
      ) {
        setSelectedTool('Selection');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', resetTool);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', resetTool);
    };
  }, [isLocked, selectedTool]);

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
          {isLocked ? <LockKeyhole size={20} /> : <LockKeyholeOpen size={20} />}
          <Tooltip tooltip={'Keep selected tool active after drawing'} />
        </button>
      </div>

      {/* Toolbar Buttons */}
      <div className='flex gap-2 border-x border-gray-700 px-4'>
        {tools.map(tool => (
          <ToolbarButton
            key={tool.id}
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
          <Trash size={20} className='text-red-500' />
        </button>
        <Tooltip tooltip={'Clear Canvas'} />
      </div>
    </nav>
  );
};

export default Toolbar;
