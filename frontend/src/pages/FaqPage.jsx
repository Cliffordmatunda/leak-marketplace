import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Settings,
    Send,
    HelpCircle,
    FileText,
    LogOut,
    MessageSquare,
    Plus,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react';

const FAQPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // State for the Accordion
    const [openIndex, setOpenIndex] = useState(0); // Default first one open

    // Dummy Data based on your screenshot
    const faqs = [
        {
            question: "How do I connect my Telegram account?",
            answer: "Go to the 'Telegram synchronization' tab in the sidebar. Click 'Generate Token' and paste it into our Telegram Bot. This allows you to receive instant notifications for your purchases and support tickets."
        },
        {
            question: "I have purchased an invalid account or an account with trials?",
            answer: "If you encounter any issues with a purchase, please click the 'Open ticket' button above immediately. Provide your Order ID and a screenshot of the issue. Our support team verifies claims within 24 hours and will issue a replacement or refund to your balance."
        },
        {
            question: "How do I deposit funds?",
            answer: "We accept BTC, LTC, and USDT (TRC20). Go to your Balance section in the top bar, click 'Deposit', and send the exact amount to the generated address. Funds appear after 1 confirmation."
        },
        {
            question: "What are the rules for replacement?",
            answer: "You must report a bad account within 30 minutes of purchase. Changing the password or email of the bought account voids the warranty immediately."
        }
    ];

    // Sidebar Items
    const menuItems = [
        { icon: ShoppingCart, label: 'Purchases', path: '/dashboard/downloads' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        { icon: Send, label: 'Telegram synchronization', path: '/dashboard/telegram' },
        { icon: HelpCircle, label: 'Support (FAQ)', path: '/dashboard/faq', active: true },
        { icon: FileText, label: 'Rules', path: '/dashboard/rules' },
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

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all mt-4"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </nav>

                    {/* "Need help?" Footer from screenshot */}
                    <div className="mt-12 px-4">
                        <h4 className="text-white font-bold text-lg">Need help?</h4>
                        <p className="text-gray-500 text-xs mt-1">Contact an admin directly if urgent.</p>
                    </div>
                </div>

                {/* --- RIGHT CONTENT AREA --- */}
                <div className="flex-1">

                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-white font-medium mb-1">First, try to find answer to your question in our FAQ.</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            If question is not here, contact support. Please note, if your question is related to your purchase on the website, you have to open a ticket here.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        <button className="bg-[#1a1d26] hover:bg-[#252836] border border-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            Open ticket
                        </button>
                        <button className="bg-[#1a1d26] hover:bg-[#252836] border border-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                            <Send className="w-4 h-4 text-blue-400" />
                            Telegram support
                        </button>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#13151f]' : 'bg-transparent hover:bg-white/5'
                                        }`}
                                >
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className={`font-medium ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                                            {faq.question}
                                        </span>
                                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>

                                    {/* Accordion Body */}
                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-0">
                                            <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-700/50 pt-4">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FaqPage;