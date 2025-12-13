import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, ChevronDown, Box, Home, ShoppingBag,
    CreditCard, Terminal, BookOpen, Scale, ShieldAlert,
    Settings, LogOut, User
} from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for Mobile Dropdowns (Desktop uses CSS hover)
    const [mobileDropdown, setMobileDropdown] = useState(null);

    const toggleMobileDropdown = (name) => {
        if (mobileDropdown === name) {
            setMobileDropdown(null);
        } else {
            setMobileDropdown(name);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0c15] text-white font-sans selection:bg-blue-500/30">

            {/* =================================================================================
                                          1. DESKTOP TOP NAVIGATION 
               ================================================================================= */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-[#13151f]/90 backdrop-blur-xl border-b border-gray-800 z-[100]">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

                    {/* A. LOGO */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                            <Box className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Market<span className="text-blue-500">Place</span></span>
                    </Link>

                    {/* B. DESKTOP LINKS (Hidden on Mobile) */}
                    <nav className="hidden md:flex items-center gap-1">

                        {/* 1. SIMPLE LINK */}
                        <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                        <NavLink to="/dashboard/downloads" icon={ShoppingBag}>My Assets</NavLink>

                        {/* 2. DROPDOWN: MARKETPLACE (Hover to Open) */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 font-medium hover:text-white transition-colors">
                                <Box className="w-4 h-4" /> Marketplace <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-[#1c1e2d] border border-gray-700 rounded-xl shadow-2xl overflow-hidden p-2">
                                    <DropdownItem to="/dashboard/accounts" icon={User} title="Accounts & Logs" desc="Verified login credentials" />
                                    <DropdownItem to="/dashboard/cards" icon={CreditCard} title="Cards & CC" desc="High balance cards" />
                                    <DropdownItem to="/dashboard/tutorials" icon={BookOpen} title="Methods & Tuts" desc="Latest guides" />
                                    <DropdownItem to="/dashboard/tools" icon={Terminal} title="Tools & Scripts" desc="Automation software" />
                                </div>
                            </div>
                        </div>

                        {/* 3. DROPDOWN: SUPPORT */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 font-medium hover:text-white transition-colors">
                                <Scale className="w-4 h-4" /> Support <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="absolute top-full left-0 w-56 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-[#1c1e2d] border border-gray-700 rounded-xl shadow-2xl overflow-hidden p-2">
                                    <DropdownItem to="/dashboard/rules" icon={Scale} title="Market Rules" />
                                    <DropdownItem to="/dashboard/faq" icon={BookOpen} title="FAQ & Help" />
                                </div>
                            </div>
                        </div>

                        {/* 4. ADMIN (Conditional) */}
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" icon={ShieldAlert} className="text-red-400 hover:text-red-300">Admin</NavLink>
                        )}
                    </nav>

                    {/* C. USER ACTIONS (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-800">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{user?.email}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-[#13151f] flex items-center justify-center">
                                    <span className="font-bold text-blue-500">{user?.name?.charAt(0)}</span>
                                </div>
                            </button>

                            {/* User Dropdown */}
                            <div className="absolute top-full right-0 w-48 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-[#1c1e2d] border border-gray-700 rounded-xl shadow-xl overflow-hidden p-1">
                                    <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
                                        <Settings className="w-4 h-4" /> Settings
                                    </Link>
                                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* D. MOBILE TOGGLE BUTTON */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* =================================================================================
                                          2. MOBILE MENU (Drawer) 
               ================================================================================= */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 bg-[#0b0c15] z-[99] overflow-y-auto md:hidden animate-fade-in p-4">
                    <div className="space-y-2">
                        <MobileLink to="/dashboard" icon={Home} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileLink>
                        <MobileLink to="/dashboard/downloads" icon={ShoppingBag} onClick={() => setIsMobileMenuOpen(false)}>My Assets</MobileLink>

                        {/* Mobile Dropdown 1 */}
                        <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#13151f]">
                            <button
                                onClick={() => toggleMobileDropdown('market')}
                                className="w-full flex items-center justify-between p-4 text-gray-300 font-bold"
                            >
                                <span className="flex items-center gap-3"><Box className="w-5 h-5 text-blue-500" /> Marketplace</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'market' ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileDropdown === 'market' && (
                                <div className="bg-[#0f101a] p-2 space-y-1 border-t border-gray-800">
                                    <MobileSubLink to="/dashboard/accounts">Accounts & Logs</MobileSubLink>
                                    <MobileSubLink to="/dashboard/cards">Cards & CC</MobileSubLink>
                                    <MobileSubLink to="/dashboard/tutorials">Methods & Tuts</MobileSubLink>
                                    <MobileSubLink to="/dashboard/tools">Tools & Scripts</MobileSubLink>
                                </div>
                            )}
                        </div>

                        {/* Mobile Dropdown 2 */}
                        <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#13151f]">
                            <button
                                onClick={() => toggleMobileDropdown('support')}
                                className="w-full flex items-center justify-between p-4 text-gray-300 font-bold"
                            >
                                <span className="flex items-center gap-3"><Scale className="w-5 h-5 text-blue-500" /> Support</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'support' ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileDropdown === 'support' && (
                                <div className="bg-[#0f101a] p-2 space-y-1 border-t border-gray-800">
                                    <MobileSubLink to="/dashboard/rules">Market Rules</MobileSubLink>
                                    <MobileSubLink to="/dashboard/faq">FAQ & Help</MobileSubLink>
                                </div>
                            )}
                        </div>

                        {user?.role === 'admin' && (
                            <MobileLink to="/admin" icon={ShieldAlert} className="text-red-400 bg-red-900/10 border-red-900/20" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</MobileLink>
                        )}

                        <div className="pt-6 border-t border-gray-800 mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{user?.name}</p>
                                    <p className="text-gray-500 text-xs">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 text-white font-bold"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================================================
                                          3. MAIN CONTENT 
               ================================================================================= */}
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full z-10">
                <Outlet />
            </main>

        </div>
    );
};

// --- SUB COMPONENTS FOR CLEANER CODE ---

const NavLink = ({ to, icon: Icon, children, className = "" }) => (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 text-gray-400 font-medium hover:text-white hover:bg-white/5 rounded-lg transition-all ${className}`}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
    </Link>
);

const DropdownItem = ({ to, icon: Icon, title, desc }) => (
    <Link to={to} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group/item">
        <div className="mt-1 p-1.5 rounded bg-blue-500/10 text-blue-400 group-hover/item:text-blue-300 group-hover/item:bg-blue-500/20">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-sm font-bold text-gray-200 group-hover/item:text-white">{title}</p>
            {desc && <p className="text-[10px] text-gray-500">{desc}</p>}
        </div>
    </Link>
);

const MobileLink = ({ to, icon: Icon, children, onClick, className = "" }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-4 bg-[#13151f] rounded-xl border border-gray-800 text-gray-300 font-bold active:scale-95 transition-transform ${className}`}
    >
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
        {children}
    </Link>
);

const MobileSubLink = ({ to, children }) => (
    <Link to={to} className="block w-full p-3 pl-11 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium">
        {children}
    </Link>
);

export default DashboardLayout;