'use client';

import { Plus, Users } from 'lucide-react';
import React, { useState } from 'react';
import CreateRoomDialogBox from '@/components/dialogbox/create-room-dialogbox';
import JoinRoomDialogBox from '@/components/dialogbox/join-room-dialogBox';
import RoomCard from './room-card';

const Actions = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  return (
    <section className='mx-auto mt-28 flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row'>
      {/* Create New Room Card */}
      <RoomCard
        title='Create New Room'
        description='Start a new collaborative drawing session'
        icon={<Plus className='h-8 w-8 text-red-500' />}
        onClick={() => setCreateRoom(true)}
      />

      {/* Join Existing Room Card */}
      <RoomCard
        title='Join Existing Room'
        description='Enter a room code to collaborate'
        icon={<Users className='h-8 w-8 text-green-600' />}
        onClick={() => setJoinRoom(true)}
      />

      {createRoom && <CreateRoomDialogBox onClose={setCreateRoom} />}
      {joinRoom && <JoinRoomDialogBox onClose={setJoinRoom} />}
    </section>
  );
};

export default Actions;
