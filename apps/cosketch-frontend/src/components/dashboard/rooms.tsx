import React from 'react';
import RoomCard from './room-card';

const dummyRooms = [
  {
    roomId: 'abc123',
    slug: 'Design Discussion',
    createdAt: '2025-03-22',
    noOfParticipants: 5,
    participants: ['Alice', 'Bob', 'Charlie', 'David', 'Emma'], // Added participants
  },
  {
    roomId: 'def456',
    slug: 'Tech Talk',
    createdAt: '2025-03-21',
    noOfParticipants: 3,
    participants: ['Frank', 'Grace', 'Henry'],
  },
  {
    roomId: 'ghi789',
    slug: 'Project Planning',
    createdAt: '2025-03-20',
    noOfParticipants: 8,
    participants: [
      'Isaac',
      'Jack',
      'Kate',
      'Liam',
      'Mia',
      'Nathan',
      'Olivia',
      'Paul',
    ],
  },
];

const Rooms = () => {
  // const handleJoinRoom = (roomId: string) => {
  //   console.log(`Joining Room: ${roomId}`);
  //   // Add your logic for joining a room
  // };

  return (
    <section className='mx-auto mt-12 w-full max-w-7xl rounded-2xl border-2 border-gray-200 bg-white shadow-lg'>
      <h2 className='mb-6 border-b-2 border-gray-200 p-6 text-2xl font-bold text-gray-800'>
        Your Rooms
      </h2>
      <div className='mx-4 mt-6 mb-4 space-y-4'>
        {dummyRooms.map(room => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
    </section>
  );
};

export default Rooms;
