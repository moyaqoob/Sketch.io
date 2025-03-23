import DashboardBody from '@/components/dashboard/dashboard-body';
import DashboardHeader from '@/components/dashboard/header';

import ProtectRoute from '@/higher-order-component/protectRoute';
import React from 'react';

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
