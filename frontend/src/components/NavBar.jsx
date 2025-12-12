import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_LINKS } from './NavData';
import {
    Bell,
    MessageSquare,
    Wallet,
    User,
    ChevronDown,
    LogOut,
    Settings,
    CreditCard,
    Home,
    ShoppingBag,
    ShieldAlert,
    LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col w-full z-50">

            {/* 1. TOP MAIN NAVBAR */}
            <nav className="bg-[#0b0c15] border-b border-gray-800 h-16 flex items-center justify-between px-6 select-none relative z-50">

                {/* LEFT: Logo & Links */}
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center justify-center w-8 h-8 bg-white rounded text-black font-bold text-lg hover:scale-105 transition-transform">
                        L
                    </Link>

                    <div className="hidden lg:flex items-center gap-6">

                        {/* HOME LINK */}
                        <Link
                            to="/dashboard"
                            className="text-gray-400 text-[13px] font-medium hover:text-white transition-colors flex items-center gap-1 py-2 hover:bg-white/5 px-3 rounded-lg"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>

                        {/* ADMIN BUTTON (Only Visible to Admins) */}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="text-red-400 text-[13px] font-bold hover:text-red-300 transition-colors flex items-center gap-1 py-2 bg-red-900/10 border border-red-900/30 px-3 rounded-lg hover:bg-red-900/20 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Admin Panel</span>
                            </Link>
                        )}

                        {/* DYNAMIC NAV LINKS */}
                        {NAV_LINKS.map((item) => (
                            <div key={item.name} className="group relative h-16 flex items-center">
                                <Link
                                    to={item.path}
                                    className="text-gray-400 text-[13px] font-medium hover:text-white transition-colors flex items-center gap-1 py-2"
                                >
                                    {item.name}
                                    {item.subItems.length > 0 && <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />}
                                </Link>

                                {/* MEGA MENU */}
                                {item.subItems.length > 0 && (
                                    <div className="absolute top-full left-0 w-64 bg-[#13151f] border border-gray-800 rounded-b-xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 ease-out transform origin-top-left overflow-hidden z-50">
                                        <div className="p-2">
                                            {item.subItems.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    to={`${item.path}?sub=${sub.id}`}
                                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group/item"
                                                >
                                                    <div className="p-2 bg-gray-800 rounded-md text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <sub.icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200">{sub.title}</p>
                                                        <p className="text-[10px] text-gray-500">{sub.count || 0} listings</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Stats & Actions */}
                <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center gap-2 bg-[#13151f] px-3 py-1.5 rounded-lg border border-gray-800 mr-2">
                        <span className="text-white font-mono font-medium">$ 0</span>
                        <Wallet className="w-4 h-4 text-purple-400" />
                    </div>

                    {/* SHOPPING BAG / DOWNLOADS */}
                    <Link to="/dashboard/downloads">
                        <button className="relative w-9 h-9 bg-[#1a1d26] hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-gray-400 transition-all">
                            <ShoppingBag className="w-4 h-4" />
                        </button>
                    </Link>

                    <button className="w-9 h-9 bg-[#6d28d9] hover:bg-[#5b21b6] rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-900/20 transition-all hover:scale-105 active:scale-95">
                        <MessageSquare className="w-4 h-4 fill-current" />
                    </button>

                    <button className="w-9 h-9 bg-[#1a1d26] hover:bg-[#252836] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                        <Bell className="w-4 h-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-800 mx-1"></div>

                    {/* USER PROFILE DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 bg-[#1a1d26] pl-3 pr-1 py-1 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
                        >
                            <span className="text-xs text-gray-300 font-medium max-w-[80px] truncate">{user?.name || 'Guest'}</span>
                            <div className="w-7 h-7 bg-[#252836] rounded flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                        </button>

                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsProfileOpen(false)}
                                ></div>

                                <div className="absolute right-0 top-full mt-2 w-56 bg-[#13151f] border border-gray-800 rounded-xl shadow-2xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-4 py-3 border-b border-gray-800">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Account</p>
                                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                        {user?.role === 'admin' && (
                                            <span className="mt-1 inline-block text-[10px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50">ADMIN ACCESS</span>
                                        )}
                                    </div>

                                    {/* ADMIN LINKS */}
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/10 transition-colors border-b border-gray-800">
                                            <LayoutDashboard className="w-4 h-4" /> Command Center
                                        </Link>
                                    )}

                                    {/* USER LINKS */}
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                                        <User className="w-4 h-4" /> Profile
                                    </Link>

                                    <Link to="/dashboard/downloads" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                                        <ShoppingBag className="w-4 h-4" /> My Orders
                                    </Link>

                                    <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </Link>

                                    <Link to="/dashboard/billing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                                        <CreditCard className="w-4 h-4" /> Billing
                                    </Link>

                                    <div className="border-t border-gray-800 mt-1">
                                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </nav>


        </div>
    );
};

export default Navbar;