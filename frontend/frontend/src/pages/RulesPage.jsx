import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Settings,
    Send,
    HelpCircle,
    FileText,
    LogOut,
    ShieldAlert,
    Clock,
    AlertTriangle,
    Video,
    Wallet,
    Scale,
    Ban
} from 'lucide-react';

const RulesPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Sidebar Configuration
    const menuItems = [
        { icon: ShoppingCart, label: 'Purchases', path: '/dashboard/downloads' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        { icon: Send, label: 'Telegram synchronization', path: '/dashboard/telegram' },
        { icon: HelpCircle, label: 'Support (FAQ)', path: '/dashboard/faq' },
        { icon: FileText, label: 'Rules', path: '/dashboard/rules', active: true },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <div className="flex flex-col md:flex-row gap-8">

                {/* --- LEFT SIDEBAR (Navigation) --- */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${item.active
                                        ? 'bg-[#13151f] text-white border border-gray-700 shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-gray-500'}`} />
                                {item.label}
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all mt-4"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </nav>
                </div>

                {/* --- RIGHT CONTENT AREA (Rules) --- */}
                <div className="flex-1">

                    <div className="mb-8 border-b border-gray-800 pb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <ShieldAlert className="text-red-500 w-8 h-8" />
                            Leak Shop Rules
                        </h2>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="bg-red-900/20 text-red-400 text-xs px-2 py-0.5 rounded border border-red-900/30">
                                Strict Enforcement
                            </span>
                            <p className="text-gray-500 text-xs">Last updated: 10-01-2025</p>
                        </div>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                            Using this Marketplace, you agree with all the rules written below. Ignorance of the rules is not a reason to make exceptions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">

                        {/* 1. Warranty & Limits */}
                        <div className="bg-[#13151f] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Warranty & Checking Time</h3>
                                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-2">
                                        <li>You have <span className="text-white font-bold">60 minutes</span> to check an account. After this time, no replacement or refund is possible.</li>
                                        <li>Guarantee applies ONLY to validity, balance relevance, and information correctness.</li>
                                        <li><span className="text-red-400">Non-Warranty Cases:</span> Maxlink PP, account died after 4 days, "didn't suit you", or blocked after a while.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 2. Mandatory Video Evidence */}
                        <div className="bg-[#13151f] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                                    <Video className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Mandatory Video Evidence</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                        For blocked accounts, personal cabinet access, or self-made accounts, refunds are ONLY issued if you have a video recording.
                                    </p>
                                    <div className="bg-black/30 p-3 rounded border border-gray-700 text-xs text-gray-300 font-mono">
                                        Start recording BEFORE purchase <span className="text-gray-500">→</span> Buy Account <span className="text-gray-500">→</span> Show Login Data Entry <span className="text-gray-500">→</span> Check Account <span className="text-gray-500">→</span> Stop Video.
                                    </div>
                                    <p className="text-red-400 text-xs mt-2 italic">
                                        * Hiding login/password data in the video is grounds for refusal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Financial Policy */}
                        <div className="bg-[#13151f] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-900/20 p-3 rounded-lg border border-green-800/30">
                                    <Wallet className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Refunds & Balance</h3>
                                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                        <li>Marketplace funds <span className="text-white font-bold">cannot be withdrawn</span> to your external wallet.</li>
                                        <li>Refunds are made to your Marketplace balance or via account replacement.</li>
                                        <li>Refunds are only issued if the balance is less than declared by more than <span className="text-white font-bold">30%</span>.</li>
                                        <li>Debits/trials older than 3 months are not grounds for a refund.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 4. Liability & Fraud */}
                        <div className="bg-[#13151f] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-800/30">
                                    <Scale className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Liability & Conduct</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-2">
                                        <span className="text-white font-bold">Intermediary Only:</span> We do not mine accounts. Only the buyer is responsible for actions performed with the account.
                                    </p>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        <Ban className="w-3 h-3 inline mr-1 text-red-400" />
                                        Any fraud, bug abuse, or harm to the shop results in an immediate <strong>account block without refund</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 5. Misc Rules */}
                        <div className="bg-[#13151f] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                    <AlertTriangle className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Additional Notes</h3>
                                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                        <li>Admin is not responsible if you cannot find a service to check trials/balance.</li>
                                        <li>Combo trials are not guaranteed and not refundable.</li>
                                        <li>Accounts sold {'>'} 3 months ago may be resold.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RulesPage;