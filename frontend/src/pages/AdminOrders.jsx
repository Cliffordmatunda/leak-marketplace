import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { CheckCircle, Clock, Search, RefreshCw, ShieldAlert, Copy } from 'lucide-react';

const AdminOrdersPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    // 1. FETCH ORDERS (Corrected Endpoint)
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            // ✅ FIX: Fetch ALL orders for Admin Bunker
            const res = await api.get('/orders/all');
            return res.data.data.orders;
        }
    });

    // 2. APPROVE MUTATION
    const approveMutation = useMutation({
        mutationFn: async (orderId) => {
            await api.patch(`/orders/${orderId}/approve`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
        },
        onError: (err) => {
            alert(err.response?.data?.message || 'Failed to approve');
        }
    });

    const filteredOrders = orders?.filter(order =>
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.transactionHash || '').includes(searchTerm) ||
        (order._id || '').includes(searchTerm)
    );

    if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-red-500 p-10">Error loading orders. Check Backend.</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-red-500 w-8 h-8" /> The Bunker
                    </h1>
                    <p className="text-gray-400 mt-2">Order Verification Center.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                        type="text" placeholder="Search Hash, Email, or ID..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#13151f] border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl w-72 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-[#13151f] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b0c15] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Product / Price</th>
                                <th className="p-4">Payment Proof</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredOrders?.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                                    <td className="p-4">
                                        <p className="text-sm text-white font-medium">{order.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-gray-300 font-medium">{order.product?.title || 'Unknown'}</p>
                                        <p className="text-xs text-green-400 font-mono font-bold">${order.priceUSD}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <code className="bg-black/30 px-2 py-1 rounded text-xs text-yellow-500 font-mono border border-yellow-900/30 max-w-[120px] truncate">
                                                {order.transactionHash}
                                            </code>
                                            <button onClick={() => navigator.clipboard.writeText(order.transactionHash)} className="text-gray-600 hover:text-white" title="Copy"><Copy className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {order.status === 'completed' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-900/20 text-green-400 border border-green-800/50"><CheckCircle className="w-3 h-3" /> Paid</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-900/20 text-yellow-400 border border-yellow-800/50 animate-pulse"><Clock className="w-3 h-3" /> Verify</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {order.status === 'pending_verification' && (
                                            <button
                                                onClick={() => approveMutation.mutate(order._id)} disabled={approveMutation.isPending}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 ml-auto"
                                            >
                                                {approveMutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3" /> Approve</>}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders?.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500 italic">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;