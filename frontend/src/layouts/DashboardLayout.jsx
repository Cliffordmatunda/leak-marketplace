import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Home, Box, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            {/* Logic: Fixed on mobile (slide in), Static on Desktop */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-[90] w-64 bg-[#13151f] border-r border-gray-800 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 
                    pt-20 md:pt-0 
                `}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Logo (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">Market<span className="text-blue-500">Place</span></span>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-2 flex-1">
                        <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-600/20 font-medium">
                            <Home className="w-5 h-5" /> Dashboard
                        </Link>

                        <Link to="/dashboard/downloads" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors font-medium">
                            <Box className="w-5 h-5" /> My Assets
                        </Link>

                        <Link to="/dashboard/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors font-medium">
                            <Settings className="w-5 h-5" /> Settings
                        </Link>
                    </nav>

                    {/* Logout */}
                    <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors font-medium mt-auto">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* --- 3. OVERLAY (Mobile Only - closes sidebar when clicked) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- 4. MAIN CONTENT AREA --- */}
            <main className="flex-1 h-screen overflow-y-auto pt-20 md:pt-8 px-4 md:px-8 pb-8 relative z-10">
                {/* This is where your DashboardPage, DownloadsPage, etc. will render */}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;