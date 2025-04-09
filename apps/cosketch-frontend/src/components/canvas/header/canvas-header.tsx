import React from 'react';
import ShareButton from '../share-button';
import LogoutButton from '../logoutButton';
import Toolbar from '../toolbar/toolbar';

interface HeaderProps {
  roomId: string;
}

const CanvasHeader = ({ roomId }: HeaderProps) => {
  return (
    <header className='fixed top-0 left-0 z-0 flex w-full items-center justify-between bg-transparent px-15 pt-6 lg:px-20'>
      <LogoutButton />
      <Toolbar />
      <ShareButton roomId={roomId} />
    </header>
  );
};

export default CanvasHeader;
