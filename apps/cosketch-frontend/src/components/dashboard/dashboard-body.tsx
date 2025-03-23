import React from 'react';
import Actions from './actions';
import Rooms from './rooms';

export interface Room {
  slug: string;
  roomId: string;
  createdAt: string;
  participants: string[];
  noOfParticipants: number;
}

const DashboardBody = () => {
  return (
    <section className='mx-auto max-w-7xl px-6'>
      <Actions />
      <Rooms />
    </section>
  );
};

export default DashboardBody;
