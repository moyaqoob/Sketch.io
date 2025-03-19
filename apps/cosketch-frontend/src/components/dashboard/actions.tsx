'use client';

import { Plus, Users } from 'lucide-react';
import React, { useState } from 'react';
import CreateRoomDialogBox from '@/components/dialogbox/create-room-dialogbox';
import JoinRoomDialogBox from '../dialogbox/join-room-dialogBox';

const Actions = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  return (
    <section className='mx-auto mt-28 flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row'>
      {/* Create New Room Card */}
      <div
        className='flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:bg-gray-50 hover:shadow-xl'
        onClick={() => {
          setCreateRoom(true);
        }}
        aria-label='Create Room'
      >
        <span className='w-fit rounded-xl bg-gray-200 p-3'>
          <Plus className='h-8 w-8 text-red-500' />
        </span>
        <div className='text-start'>
          <h1 className='text-xl font-semibold text-gray-800'>
            Create New Room
          </h1>
          <p className='mt-1 text-gray-600'>
            Start a new collaborative drawing session
          </p>
        </div>
      </div>

      {/* Join Existing Room Card */}
      <div
        className='flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:bg-gray-50 hover:shadow-xl'
        onClick={() => {
          setJoinRoom(true);
        }}
        aria-label='Join Room'
      >
        <span className='w-fit rounded-xl bg-gray-200 p-3'>
          <Users className='h-8 w-8 text-green-600' />
        </span>
        <div className='text-start'>
          <h1 className='text-xl font-semibold text-gray-800'>
            Join Existing Room
          </h1>
          <p className='mt-1 text-gray-600'>Enter a room code to collaborate</p>
        </div>
      </div>
      {createRoom && <CreateRoomDialogBox onClose={setCreateRoom} />}
      {joinRoom && <JoinRoomDialogBox onClose={setJoinRoom} />}
    </section>
  );
};

export default Actions;
