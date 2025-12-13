import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import {
    X, ChevronRight, MessageSquare, Bell, LogOut, ShieldCheck, // <--- Added ShieldCheck
    Home, CreditCard, User, FileText, Search, Scale, HelpCircle
} from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
        navigate('/login');
    };

    const MobileMenuItem = ({ to, icon: Icon, label, hasArrow = true, className = "" }) => (
        <Link
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors group border-b border-gray-800/50 last:border-0 ${className}`}
        >
            <div className="flex items-center gap-4">
                {Icon && <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />}
                <span className="text-gray-300 font-medium text-lg">{label}</span>
            </div>
            {hasArrow && <ChevronRight className="w-5 h-5 text-gray-600" />}
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#06070a] text-white font-sans">

            <Navbar onOpenMobileMenu={toggleMobileMenu} />

            {/* MOBILE DRAWER */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu} />

                    <div className="relative w-full max-w-xs h-full bg-[#0b0c15] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">

                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded text-black font-extrabold text-xl">L</div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-white bg-[#1a1d26] rounded-lg">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <button onClick={toggleMobileMenu} className="p-2 text-gray-400 hover:text-white bg-[#1a1d26] rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {/* ✅ ADMIN LINK (Mobile Only) */}
                            {user?.role === 'admin' && (
                                <MobileMenuItem
                                    to="/dashboard/admin"
                                    icon={ShieldCheck}
                                    label="Admin Panel"
                                    className="bg-purple-900/10 border-l-4 border-l-purple-500"
                                />
                            )}

                            <MobileMenuItem to="/dashboard" icon={Home} label="Bank accounts" />
                            <MobileMenuItem to="/dashboard/accounts" icon={User} label="Accounts" />
                            <MobileMenuItem to="/dashboard/full-info" icon={FileText} label="Full Info" />
                            <MobileMenuItem to="/dashboard/enroll" icon={CreditCard} label="Enroll" />
                            <MobileMenuItem to="/dashboard/lookup" icon={Search} label="Lookup Services" />
                            <MobileMenuItem to="/dashboard/rules" icon={Scale} label="Rules" />
                            <MobileMenuItem to="/dashboard/faq" icon={HelpCircle} label="FAQ" />

                            {/* Logout Item */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-4 hover:bg-red-900/10 transition-colors group border-b border-gray-800/50"
                            >
                                <div className="flex items-center gap-4">
                                    <LogOut className="w-5 h-5 text-red-500" />
                                    <span className="text-red-400 font-medium text-lg">Sign Out</span>
                                </div>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-800 bg-[#0b0c15]">
                            <button className="w-full py-3.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all mb-3">
                                <MessageSquare className="w-5 h-5 fill-current" /> Contact support
                            </button>
                            <p className="text-center text-green-500 text-sm font-medium flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 24/7 online
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;