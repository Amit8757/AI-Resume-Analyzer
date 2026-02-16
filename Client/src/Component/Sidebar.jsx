import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, History, MessageSquare, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
    { icon: Sparkles, label: "ATS Optimizer", path: "/app/optimizer/select" },
    { icon: History, label: "History", path: "/app/history" },
    { icon: MessageSquare, label: "Mock Interview", path: "/app/interview" },
  ];

  const handleLogout = () => {
    console.log('[Sidebar] User initiated logout');
    logout();
    console.log('[Sidebar] Navigating to /login');
    navigate('/login');
  };

  return (
    <div className="h-screen w-20 md:w-64 bg-[#1E293B] text-white flex flex-col py-6 sticky top-0 overflow-y-auto transition-all duration-300">

      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 mb-10">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">
          📄
        </div>
        <span className="font-bold text-lg hidden md:block">AI Analyzer</span>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
            <span className="font-medium hidden md:block">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Bottom User Profile */}
      <div className="mt-auto px-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 mb-3"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium hidden md:block">Logout</span>
        </button>

        <div className="pt-3 border-t border-slate-700 hidden md:block">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
