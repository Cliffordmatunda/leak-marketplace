import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { NAV_LINKS } from '../components/NavData';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Layers } from 'lucide-react';

const CategoryPage = () => {
    // 1. Get the current section from URL (e.g., 'accounts')
    const { section } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // 2. Get active sub-category from URL query (e.g., ?sub=social)
    const activeSubId = searchParams.get('sub');

    // 3. Find the Nav Data for this specific section
    // We match '/dashboard/accounts' with the section 'accounts'
    const currentNav = NAV_LINKS.find(link => link.path.includes(section));
    const subCategories = currentNav?.subItems || [];

    // 4. Auto-select the first sub-category if none is selected
    useEffect(() => {
        if (!activeSubId && subCategories.length > 0) {
            setSearchParams({ sub: subCategories[0].id }, { replace: true });
        }
    }, [section, activeSubId, subCategories, setSearchParams]);

    // 5. Fetch Products based on the section AND the sub-category
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', section, activeSubId],
        queryFn: async () => {
            // Example URL: /products?category=accounts&type=social
            const endpoint = activeSubId
                ? `/products?category=${section}&type=${activeSubId}`
                : `/products?category=${section}`;

            const res = await api.get(endpoint);
            return res.data.data.products;
        },
        enabled: !!section // Only run if we have a section
    });

    // Safe check: If URL is wrong (e.g. /dashboard/xyz), show error
    if (!currentNav) return <div className="text-white p-10">Category not found</div>;

    const activeSubInfo = subCategories.find(s => s.id === activeSubId);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">

            {/* LEFT SIDEBAR (The Sub-Menu) */}
            <div className="w-full lg:w-64 flex-shrink-0 bg-[#0b0c15] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-gray-800 bg-[#13151f]">
                    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" /> {currentNav.name}
                    </h3>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {subCategories.map((sub) => {
                        const isActive = activeSubId === sub.id;
                        const Icon = sub.icon;

                        return (
                            <button
                                key={sub.id}
                                onClick={() => setSearchParams({ sub: sub.id })}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200 group ${isActive
                                        ? 'bg-[#1c1f2e] text-white border border-gray-700'
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-600'}`} />
                                    <span className="font-medium">{sub.title}</span>
                                </div>

                                <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-500'
                                    }`}>
                                    {sub.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT SIDE (Content Area) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Header Box */}
                <div className="bg-[#13151f] border border-gray-800 rounded-xl p-6 mb-6 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                {activeSubInfo?.title || 'All Products'}
                                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 font-normal">
                                    In stock: {products?.length || 0}
                                </span>
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
                                Browsing secure listings for {currentNav.name}.
                                Verify all details before purchase.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="bg-green-900/20 text-green-500 px-3 py-1 rounded text-xs font-bold border border-green-700/30">
                                System Online
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid (Scrollable) */}
                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-400 p-4 border border-red-900/50 bg-red-900/10 rounded-lg">
                            Could not load products. Check backend connection.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            {products?.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}

                            {(!products || products.length === 0) && (
                                <div className="col-span-full text-center py-20 text-gray-500 bg-[#0b0c15] rounded-xl border border-dashed border-gray-800">
                                    No products found in this category yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CategoryPage;