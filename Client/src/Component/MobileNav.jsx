import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, MessageSquare, LogOut, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MobileNav = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: LayoutDashboard, label: "App", path: "/app" },
        { icon: History, label: "History", path: "/app/history" },
        { icon: MessageSquare, label: "Mock", path: "/app/interview" },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive(item.path)
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            ))}

            <button
                onClick={logout}
                className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-red-600 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-medium">Logout</span>
            </button>
        </nav>
    );
};

export default MobileNav;
