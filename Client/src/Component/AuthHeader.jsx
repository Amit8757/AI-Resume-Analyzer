import { Link } from 'react-router-dom';

const AuthHeader = () => {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
                            📄
                        </div>
                        <span className="font-bold text-lg md:text-xl text-slate-800 truncate max-w-[150px] sm:max-w-none">
                            AI Analyzer
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Button - Minimal version for Auth pages */}
                    <div className="md:hidden">
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AuthHeader;
