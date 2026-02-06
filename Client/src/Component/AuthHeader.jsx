import { Link } from 'react-router-dom';

const AuthHeader = () => {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white">
                            📄
                        </div>
                        <span className="font-bold text-xl text-slate-800">AI Resume Analyzer</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
