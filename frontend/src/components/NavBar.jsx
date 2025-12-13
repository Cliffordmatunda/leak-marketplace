import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Bell, MessageSquare, Menu, User, Wallet, ChevronDown,
    CreditCard, LayoutGrid, Database, Globe, LogOut, ShieldCheck
} from 'lucide-react';
import RulesPage from '../pages/RulesPage';

const Navbar = ({ onOpenMobileMenu }) => {
    const { user, logout } = useAuth(); // <--- Get logout function
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- NAVIGATION DATA ---
    const NAV_ITEMS = [
        {
            label: 'Bank accounts',
            path: '/dashboard',
            subItems: [
                { label: 'Bank Designation', path: '/dashboard?minPrice=100' },
                { label: 'Available Bank Logs', path: '/dashboard?maxPrice=50' }
            ]
        },
        {
            label: 'Accounts',
            path: '/dashboard/accounts',
            subItems: [
                { label: 'Social Media', path: '/dashboard/accounts?cat=social' },
                { label: 'Streaming', path: '/dashboard/accounts?cat=streaming' },
                { label: 'VPN & Security', path: '/dashboard/accounts?cat=vpn' },
                { label: 'Gaming', path: '/dashboard/accounts?cat=gaming' },
                { label: 'VCC', path: '/dashboard/full-info?country=uk' },
                { label: 'Emails', path: '/dashboard/full-info?country=uk' }
            ]
        },
        {
            label: 'FullZ',
            path: '/dashboard/full-info',
            subItems: [
                {
                    label: 'USA Profiles', path: '/dashboard/full-info?country=usa',
                    subItems: [
                        { label: 'california', path: '/dashboard/full-info?country=uk' },
                        { label: 'New york', path: '/dashboard/full-info?country=uk' }
                    ]
                },
                { label: 'UK Profiles', path: '/dashboard/full-info?country=uk' },
                { label: 'Canada Profiles', path: '/dashboard/full-info?country=ca' }
            ]
        },
        { label: 'Enroll', path: '/dashboard/enroll', subItems: [] },
        {
            label: 'Lookup Services',
            path: '/dashboard/lookup',
            subItems: [
                { label: 'SSN Lookup', path: '/dashboard/lookup/ssn' },
                { label: 'Bin Checker', path: '/dashboard/lookup/bin' },
                { label: 'Background Check', path: '/dashboard/lookup/bg' }
            ]
        },
        {
            label: 'Cards', path: 'frontend\src\pages\RulesPage.jsx',
            subItems: [
                { label: 'VBV cards', path: '/dashboard/lookup/ssn' },
                { label: 'NON VBV CARDS', path: '/dashboard/lookup/ssn' },
                { label: 'BINS', path: '/dashboard/lookup/ssn' },

            ]
        },
        { label: 'Rules', path: 'frontend\src\pages\RulesPage.jsx', subItems: [] }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#06070a] border-b border-gray-800 z-50 flex items-center justify-between px-4 lg:px-8 select-none">

            {/* --- LEFT: LOGO & NAV --- */}
            <div className="flex items-center gap-8 h-full">
                <Link to="/dashboard" className="flex items-center justify-center w-8 h-8 bg-white rounded text-black font-extrabold text-xl font-sans hover:scale-105 transition-transform">
                    L
                </Link>

                <nav className="hidden lg:flex items-center gap-1 h-full">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className="relative group h-full flex items-center">
                            <Link to={item.path} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                                {item.label}
                                {item.subItems.length > 0 && <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />}
                            </Link>
                            {item.subItems.length > 0 && (
                                <div className="absolute top-[calc(100%-0.5rem)] left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="bg-[#13151f] border border-gray-700 rounded-xl shadow-2xl overflow-hidden p-1.5 flex flex-col gap-0.5">
                                        <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#13151f] border-t border-l border-gray-700 rotate-45"></div>
                                        {item.subItems.map((sub) => (
                                            <Link key={sub.label} to={sub.path} className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative z-10">
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* --- RIGHT: ACTIONS --- */}
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-transparent px-2">
                    <span className="text-white font-bold text-sm">$ 0</span>
                    <Wallet className="w-4 h-4 text-purple-500" />
                </div>
                <div className="h-6 w-px bg-gray-800 hidden md:block mx-1"></div>

                {/* ✅ ADMIN PANEL BUTTON (Only visible if role === 'admin') */}
                {user?.role === 'admin' && (
                    <Link
                        to="/dashboard/admin"
                        className="hidden md:flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-purple-900/20"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Admin Panel</span>
                    </Link>
                )}

                <button className="w-9 h-9 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-900/20 transition-all">
                    <MessageSquare className="w-4 h-4 fill-current" />
                </button>

                <button className="w-9 h-9 rounded-lg bg-[#1a1d26] hover:bg-[#252836] flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <Bell className="w-4 h-4" />
                </button>

                <Link to="/dashboard/settings" className="hidden md:flex items-center gap-2 bg-[#1a1d26] px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                    <span className="text-sm text-gray-200 font-medium max-w-[80px] truncate">{user?.name || 'User'}</span>
                    <User className="w-4 h-4 text-gray-500" />
                </Link>

                {/* ✅ LOGOUT BUTTON (Visible on Desktop) */}
                <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="hidden md:flex w-9 h-9 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 items-center justify-center text-red-400 hover:text-red-300 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                </button>

                <button onClick={onOpenMobileMenu} className="lg:hidden p-2 text-gray-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;