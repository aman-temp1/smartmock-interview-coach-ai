
import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import { useState } from "react";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className="flex-1 p-0 transition-all duration-300 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
