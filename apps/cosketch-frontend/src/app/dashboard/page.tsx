import Actions from '@/components/dashboard/actions';
import DashboardHeader from '@/components/dashboard/header';
import ProtectRoute from '@/higher-order-component/protectRoute';
import React from 'react';

const DashboardPage = () => {
  return (
    <ProtectRoute>
      <main>
        <DashboardHeader />
        <Actions />
      </main>
    </ProtectRoute>
  );
};

export default DashboardPage;
