import DashboardBody from '@/components/dashboard/dashboard-body';
import DashboardHeader from '@/components/dashboard/header';
import ProtectRoute from '@/higher-order-component/protectRoute';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.',
};

const DashboardPage = () => {
  return (
    <ProtectRoute>
      <main>
        <DashboardHeader />
        <DashboardBody />
      </main>
    </ProtectRoute>
  );
};

export default DashboardPage;
