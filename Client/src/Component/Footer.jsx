import { Twitter, Linkedin, Github, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Left Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="text-lg">🤖</span>
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            AI Resume Analyzer
          </span>
        </div>

        {/* Center Links */}
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
        </div>

        {/* Right Social Icons */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all cursor-pointer">
            <Twitter className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-700 hover:border-blue-700 transition-all cursor-pointer">
            <Linkedin className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
            <Github className="w-5 h-5" />
          </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-8 py-6 border-t border-slate-200 text-center md:text-left text-sm text-slate-400 flex flex-col md:flex-row justify-between">
        <p>© {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-slate-600">Terms of Service</a>
          <a href="#" className="hover:text-slate-600">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
