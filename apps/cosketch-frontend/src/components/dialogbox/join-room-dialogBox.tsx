'use client';

import React, { useState } from 'react';
import { Input } from '../forms/input';

interface JoinRoomDialogBoxProps {
  onClose: (e: boolean) => void;
}

const JoinRoomDialogBox = ({ onClose }: JoinRoomDialogBoxProps) => {
  const [roomId, setRoomId] = useState('');

  return (
    <section
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md'
      onClick={() => onClose(false)} // Close when clicking outside
    >
      <div
        className='w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg'
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className='text-secondary mb-2 text-2xl font-semibold'>
          Join New Room
        </h2>

        {/* Input Field */}
        <Input
          placeholder='Enter Room Id'
          title='Enter Room Id'
          type='text'
          required={true}
          value={roomId}
          onChange={e => {
            setRoomId(e.target.value);
          }}
        />

        {/* Action Buttons */}
        <div className='mt-6 flex justify-end gap-2 font-bold'>
          <button
            className='rounded-lg border px-4 py-2 text-gray-600 transition hover:bg-gray-100'
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button className='bg-primary-darker hover:bg-primary-chubb rounded-lg px-4 py-2 text-white transition'>
            Join Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinRoomDialogBox;
