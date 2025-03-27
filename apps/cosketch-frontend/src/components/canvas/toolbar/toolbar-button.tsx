import React from 'react';

const ToolbarButton = ({ icon: Icon }: { icon: React.ElementType }) => {
  return (
    <button className='hover:bg-light_background flex cursor-pointer items-center gap-2 rounded p-2'>
      <Icon size={20} />
    </button>
  );
};

export default ToolbarButton;
