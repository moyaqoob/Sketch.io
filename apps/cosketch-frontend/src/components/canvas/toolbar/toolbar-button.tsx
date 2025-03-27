import React from 'react';

interface ToolbarButtonProps {
  icon: React.ElementType;
  isSelected?: boolean;
  onClick?: () => void;
  id: number;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  isSelected,
  onClick,
  id,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition ${
        isSelected ? 'bg-tool_select' : 'hover:bg-light_background'
      }`}
    >
      <Icon size={16} className='text-white' />
      <span className='absolute right-1 bottom-0 text-[9px] text-gray-400 opacity-80'>
        {id}
      </span>
    </button>
  );
};

export default ToolbarButton;
