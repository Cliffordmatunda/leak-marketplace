import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Zap, Wifi, User, MapPin, DollarSign, Lock, FileText } from 'lucide-react';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // ✅ DEBUG: Log this to console to ensure the ID exists
    const handleCardClick = (e) => {
        console.log("Navigating to product:", product._id);
        navigate(`/dashboard/product/${product._id}`);
    };

    // --- BADGE RENDERER ---
    const renderFeatureBadges = () => {
        const badges = [];
        // INSTANT DELIVERY
        badges.push(
            <div key="instant" className="flex items-center gap-1 bg-[#1e1b14] border border-[#ffd700]/20 text-[#ffd700] text-[10px] font-bold px-2 py-1.5 rounded-lg tracking-wide">
                <Zap className="w-3 h-3 fill-current" /> Instant
            </div>
        );
        // DYNAMIC TAGS
        if (product.tags?.includes('LOGIN+PASS')) badges.push(<FeatureBadge key="lp" icon={Wifi} label="LOGIN+PASS" />);
        if (product.tags?.includes('NAME')) badges.push(<FeatureBadge key="nm" icon={User} label="NAME" />);
        if (product.tags?.includes('ADDRESS')) badges.push(<FeatureBadge key="ad" icon={MapPin} label="ADDRESS" />);
        if (product.tags?.includes('BALANCE')) badges.push(<FeatureBadge key="bl" icon={DollarSign} label="BALANCE" />);

        return badges;
    };

    return (
        <div
            onClick={handleCardClick} // <--- This triggers the navigation
            className="group relative bg-[#13151f] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all cursor-pointer flex flex-col h-full min-h-[180px]"
        >
            <div className="relative z-10 flex flex-col flex-1 justify-between">
                <div className="mb-3">
                    <div className="flex justify-between items-start">
                        <h3 className="text-[15px] font-bold text-gray-100 truncate w-3/4">
                            {product.title}
                        </h3>
                        <span className="text-green-400 font-bold text-sm">
                            ${product.price}
                        </span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto mb-3">
                    {renderFeatureBadges()}
                </div>

                {/* Hover Button */}
                <div className="absolute inset-0 bg-[#0b0c15]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component
const FeatureBadge = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-1.5 bg-[#1a1d26] border border-gray-700 text-gray-300 text-[10px] font-bold px-2 py-1.5 rounded-lg">
        {Icon && <Icon className="w-3 h-3 text-gray-500" />} {label}
    </div>
);

export default ProductCard;