import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { X } from 'lucide-react';

const Marketplace = () => {
    // 1. GET ALL PARAMS FROM URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Extract individual filters
    const categoryFilter = searchParams.get('category'); // e.g., 'bank'
    const searchFilter = searchParams.get('search');     // e.g., 'crypto'
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // 2. FETCH PRODUCTS (Dynamic & Filtered)
    const { data, isLoading, error } = useQuery({
        // KEY CHANGE: Add ALL filters to the key.
        // When ANY of these change in the URL, React Query re-runs the function.
        queryKey: ['products', categoryFilter, searchFilter, minPrice, maxPrice],

        queryFn: async () => {
            // Use URLSearchParams to cleanly build the query string
            // This turns object { search: 'btc', minPrice: '10' } into "?search=btc&minPrice=10"
            const params = new URLSearchParams();

            if (categoryFilter) params.append('category', categoryFilter);
            if (searchFilter) params.append('search', searchFilter);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            const res = await api.get(`/products?${params.toString()}`);
            return res.data.data.products;
        }
    });

    // Helper to clear filters
    const clearAllFilters = () => {
        setSearchParams({});
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-800">
            Error loading marketplace data.
        </div>
    );

    // Check if any filter is active
    const isFiltering = categoryFilter || searchFilter || minPrice || maxPrice;

    return (
        <div>
            {/* Header & Status Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Marketplace
                        {/* Show Badge if Filters are Active */}
                        {isFiltering && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                                Filters Active
                                <button onClick={clearAllFilters} className="hover:text-red-200" title="Clear All">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {/* Show specific message depending on search */}
                        {searchFilter
                            ? `Found ${data?.length || 0} results for "${searchFilter}"`
                            : `${data?.length || 0} active listings available`
                        }
                    </p>
                </div>
            </div>

            {/* EMPTY STATE */}
            {data?.length === 0 && (
                <div className="text-center py-20 bg-[#13151f] rounded-xl border border-gray-800 border-dashed">
                    <p className="text-gray-400 mb-2">No products found matching your criteria.</p>
                    {isFiltering && (
                        <button onClick={clearAllFilters} className="text-blue-400 hover:underline">
                            Clear filters & View all
                        </button>
                    )}
                </div>
            )}

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Marketplace;