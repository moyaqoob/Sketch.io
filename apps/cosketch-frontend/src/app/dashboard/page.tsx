import Actions from "@/components/dashboard/actions";
import DashboardHeader from "@/components/dashboard/header";
import React from "react";

const DashboardPage = () => {
  return (
    <main>
      <DashboardHeader />
      <Actions />
    </main>
  );
};

export default DashboardPage;
