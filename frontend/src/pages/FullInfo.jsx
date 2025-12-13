import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Zap, Search, ChevronRight } from 'lucide-react';

const FullInfo = () => {
    // Mock Data to match your screenshot
    const categories = [
        { id: 'business', title: 'Business FULLZ', price: 35, stock: 194 },
        { id: 'business-1', title: 'Business FULLZ [1]', price: 30, stock: 3 },
        { id: 'personal', title: 'Personal FULLZ', price: 15, stock: 420 },
    ];

    return (
        <div className="min-h-screen text-white p-4 max-w-3xl mx-auto animate-fade-in">

            {/* Header Area */}
            <div className="mb-6">
                <Link to="/dashboard" className="text-gray-400 text-sm mb-4 flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Full info categories
                </Link>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-200 font-bold flex items-center gap-2">
                        👥 Explore high viraity of our full-info data.
                    </span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="space-y-3 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#13151f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Filter className="w-4 h-4 fill-current" /> Add filters
                </button>
            </div>

            {/* Product List */}
            <div className="space-y-4">
                {categories.map((item) => (
                    <Link
                        key={item.id}
                        to={`/dashboard/full-info/${item.id}`}
                        className="block bg-[#0b0c15] border border-gray-800 rounded-xl p-5 relative overflow-hidden group hover:border-gray-600 transition-all"
                    >
                        {/* Dotted Background Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    <span className="bg-[#1a1d26] text-gray-400 text-xs px-2 py-1 rounded border border-gray-800 flex items-center gap-1">
                                        👤 In stock: {item.stock}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-4">$ {item.price}</div>
                                <span className="bg-[#1a1d26] text-[#fbbf24] text-xs px-3 py-1.5 rounded border border-[#fbbf24]/20 flex items-center gap-1 w-fit font-bold">
                                    <Zap className="w-3 h-3 fill-current" /> Instant delivery
                                </span>
                            </div>

                            {/* Decorative Blur (Optional) */}
                            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FullInfo;