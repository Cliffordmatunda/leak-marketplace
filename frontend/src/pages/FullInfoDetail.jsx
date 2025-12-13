import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // <--- NEW IMPORT
import api from '../api/axios'; // <--- NEW IMPORT
import { Search, ChevronRight, Sparkles, Globe } from 'lucide-react';

const FullInfoDetail = () => {
    const { id } = useParams();

    // 1. FETCH PRODUCT DETAILS (Title, Price, Format)
    // We fetch this to get the specific Price and Title for the header
    const { data: product } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.data.product;
        },
        initialData: { title: 'Loading...', price: 0, stockCount: 0 }
    });

    // 2. FETCH REAL-TIME STATE STATS (The Logic we added)
    const { data: stateStats } = useQuery({
        queryKey: ['fullz-stats', id],
        queryFn: async () => {
            // Calls the backend aggregation pipeline we created
            const res = await api.get(`/products/${id}/stats`);
            return res.data.data.stats;
        },
        refetchInterval: 5000 // Poll every 5s for live inventory updates
    });

    // Complete list of US States to render the grid
    const allStates = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const formatText = "CARDHOLDER: NAME+ADDRESS+SSN+DOB+EMAIL | COMPANY: NAME+ADDRESS+EIN";

    return (
        <div className="min-h-screen text-white p-4 max-w-3xl mx-auto animate-fade-in">

            {/* Header */}
            <div className="mb-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/dashboard/full-info" className="hover:text-white transition-colors">Full Info</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">{product.title || 'Category'}</span>
                </div>

                <div className="bg-[#0b0c15] border border-gray-800 rounded-xl p-4 mb-6">
                    <h1 className="text-xl font-bold text-white mb-2">{product.title || 'Loading...'}</h1>
                    <p className="text-xs text-gray-400 font-mono bg-[#13151f] p-3 rounded border border-gray-800/50 break-all">
                        {formatText}
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#13151f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                {/* Random Buy Button */}
                <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 mb-8">
                    <Sparkles className="w-4 h-4 fill-current" /> Buy random state
                </button>

                {/* Stats Bar */}
                <div className="flex items-center gap-4 text-sm font-bold text-gray-300 mb-4 border-b border-gray-800 pb-2">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        In stock: {product.stockCount}
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        Price: $ {product.price}
                    </span>
                </div>

                {/* States Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {allStates.map((code) => {
                        // Calculate stock dynamically from backend response
                        const stock = stateStats?.[code] || 0;

                        return (
                            <button
                                key={code}
                                disabled={stock === 0}
                                className={`
                                    relative p-4 rounded-xl border flex flex-col items-start gap-3 transition-all
                                    ${stock > 0
                                        ? 'bg-[#0b0c15] border-gray-800 hover:border-gray-600 cursor-pointer group'
                                        : 'bg-[#0b0c15]/50 border-gray-900 opacity-50 cursor-not-allowed'
                                    }
                                `}
                            >
                                {/* Dotted BG */}
                                <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none"></div>

                                <div className="flex items-center gap-2 z-10">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-lg font-bold text-white">{code}</span>
                                </div>

                                <div className="z-10 bg-[#1a1d26] text-gray-400 text-xs px-2 py-1 rounded border border-gray-800 flex items-center gap-2 w-full">
                                    <UserIconSmall /> In stock: {stock}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Small helper icon
const UserIconSmall = () => (
    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
);

export default FullInfoDetail;