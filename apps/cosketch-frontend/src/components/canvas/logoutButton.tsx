import { LogOut } from 'lucide-react';
import React from 'react';
import Tooltip from './toolbar/tooltip';

const LogoutButton = () => {
  return (
    <div className='group relative'>
      <button className='bg-background hover:bg-light_background flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 text-white transition'>
        <LogOut size={20} className='h-5 w-8 cursor-pointer' />
        <Tooltip tooltip='leave room' />
      </button>
    </div>
  );
};

export default LogoutButton;
