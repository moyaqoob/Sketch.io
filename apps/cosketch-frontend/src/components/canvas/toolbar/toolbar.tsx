'use client';
/* eslint-disable react-hooks/exhaustive-deps */

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
import { useToolStore } from '@/stores/tool.store';
import ConfirmationDialog from '@/components/dialogbox/confirmation-dialog';
import { CanvasMessage } from '@/hooks/useSocket';
import { useCanvasEngineStore } from '@/stores/canvas.store';

const tools: { icon: LucideIcon; tool: Tool; id: number; tooltip: string }[] = [
  { icon: MousePointer, tool: 'Selection', id: 1, tooltip: 'Selection - 1' },
  { icon: Square, tool: 'Rectangle', id: 2, tooltip: 'Rectangle - 2' },
  { icon: Diamond, tool: 'Diamond', id: 3, tooltip: 'Diamond - 3' },
  { icon: Circle, tool: 'Ellipse', id: 4, tooltip: 'Ellipse - 4' },
  { icon: MoveRight, tool: 'Arrow', id: 5, tooltip: 'Arrow - 5' },
  { icon: Minus, tool: 'Line', id: 6, tooltip: 'Line - 6' },
  { icon: Pencil, tool: 'Freehand', id: 7, tooltip: 'Draw - 7' },
  { icon: Type, tool: 'Text', id: 8, tooltip: 'Text - 8' },
  { icon: Eraser, tool: 'Eraser', id: 9, tooltip: 'Eraser - 9' },
];

interface ToolbarProps {
  roomId: string;
  sendMessage: (message: CanvasMessage) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ sendMessage, roomId }) => {
  const [isLocked, setIsLocked] = useState(false);
  const { selectedTool, setSelectedTool } = useToolStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { canvasEngine } = useCanvasEngineStore();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const confirmClear = () => {
    sendMessage({ type: 'canvas:clear', room: roomId });
    canvasEngine?.cleanCanvas();
    setIsDialogOpen(false);
  };

  const cancelClear = () => {
    setIsDialogOpen(false);
  };

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
        if (tool && tool.tool !== selectedTool) {
          handleToolSelect(tool.tool);
        }
      }
    };

    const resetTool = () => {
      if (
        !isLocked &&
        selectedTool !== 'Freehand' &&
        selectedTool !== 'Eraser' &&
        selectedTool !== 'Selection'
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
  }, [isLocked, selectedTool, handleToolSelect]);

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
          {isLocked ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />}
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
          onClick={handleClick}
        >
          <Trash size={18} className='text-red-500' />
        </button>
        <Tooltip tooltip={'Clear Canvas'} />
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title='Clear Canvas'
        message='Are you sure you want to clear the canvas? This action cannot be undone.'
        confirmText='Clear'
        cancelText='Cancel'
        onConfirm={confirmClear}
        onCancel={cancelClear}
      />
    </nav>
  );
};

export default Toolbar;
