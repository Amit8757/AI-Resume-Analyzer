import Sidebar from "../Component/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-[#F1F5F9] min-h-screen">
      
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
