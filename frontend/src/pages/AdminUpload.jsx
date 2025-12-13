import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import {
    Plus, Upload, CheckCircle, AlertTriangle,
    Database, DollarSign, Tag, Wifi, User, MapPin, Lock, FileText
} from 'lucide-react';

// --- CONFIG: AVAILABLE BADGES ---
const BANK_FEATURES = [
    { id: 'LOGIN+PASS', label: 'LOGIN+PASS', icon: Wifi },
    { id: 'NAME', label: 'NAME', icon: User },
    { id: 'ADDRESS', label: 'ADDRESS', icon: MapPin },
    { id: 'BALANCE', label: 'BALANCE', icon: DollarSign },
    { id: '2FA_OFF', label: 'NO 2FA', icon: Lock },
    { id: 'COOKIES', label: 'COOKIES', icon: FileText },
    { id: 'EMAIL_ACCESS', label: 'EMAIL ACCESS', icon: FileText }
];

import { NAV_LINKS } from '../components/NavData';

const AdminUploadPage = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('create');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    // --- FORM STATE ---
    // selectedFeatures stores the temporary checkbox list
    const [newProduct, setNewProduct] = useState({
        title: '', price: '', category: NAV_LINKS[0].name, subCategory: '',
        type: 'fullz', description: '', tags: '',
        selectedFeatures: []
    });

    const [inventory, setInventory] = useState({ productId: '', state: '', dataText: '' });

    // Helper: Toggle Feature in Array
    const toggleFeature = (featureId) => {
        setNewProduct(prev => {
            const exists = prev.selectedFeatures.includes(featureId);
            if (exists) {
                return { ...prev, selectedFeatures: prev.selectedFeatures.filter(f => f !== featureId) };
            } else {
                return { ...prev, selectedFeatures: [...prev.selectedFeatures, featureId] };
            }
        });
    };

    // --- QUERIES & MUTATIONS ---
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/products');
            return res.data.data.products;
        }
    });

    const createProductMutation = useMutation({
        mutationFn: (data) => {
            // MERGE: Combine manual text tags (comma separated) with Checkbox Features
            const manualTags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
            const finalTags = [...new Set([...manualTags, ...data.selectedFeatures])]; // Remove duplicates

            // Prepare payload
            const payload = { ...data, tags: finalTags };
            delete payload.selectedFeatures; // Don't send the UI state to backend

            return api.post('/products', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setStatusMsg({ type: 'success', text: 'Product Created Successfully!' });
            setNewProduct({
                title: '', price: '', category: NAV_LINKS[0].name, subCategory: '',
                type: 'fullz', description: '', tags: '', selectedFeatures: []
            });
        },
        onError: (err) => setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed' })
    });

    const addStockMutation = useMutation({
        mutationFn: (data) => api.post('/products/add-fullz', data),
        onSuccess: (res) => {
            setStatusMsg({ type: 'success', text: res.data.message });
            setInventory({ ...inventory, dataText: '' });
        },
        onError: (err) => setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Upload failed' })
    });

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Database className="text-purple-500 w-8 h-8" /> Inventory Manager
                </h1>
            </div>

            {/* STATUS BANNER */}
            {statusMsg.text && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {statusMsg.text}
                </div>
            )}

            {/* TABS */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1">
                <button onClick={() => setActiveTab('create')} className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'create' ? 'border-green-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>1. Create Product</button>
                <button onClick={() => setActiveTab('stock')} className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'stock' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>2. Add Stock</button>
            </div>

            {/* === TAB 1: CREATE (With Feature Checkboxes) === */}
            {activeTab === 'create' && (
                <div className="bg-[#13151f] border border-gray-800 rounded-xl p-8">
                    <form onSubmit={(e) => { e.preventDefault(); createProductMutation.mutate(newProduct); }} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                                <input type="text" required className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input type="number" required className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 pl-9 text-white focus:border-green-500 outline-none" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <textarea rows="2" className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        </div>

                        {/* CATEGORY & SUB-CATEGORY */}
                        {/* CATEGORY & SUB-CATEGORY & FORMAT */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* 1. Category */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                <select
                                    className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, subCategory: '' })}
                                >
                                    {NAV_LINKS.map(link => (
                                        <option key={link.name} value={link.name}>{link.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. Sub-Category (Dynamic) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sub-Category</label>
                                <select
                                    className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={newProduct.subCategory}
                                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                                    disabled={!NAV_LINKS.find(n => n.name === newProduct.category)?.subItems?.length}
                                >
                                    <option value="">-- Select Type --</option>
                                    {NAV_LINKS.find(n => n.name === newProduct.category)?.subItems.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. Format */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Format</label>
                                <select className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                                    <option value="fullz">Fullz (Text)</option>
                                    <option value="logs">Logs (File)</option>
                                </select>
                            </div>
                        </div>

                        {/* ✅ DYNAMIC FEATURE BADGES (Checkboxes) */}
                        <div className="bg-[#0b0c15] p-5 rounded-xl border border-gray-800">
                            <label className="block text-xs font-bold text-purple-400 uppercase mb-3 flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Included Data (Click to toggle)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {BANK_FEATURES.map((feature) => {
                                    const isSelected = newProduct.selectedFeatures.includes(feature.id);
                                    const Icon = feature.icon;
                                    return (
                                        <button
                                            key={feature.id}
                                            type="button"
                                            onClick={() => toggleFeature(feature.id)}
                                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all ${isSelected
                                                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-900/20'
                                                : 'bg-[#13151f] border-gray-700 text-gray-500 hover:border-gray-500'
                                                }`}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {feature.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" disabled={createProductMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                            {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                        </button>
                    </form>
                </div>
            )}

            {/* === TAB 2: STOCK (Fullz) === */}
            {activeTab === 'stock' && (
                <div className="bg-[#13151f] border border-gray-800 rounded-xl p-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const lines = inventory.dataText.split(/\r?\n/).filter(x => x.trim());
                        addStockMutation.mutate({ productId: inventory.productId, state: inventory.state, dataLines: lines });
                    }} className="space-y-6">

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Product</label>
                            <select className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white" value={inventory.productId} onChange={(e) => setInventory({ ...inventory, productId: e.target.value })}>
                                <option value="">-- Select --</option>
                                {products?.map(p => <option key={p._id} value={p._id}>{p.title} ({p.tags.join(', ')})</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State (e.g. TX) - Optional</label>
                                <input type="text" maxLength="2" className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white uppercase font-mono" placeholder="TX" value={inventory.state} onChange={(e) => setInventory({ ...inventory, state: e.target.value.toUpperCase() })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Paste Data (One Entry Per Line)</label>
                                <textarea rows="10" className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-xs font-mono text-white" value={inventory.dataText} onChange={(e) => setInventory({ ...inventory, dataText: e.target.value })} placeholder="email:pass..."></textarea>
                            </div>
                        </div>

                        <button type="submit" disabled={addStockMutation.isPending} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl">
                            {addStockMutation.isPending ? 'Uploading...' : 'Upload Stock'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminUploadPage;