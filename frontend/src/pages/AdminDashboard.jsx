import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import {
    LayoutDashboard, Package, ShieldAlert, UploadCloud,
    Trash2, Edit, Plus, Search, Save, X, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ✅ IMPORT THE SUB-PAGES
import AdminUploadPage from './AdminUpload';
import AdminOrdersPage from './AdminOrders';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'upload'
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#06070a]">

            {/* 1. SIDEBAR */}
            <div className="w-64 bg-[#0b0c15] border-r border-gray-800 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <LayoutDashboard className="text-blue-500" /> Admin Panel
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 pl-8">v3.0 Master Control</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Package className="w-5 h-5" />
                        <div className="text-left">
                            <p className="font-bold text-sm">Products List</p>
                            <p className="text-[10px] opacity-70">View & Edit Assets</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <ShieldAlert className="w-5 h-5" />
                        <div className="text-left">
                            <p className="font-bold text-sm">The Bunker</p>
                            <p className="text-[10px] opacity-70">Approve Orders</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-dashed border-gray-700 mt-4 ${activeTab === 'upload' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <UploadCloud className="w-5 h-5" />
                        <span className="font-bold text-sm">Upload New</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-4">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 bg-[#06070a] overflow-y-auto p-8 scrollbar-hide">
                {activeTab === 'inventory' && <InventoryManager onAddNew={() => setActiveTab('upload')} />}
                {activeTab === 'orders' && <AdminOrdersPage />}
                {activeTab === 'upload' && <AdminUploadPage />}
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// INTERNAL COMPONENT: Inventory List (View/Edit/Delete)
// ------------------------------------------------------------------
const InventoryManager = ({ onAddNew }) => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // READ
    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const res = await api.get('/products');
            return res.data.data.products;
        }
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/products/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['admin-products']),
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.patch(`/products/${id}`, data),
        onSuccess: () => {
            setEditingId(null);
            queryClient.invalidateQueries(['admin-products']);
        }
    });

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setEditForm({ title: product.title, price: product.price });
    };

    const handleSave = (id) => {
        updateMutation.mutate({ id, data: editForm });
    };

    const filteredProducts = products?.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="text-white">Loading Inventory...</div>;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Inventory List</h1>
                    <p className="text-gray-400">Total Assets: {products?.length || 0}</p>
                </div>
                <button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                    <Plus className="w-5 h-5" /> Add New
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#13151f] p-4 rounded-t-xl border-b border-gray-800">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                        type="text" placeholder="Search products..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#13151f] border border-gray-800 rounded-b-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0b0c15] text-gray-400 text-xs uppercase tracking-wider">
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price ($)</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredProducts?.map(product => (
                            <tr key={product._id} className="hover:bg-white/5 group">
                                <td className="p-4">
                                    {editingId === product._id ? (
                                        <input className="bg-[#0b0c15] border border-gray-600 text-white px-2 py-1 rounded w-full" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                    ) : (
                                        <div>
                                            <p className="text-white font-medium">{product.title}</p>
                                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{product.category}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    {editingId === product._id ? (
                                        <input type="number" className="bg-[#0b0c15] border border-gray-600 text-white px-2 py-1 rounded w-24" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                                    ) : (
                                        <span className="text-green-400 font-mono">${product.price}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockCount > 0 ? 'bg-blue-900/20 text-blue-400' : 'bg-red-900/20 text-red-400'}`}>
                                        {product.stockCount || 0} left
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {editingId === product._id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSave(product._id)} className="p-2 bg-green-600 rounded text-white"><Save className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="p-2 bg-gray-700 rounded text-white"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(product)} className="p-2 hover:bg-blue-900/30 text-blue-400 rounded"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => { if (confirm('Delete category?')) deleteMutation.mutate(product._id) }} className="p-2 hover:bg-red-900/30 text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;