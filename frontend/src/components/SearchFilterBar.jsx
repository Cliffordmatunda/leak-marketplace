import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, DollarSign } from 'lucide-react';

const SearchFilterBar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Local State for inputs
    const [keyword, setKeyword] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Sync local state if URL changes externally (e.g. Navigation click)
    useEffect(() => {
        setKeyword(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || '');
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();

        // Build new params object
        const params = {};
        if (keyword) params.search = keyword;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        // Update URL (Marketplace page listens to this)
        setSearchParams(params);
    };

    const clearFilters = () => {
        setKeyword('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({});
    };

    return (
        <div className="bg-[#0b0c15] border-b border-gray-800 p-4 sticky top-0 z-40">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">

                {/* 1. Keyword Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search keywords (e.g. 'Wells Fargo', 'Crypto')"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-[#13151f] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:border-blue-500 outline-none text-sm placeholder-gray-600"
                    />
                </div>

                {/* 2. Category Dropdown */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#13151f] border border-gray-700 text-gray-300 py-2 px-3 rounded-lg text-sm outline-none w-full md:w-40"
                >
                    <option value="">All Categories</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Bank">Bank Logs</option>
                    <option value="fullz">Fullz Info</option>
                    <option value="cc">CC / Cards</option>
                </select>

                {/* 3. Price Range */}
                <div className="flex items-center gap-2">
                    <div className="relative w-24">
                        <span className="absolute left-2 top-2 text-gray-500 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-[#13151f] border border-gray-700 text-white pl-5 pr-2 py-2 rounded-lg text-sm outline-none"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative w-24">
                        <span className="absolute left-2 top-2 text-gray-500 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-[#13151f] border border-gray-700 text-white pl-5 pr-2 py-2 rounded-lg text-sm outline-none"
                        />
                    </div>
                </div>

                {/* 4. Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" /> Filter
                    </button>

                    {(keyword || category || minPrice || maxPrice) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-2 rounded-lg"
                            title="Clear Filters"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
};

export default SearchFilterBar;