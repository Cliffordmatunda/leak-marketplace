import { useState } from 'react';
import { ShoppingCart, Eye, FileText } from 'lucide-react';
import PurchaseModal from './PurchaseModal';

const ProductCard = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Badge Logic
    const isYodlee = product.tags?.includes('YODLEE');
    const isOnlineAccess = product.tags?.includes('ONLINE ACCESS');

    return (
        <>
            <div
                // 1. CLICK CARD TO OPEN MODAL (Better UX than aiming for a small button)
                onClick={() => setIsModalOpen(true)}
                className="group relative bg-[#13151f] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden cursor-pointer flex flex-col h-full"
            >

                {/* Mesh Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                {/* Content Container (Flex Grow ensures footer stays at bottom) */}
                <div className="relative z-10 flex flex-col flex-1">

                    {/* HEADER */}
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-white tracking-wide truncate">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-900/30">
                                {product.category}
                            </span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> {product.fileType || 'TXT'}
                            </span>
                        </div>
                    </div>

                    {/* 2. THE "HEADS UP" DESCRIPTION (Truncated) */}
                    {/* line-clamp-2 cuts off text after 2 lines and adds "..." */}
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 h-8">
                        {product.description}
                    </p>

                    {/* SPACER (pushes footer down) */}
                    <div className="flex-1"></div>

                    {/* FOOTER: Stats & Badges */}
                    <div className="flex items-end justify-between mt-2">

                        {/* Stock Count */}
                        <div className="bg-[#1c1f2e] px-3 py-1.5 rounded-lg border border-gray-700/50 group-hover:border-gray-600 transition-colors">
                            <span className="text-gray-300 font-mono text-sm font-bold">
                                {product.stock} pcs
                            </span>
                        </div>

                        {/* Price & Badges */}
                        <div className="flex gap-2">
                            {isYodlee && <Badge color="purple" text="YODLEE" />}
                            {isOnlineAccess && <Badge color="indigo" text="ONLINE" />}

                            {!isYodlee && !isOnlineAccess && (
                                <span className="bg-green-600/20 text-green-400 border border-green-600/30 text-[11px] font-bold px-2 py-1 rounded tracking-wide">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* HOVER ACTION OVERLAY */}
                    {/* We show "View Details" to encourage reading before buying */}
                    <div className="absolute inset-0 bg-[#0b0c15]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                        <div className="flex gap-3">
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200">
                                <Eye className="w-4 h-4" /> View
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-200 delay-75">
                                <ShoppingCart className="w-4 h-4" /> Buy
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {isModalOpen && (
                <PurchaseModal
                    product={product}
                    onClose={(e) => {
                        e.stopPropagation(); // Prevent bubbling
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

// Helper for consistency
const Badge = ({ color, text }) => {
    const colors = {
        purple: 'bg-purple-600/20 text-purple-300 border-purple-500/30 shadow-purple-900/20',
        indigo: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 shadow-indigo-900/20',
    };
    return (
        <span className={`${colors[color]} border text-[10px] font-bold px-2 py-1 rounded tracking-wide shadow-lg`}>
            {text}
        </span>
    );
};

export default ProductCard;