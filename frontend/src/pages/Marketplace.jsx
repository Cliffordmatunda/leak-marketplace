import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { X, Search, Filter } from 'lucide-react';
import { NAV_LINKS } from '../components/NavData';

const Marketplace = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get Filters from URL
    const categoryFilter = searchParams.get('category') || '';
    const subCategoryFilter = searchParams.get('type') || '';
    const searchFilter = searchParams.get('search') || '';
    const minPriceFilter = searchParams.get('minPrice') || '';
    const maxPriceFilter = searchParams.get('maxPrice') || '';

    // Update URL Helper
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // If changing category, reset sub-category
        if (key === 'category') newParams.delete('type');
        setSearchParams(newParams);
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', categoryFilter, searchFilter, subCategoryFilter, minPriceFilter, maxPriceFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);
            if (subCategoryFilter) params.append('type', subCategoryFilter);
            if (searchFilter) params.append('search', searchFilter);
            if (minPriceFilter) params.append('minPrice', minPriceFilter);
            if (maxPriceFilter) params.append('maxPrice', maxPriceFilter);
            const res = await api.get(`/products?${params.toString()}`);
            return res.data.data.products;
        }
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    if (error) return <div className="text-red-400 p-4">Error loading data.</div>;

    // --- CUSTOM CARD COMPONENT (Matches Screenshot 3) ---
    const DarkCard = ({ product }) => (
        <div
            onClick={() => navigate(`/dashboard/product/${product._id}`)}
            className="bg-[#0b0c15] border border-gray-800 rounded-lg p-5 flex flex-col justify-between h-[110px] relative overflow-hidden group hover:border-gray-600 transition-all cursor-pointer">

            {/* Background Pattern (Optional subtle dots) */}
            <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

            {/* Top Row: Title */}
            <h3 className="text-white font-medium text-base z-10 truncate font-sans">
                {product.title}
            </h3>

            {/* Bottom Row: Pills */}
            <div className="flex items-center justify-between z-10 mt-auto">
                {/* Quantity Pill */}
                <div className="bg-[#1a1d26] text-gray-300 text-xs px-3 py-1.5 rounded-md font-medium border border-gray-800">
                    {product.stockCount || Math.floor(Math.random() * 500) + 1} pcs
                </div>

                {/* Tag Pill (Purple or Blue based on type) */}
                <div className="bg-[#6366f1] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    {product.tag || 'YODLEE'}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* FILTER BAR */}
            <div className="bg-[#13151f] p-5 rounded-xl border border-gray-800 mb-8 sticky top-20 z-30 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <Filter className="w-4 h-4 text-purple-500" /> Filter Inventory
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* 1. Search */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg py-2.5 pl-9 pr-4 text-white text-sm focus:border-purple-500 outline-none"
                            value={searchFilter}
                            onChange={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>

                    {/* 2. Category */}
                    <div>
                        <select
                            className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:border-purple-500 outline-none"
                            value={categoryFilter}
                            onChange={(e) => updateFilter('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {NAV_LINKS.map(link => (
                                <option key={link.name} value={link.name}>{link.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Sub-Category (Dynamic) */}
                    <div>
                        <select
                            className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:border-purple-500 outline-none disabled:opacity-50"
                            value={subCategoryFilter}
                            onChange={(e) => updateFilter('type', e.target.value)}
                            disabled={!categoryFilter}
                        >
                            <option value="">All Types</option>
                            {categoryFilter && NAV_LINKS.find(n => n.name === categoryFilter)?.subItems.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Price Range */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min $"
                            className="w-1/2 bg-[#0b0c15] border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:border-purple-500 outline-none"
                            value={minPriceFilter}
                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max $"
                            className="w-1/2 bg-[#0b0c15] border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:border-purple-500 outline-none"
                            value={maxPriceFilter}
                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Active Filters Clear Button */}
                {(searchFilter || categoryFilter || minPriceFilter || maxPriceFilter) && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setSearchParams({})}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
                        >
                            <X className="w-3 h-3" /> Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Header / Search Status */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-white text-lg font-bold">
                        {categoryFilter ? `${categoryFilter} Stock` : 'All Inventory'}
                    </h2>
                </div>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {data?.map((product) => (
                    <DarkCard key={product._id} product={product} />
                ))}
            </div>

            {data?.length === 0 && (
                <div className="text-center py-20 text-gray-500">No accounts found.</div>
            )}
        </div>
    );
};

export default Marketplace;