import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../api/axios';
import { UploadCloud, FileText, CheckCircle, X, DollarSign, Tag } from 'lucide-react';
import { NAV_LINKS } from '../components/NavData';

const AdminUploadPage = () => {
    const queryClient = useQueryClient();

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        // ⚠️ CRITICAL: Must match one of the allowed DB values exactly
        category: 'Accounts',
        subCategory: '',
        tags: '',
        stock: 1
    });

    // 1. TRANSLATION MAP: Connects DB Values -> NavData Names
    // Keys = What the Database Expects (Exact match to your error)
    // Values = What the Navbar calls them (NavData.js)
    const CATEGORY_MAP = {
        'Accounts': 'Accounts',      // DB: Accounts -> Nav: Accounts
        'Bank': 'Bank accounts',     // DB: Bank -> Nav: Bank accounts
        'fullz': 'Full Info',        // DB: fullz -> Nav: Full Info
        'cc': 'Accounts',            // Fallback: map 'cc' to Accounts nav for now
        'cards': 'Accounts',         // Fallback
        'bins': 'Accounts'           // Fallback
    };

    // 2. FILTER SUB-CATEGORIES
    // Use the map to find which Nav Section we are talking about
    const navName = CATEGORY_MAP[formData.category];
    const activeNavSection = NAV_LINKS.find(link => link.name === navName);
    const availableSubCategories = activeNavSection?.subItems || [];

    // 3. AUTO-RESET EFFECT
    // Whenever the Main Category changes, default the Sub-Category
    useEffect(() => {
        if (availableSubCategories.length > 0) {
            setFormData(prev => ({ ...prev, subCategory: availableSubCategories[0].id }));
        } else {
            setFormData(prev => ({ ...prev, subCategory: '' }));
        }
    }, [formData.category, availableSubCategories.length]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');
        setSuccess(false);

        try {
            let s3Key = 'pending_upload.txt';

            if (file) {
                // A. Presigned URL
                const urlRes = await api.get(`/products/upload-url?fileType=${file.type}`);
                const { uploadUrl, key } = urlRes.data;
                s3Key = key;

                // B. Direct Upload
                await axios.put(uploadUrl, file, {
                    headers: { 'Content-Type': file.type }
                });
            }

            // C. Save to DB
            await api.post('/products', {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                // Ensure tags includes subcategory
                tags: [formData.subCategory, ...formData.tags.split(',').map(t => t.trim()).filter(Boolean)],
                s3Key
            });

            setSuccess(true);
            setFile(null);
            // Keep category but reset other fields
            setFormData(prev => ({ ...prev, title: '', description: '', price: '', tags: '' }));
            queryClient.invalidateQueries(['products']);

        } catch (err) {
            console.error("Upload Error:", err);
            setError(err.response?.data?.message || err.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <UploadCloud className="text-blue-500 w-8 h-8" />
                    Upload Asset
                </h1>
                <p className="text-gray-400 mt-2">Add new products to the marketplace.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: The Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#13151f] border border-gray-800 rounded-xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    placeholder="e.g. 5K USA Email List"
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 pl-9 text-white focus:border-blue-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Qty</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* DYNAMIC CATEGORY LOGIC */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Category</label>
                                    <select
                                        className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-gray-300 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {/* ⚠️ THESE VALUES MATCH YOUR ERROR MESSAGE EXACTLY */}
                                        <option value="Accounts">Accounts</option>
                                        <option value="Bank">Bank (Singular)</option>
                                        <option value="fullz">fullz</option>
                                        <option value="cc">cc</option>
                                        <option value="cards">cards</option>
                                        <option value="bins">bins</option>
                                    </select>
                                </div>

                                {/* Dependent Dropdown */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub-Category</label>
                                    <select
                                        className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-gray-300 outline-none disabled:opacity-50"
                                        value={formData.subCategory}
                                        onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                                        disabled={availableSubCategories.length === 0}
                                    >
                                        {availableSubCategories.length > 0 ? (
                                            availableSubCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.title}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No sub-categories</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    placeholder="Details about the data..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (Comma separated)</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 pl-9 text-white focus:border-blue-500 outline-none"
                                        placeholder="BTC, YODLEE, FRESH"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? 'Processing Upload...' : (
                                    <><UploadCloud className="w-5 h-5" /> Publish Product</>
                                )}
                            </button>

                        </form>
                    </div>
                </div>

                {/* RIGHT: File Picker */}
                <div className="space-y-6">
                    <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-green-500/50 bg-green-900/10' : 'border-gray-700 hover:border-gray-500 bg-[#13151f]'
                        }`}>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <div className="relative">
                                <FileText className="w-12 h-12 text-green-400 mb-2 mx-auto" />
                                <p className="text-white font-medium text-sm break-all">{file.name}</p>
                                <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                                <button onClick={() => setFile(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-400"><X className="w-3 h-3 text-white" /></button>
                            </div>
                        ) : (
                            <label htmlFor="file-upload" className="cursor-pointer w-full">
                                <UploadCloud className="w-12 h-12 text-blue-500 mb-2 mx-auto" />
                                <p className="text-gray-300 font-medium">Click to Upload File</p>
                            </label>
                        )}
                    </div>

                    {success && (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <div>
                                <p className="text-green-400 font-bold">Product Live!</p>
                                <p className="text-gray-400 text-xs">Available in marketplace.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUploadPage;