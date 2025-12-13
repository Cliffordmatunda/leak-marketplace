import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Download, Clock, AlertCircle, CheckCircle, FileText, Box } from 'lucide-react';

const DownloadsPage = () => {
    // 1. Fetch Orders
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/my-orders');
            return res.data.data.orders;
        }
    });

    // 2. Handle Download Click
    const handleDownload = (product) => {
        // Logic: In a real app, this would call an endpoint to get a signed S3 URL.
        // For now, we simulate the start of a download.
        alert(`Starting secure download for: ${product.title}\nSource: ${product.s3Key}`);

        // Example of real logic:
        // window.open(product.s3Key, '_blank'); 
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-800">
            Failed to load your orders.
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Box className="text-blue-500" />
                    My Assets
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    Track purchase status and download your files.
                </p>
            </div>

            {/* ORDERS LIST */}
            <div className="space-y-4">
                {orders?.length === 0 ? (
                    <div className="text-center py-20 bg-[#13151f] rounded-xl border border-gray-800 border-dashed">
                        <p className="text-gray-400">You haven't purchased anything yet.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-[#13151f] border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-600 transition-colors"
                        >

                            {/* Left: Icon & Info */}
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${order.status === 'completed' ? 'bg-blue-600/20 text-blue-400' : 'bg-yellow-600/20 text-yellow-400'
                                    }`}>
                                    <FileText className="w-6 h-6" />
                                </div>

                                <div>
                                    <h3 className="text-white font-bold text-lg">{order.product?.title || 'Unknown Product'}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="font-mono">ID: #{order._id.slice(-6).toUpperCase()}</span>
                                        <span>•</span>
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="text-gray-300 font-bold">${order.priceUSD}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Status & Action */}
                            <div className="flex items-center gap-4 self-end md:self-auto">

                                {/* STATUS INDICATOR */}
                                {order.status === 'completed' ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/20 text-green-400 border border-green-800/50 text-xs font-bold uppercase tracking-wider">
                                        <CheckCircle className="w-3 h-3" /> Ready
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-800/50 text-xs font-bold uppercase tracking-wider">
                                        <Clock className="w-3 h-3" /> Verifying
                                    </div>
                                )}

                                {/* DOWNLOAD BUTTON */}
                                <button
                                    onClick={() => handleDownload(order.product)}
                                    disabled={order.status !== 'completed'}
                                    className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all
                    ${order.status === 'completed'
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                        }
                  `}
                                >
                                    <Download className="w-4 h-4" />
                                    {order.status === 'completed' ? 'Download File' : 'Processing'}
                                </button>

                            </div>

                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default DownloadsPage;