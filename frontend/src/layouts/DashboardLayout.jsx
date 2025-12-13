import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, Box, Settings, LogOut, ShieldAlert, ShoppingBag, CreditCard, Terminal, BookOpen, Scale } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile toggle only
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // --- NAV ITEM COMPONENT (Handles Hover Logic Internally) ---
    const NavItem = ({ to, icon: Icon, label, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden whitespace-nowrap
                ${isActive(to)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#1c1e2d]'
                }
            `}
        >
            {/* Icon is always visible */}
            <div className="min-w-[20px] flex justify-center">
                <Icon className={`w-6 h-6 ${isActive(to) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            </div>

            {/* Text: Hidden initially on Desktop, Visible on Hover. Always visible on Mobile. */}
            <span className={`
                font-medium transition-all duration-300 opacity-0 translate-x-[-10px]
                md:group-hover:opacity-100 md:group-hover:translate-x-0
                md:opacity-0 
                block opacity-100 translate-x-0 text-sm tracking-wide
            `}>
                {label}
            </span>

            {/* Active Indicator Line (Desktop Hover Effect) */}
            {isActive(to) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full md:block hidden" />
            )}
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#0b0c15] text-white flex relative">

            {/* =========================================================
               1. MOBILE TOP BAR (Visible ONLY on Phone)
               ========================================================= */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#13151f]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-[100]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">Market<span className="text-blue-500">Place</span></span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg active:scale-95 transition-transform"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* =========================================================
               2. SIDEBAR (Desktop Hover & Mobile Slide)
               ========================================================= */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[90] bg-[#13151f] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out
                    
                    /* DESKTOP STYLES: Width 80px -> Hover Width 260px */
                    md:static md:w-[80px] md:hover:w-[260px] md:translate-x-0 group

                    /* MOBILE STYLES: Full width or Slide out */
                    ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]'}
                    
                    pt-20 md:pt-0 
                `}
            >
                {/* Logo Area (Desktop Only - Hidden on Mobile Top Bar) */}
                <div className="hidden md:flex items-center gap-4 h-20 px-6 border-b border-gray-800/50">
                    <div className="min-w-[32px]">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    {/* Text reveals on hover */}
                    <span className="font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                        Market<span className="text-blue-500">Place</span>
                    </span>
                </div>

                {/* --- NAVIGATION LINKS --- */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">

                    <NavItem to="/dashboard" icon={Home} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/dashboard/downloads" icon={ShoppingBag} label="My Assets" onClick={() => setIsMobileMenuOpen(false)} />

                    <div className="my-4 border-t border-gray-800/50 mx-2" />

                    {/* Categories */}
                    <NavItem to="/dashboard/accounts" icon={Box} label="Logs & Accounts" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/dashboard/cards" icon={CreditCard} label="Cards & CC" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/dashboard/tutorials" icon={BookOpen} label="Methods" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/dashboard/tools" icon={Terminal} label="Tools" onClick={() => setIsMobileMenuOpen(false)} />

                    <div className="my-4 border-t border-gray-800/50 mx-2" />

                    <NavItem to="/dashboard/rules" icon={Scale} label="Market Rules" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/dashboard/faq" icon={BookOpen} label="FAQ & Help" onClick={() => setIsMobileMenuOpen(false)} />

                    {user?.role === 'admin' && (
                        <>
                            <div className="my-4 border-t border-red-900/30 mx-2" />
                            <NavItem to="/admin" icon={ShieldAlert} label="Admin Panel" onClick={() => setIsMobileMenuOpen(false)} />
                        </>
                    )}
                </div>

                {/* --- USER PROFILE (Bottom) --- */}
                <div className="p-3 border-t border-gray-800 bg-[#0f101a] overflow-hidden">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer group/user">
                        <div className="min-w-[32px]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-[#0b0c15]">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                        <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Link to="/dashboard/settings"
                            className="flex-1 flex justify-center items-center py-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-all"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={logout}
                            className="flex-1 flex justify-center items-center py-2 rounded-lg hover:bg-red-900/20 text-gray-500 hover:text-red-400 transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- 3. OVERLAY (Mobile Only - Closes menu when clicked) --- */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* =========================================================
               4. MAIN CONTENT AREA
               ========================================================= */}
            <main className="flex-1 h-screen overflow-y-auto bg-[#0b0c15] relative z-10 scrollbar-hide">
                {/* Padding Top is large on mobile for TopBar, small on desktop */}
                <div className="pt-20 pb-10 px-4 md:pt-8 md:px-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;