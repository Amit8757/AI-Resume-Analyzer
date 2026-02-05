import Sidebar from "../Component/Sidebar";
import MobileNav from "../Component/MobileNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-[#F1F5F9] min-h-screen relative">

      {/* Sidebar hidden on mobile, visible from md up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Page Content */}
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </div>

      {/* Mobile Nav visible only on small screens */}
      <MobileNav />
    </div>
  );
};

export default Layout;
