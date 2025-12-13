import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import {
    ShoppingCart, ArrowLeft, ShieldCheck, Zap,
    Wifi, User, MapPin, DollarSign, Lock, FileText
} from 'lucide-react';
import PurchaseModal from '../components/PurchaseModal';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // 1. FETCH PRODUCT DETAILS
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.data.product;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-20 bg-[#0b0c15] rounded-xl border border-red-900/20 mt-10">
            <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-gray-400 underline">Go Back</button>
        </div>
    );

    // --- BADGE RENDERER (Matching your Card Logic) ---
    const renderBadges = () => {
        const badges = [];
        // Dynamic Tags from DB
        if (product.tags?.includes('LOGIN+PASS')) badges.push({ icon: Wifi, label: 'LOGIN+PASS' });
        if (product.tags?.includes('NAME')) badges.push({ icon: User, label: 'NAME' });
        if (product.tags?.includes('ADDRESS')) badges.push({ icon: MapPin, label: 'ADDRESS' });
        if (product.tags?.includes('BALANCE')) badges.push({ icon: DollarSign, label: 'BALANCE' });
        if (product.tags?.includes('2FA_OFF')) badges.push({ icon: Lock, label: 'NO 2FA' });
        if (product.tags?.includes('COOKIES')) badges.push({ icon: FileText, label: 'COOKIES' });
        if (product.tags?.includes('EMAIL_ACCESS')) badges.push({ icon: FileText, label: 'EMAIL ACCESS' });
        return badges;
    };

    return (
        <div className="max-w-5xl mx-auto p-4 animate-fade-in pb-20">
            {/* BACK BUTTON */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Market
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: INFO CARD */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#13151f] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                        {/* Background Mesh */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{product.title}</h1>
                                    <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {/* FEATURES GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                                {/* Always show Instant Delivery */}
                                <div className="flex items-center gap-2 bg-[#1e1b14] border border-[#ffd700]/20 p-3 rounded-lg">
                                    <Zap className="w-4 h-4 text-[#ffd700] fill-current" />
                                    <span className="text-[#ffd700] font-bold text-xs uppercase">Instant Delivery</span>
                                </div>
                                {/* Dynamic Badges */}
                                {renderBadges().map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#0b0c15] p-3 rounded-lg border border-gray-700/50">
                                        <badge.icon className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300 font-bold text-xs uppercase">{badge.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <h3 className="text-gray-500 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Product Description
                                </h3>
                                <div className="bg-[#0b0c15] p-5 rounded-xl border border-gray-800 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: BUY ACTION STICKY */}
                <div className="space-y-4">
                    <div className="bg-[#13151f] border border-gray-800 rounded-2xl p-6 sticky top-24 shadow-2xl">

                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-1">Total Price</p>
                            <div className="flex items-end gap-2">
                                <p className="text-4xl font-bold text-green-400">${product.price}</p>
                                <p className="text-gray-500 mb-1">USD</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-800">
                            <span className="text-gray-400 text-sm">Availability</span>
                            {product.stock > 0 ? (
                                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-900/10 px-3 py-1 rounded text-sm border border-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    {product.stock} in stock
                                </span>
                            ) : (
                                <span className="text-red-500 font-bold bg-red-900/10 px-3 py-1 rounded text-sm border border-red-500/20">Sold Out</span>
                            )}
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                            disabled={product.stock === 0}
                            onClick={() => setShowPurchaseModal(true)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {product.stock > 0 ? 'Purchase Now' : 'Out of Stock'}
                        </button>

                        <div className="mt-6 space-y-3">
                            <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Secure Crypto Payment
                            </p>
                            <p className="text-center text-[10px] text-gray-600">
                                Automatic delivery to your email & dashboard immediately after blockchain confirmation.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* PURCHASE MODAL */}
            {showPurchaseModal && (
                <PurchaseModal
                    product={product}
                    onClose={() => setShowPurchaseModal(false)}
                />
            )}
        </div>
    );
};

export default ProductDetailsPage;