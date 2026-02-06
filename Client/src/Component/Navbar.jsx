import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white/70 backdrop-blur-lg fixed w-full top-0 z-50 border-b border-white/50 shadow-sm transition-all duration-300">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg shadow-blue-200 shadow-lg group-hover:scale-105 transition-transform">
           🤖
        </div>
        <h1 className="font-bold text-xl text-slate-800 tracking-tight">
          AI Resume Analyzer
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 text-slate-600 font-medium items-center text-sm">

        {/* Features Dropdown */}
        <div className="relative group" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Features <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu - Show on hover for desktop usually, but click is fine too. Let's keep click for now but allow hover group logic if we wanted. */}
          {open && (
            <div className="absolute top-12 left-0 bg-white shadow-xl rounded-xl w-64 border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-2">
                <Link 
                  to="/app" 
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                  onClick={() => setOpen(false)}
                >
                  <p className="font-medium text-slate-900 group-hover/item:text-blue-700">ATS Resume Scoring</p>
                  <p className="text-xs text-slate-400">Check compatibility with ATS systems</p>
                </Link>

                <Link 
                  to="/app" 
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                  onClick={() => setOpen(false)}
                >
                  <p className="font-medium text-slate-900 group-hover/item:text-blue-700">Job Match Analysis</p>
                  <p className="text-xs text-slate-400">See how well you fit the job</p>
                </Link>

                <Link 
                  to="/app/mock"
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                  onClick={() => setOpen(false)}
                >
                  <p className="font-medium text-slate-900 group-hover/item:text-blue-700">AI Mock Interview</p>
                  <p className="text-xs text-slate-400">Practice with custom questions</p>
                </Link>
               </div>
            </div>
          )}

        </div>

        <a href="#how" className="hover:text-blue-600 transition-colors">
          How it Works
        </a>

        <a href="#pricing" className="hover:text-blue-600 transition-colors">
          Pricing
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-4 items-center">
        <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
          Log In
        </Link>
        <Link to="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
