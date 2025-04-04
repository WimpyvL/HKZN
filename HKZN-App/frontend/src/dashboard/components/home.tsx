import React from "react";
import Sidebar from "./dashboard/Sidebar";
import MetricsGrid from "./dashboard/MetricsGrid";
import AgentsTable from "./dashboard/AgentsTable";
import AnalyticsSection from "./dashboard/AnalyticsSection";
import SalesReport from "./dashboard/SalesReport";
import CommissionPayouts from "./dashboard/CommissionPayouts";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <MetricsGrid />

          <div className="grid grid-cols-1 gap-6">
            <AgentsTable />
            <SalesReport />
            <CommissionPayouts />
            <AnalyticsSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
