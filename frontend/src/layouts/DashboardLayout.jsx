import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- Import Auth to check role
import { Menu, X, Home, Box, Settings, LogOut, ShieldAlert, ShoppingBag, CreditCard, Terminal, BookOpen, Scale } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Helper to highlight active link
    const isActive = (path) => location.pathname === path;

    // Common styling for nav links
    const linkClass = (path) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
        ${isActive(path)
            ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }
    `;

    return (
        <div className="min-h-screen bg-[#0b0c15] text-white flex relative overflow-hidden">

            {/* --- 1. MOBILE TOP BAR (Visible only on small screens) --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#13151f]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-[100]">
                <span className="font-bold text-xl tracking-tight">Market<span className="text-blue-500">Place</span></span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* --- 2. SIDEBAR NAVIGATION --- */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-[90] w-64 bg-[#13151f] border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 
                    pt-20 md:pt-0 
                `}
            >
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Logo (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">Market<span className="text-blue-500">Place</span></span>
                    </div>

                    {/* --- MAIN MENU --- */}
                    <div className="space-y-6">

                        {/* 1. GENERAL */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">General</p>
                            <nav>
                                <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard')}>
                                    <Home className="w-5 h-5" /> Home
                                </Link>
                                <Link to="/dashboard/downloads" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/downloads')}>
                                    <ShoppingBag className="w-5 h-5" /> My Assets
                                </Link>
                            </nav>
                        </div>

                        {/* 2. MARKETPLACE CATEGORIES */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">Marketplace</p>
                            <nav>
                                <Link to="/dashboard/accounts" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/accounts')}>
                                    <Box className="w-5 h-5" /> Accounts / Logs
                                </Link>
                                <Link to="/dashboard/cards" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/cards')}>
                                    <CreditCard className="w-5 h-5" /> Cards & CC
                                </Link>
                                <Link to="/dashboard/tutorials" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/tutorials')}>
                                    <BookOpen className="w-5 h-5" /> Methods & Tuts
                                </Link>
                                <Link to="/dashboard/tools" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/tools')}>
                                    <Terminal className="w-5 h-5" /> Tools & Scripts
                                </Link>
                            </nav>
                        </div>

                        {/* 3. SUPPORT */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">Support</p>
                            <nav>
                                <Link to="/dashboard/rules" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/rules')}>
                                    <Scale className="w-5 h-5" /> Rules
                                </Link>
                                <Link to="/dashboard/faq" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/faq')}>
                                    <BookOpen className="w-5 h-5" /> FAQ & Help
                                </Link>
                            </nav>
                        </div>

                        {/* 4. ADMIN ONLY (Visible if Role is Admin) */}
                        {user?.role === 'admin' && (
                            <div>
                                <p className="text-xs font-bold text-red-500 uppercase mb-3 px-2">Administration</p>
                                <nav>
                                    <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-red-900/10 text-red-400 border border-red-900/20 rounded-xl font-bold hover:bg-red-900/20 transition-all">
                                        <ShieldAlert className="w-5 h-5" /> Admin Panel
                                    </Link>
                                </nav>
                            </div>
                        )}

                    </div>
                </div>

                {/* --- FOOTER: USER & LOGOUT --- */}
                <div className="p-4 border-t border-gray-800 bg-[#0f101a]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full py-2 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-colors font-medium text-sm border border-transparent hover:border-red-900/30"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>

                    <Link to="/dashboard/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 mt-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                </div>
            </aside>

            {/* --- 3. OVERLAY (Mobile Only) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- 4. MAIN CONTENT AREA --- */}
            <main className="flex-1 h-screen overflow-y-auto pt-20 md:pt-8 px-4 md:px-8 pb-8 relative z-10 scrollbar-hide">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;