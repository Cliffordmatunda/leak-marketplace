import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Copy, CheckCircle, RefreshCw, Wallet, CreditCard, FileText, ShieldCheck, Tag } from 'lucide-react';
import api from '../api/axios';

const WALLETS = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    USDT: 'T9yD14Nj9j7xAB4dbGeiX9h8veHsn9sdfs'
};

const PurchaseModal = ({ product, onClose }) => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('BTC');
    const [txHash, setTxHash] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(WALLETS[paymentMethod]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/bookings', {
                productId: product._id,
                paymentMethod,
                transactionHash: txHash
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard/downloads'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-[#13151f] border border-green-500/30 p-8 rounded-2xl shadow-2xl text-center animate-bounce-in">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Purchase Successful!</h2>
                    <p className="text-gray-400">Verifying transaction...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* WIDER MODAL FOR SPLIT VIEW */}
            <div className="relative bg-[#0b0c15] border border-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* --- LEFT SIDE: ASSESSMENT (Description) --- */}
                <div className="w-full md:w-1/2 bg-[#13151f] p-8 border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto">

                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded border border-blue-800 uppercase">
                            {product.category}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {product.fileType || 'TXT'} File
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{product.title}</h2>

                    {/* Full Description Area */}
                    <div className="prose prose-invert prose-sm mb-6 text-gray-300">
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.tags?.map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-[#0b0c15] border border-gray-700 rounded text-[10px] text-gray-400 uppercase">
                                <Tag className="w-3 h-3" /> {tag}
                            </span>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center gap-3 bg-green-900/10 border border-green-900/30 p-3 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="text-green-400 text-xs font-bold">Verified Asset</p>
                            <p className="text-gray-500 text-[10px]">Checked for validity within last 24h.</p>
                        </div>
                    </div>
                </div>


                {/* --- RIGHT SIDE: PURCHASE (Checkout) --- */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg">Checkout</h3>
                            <p className="text-gray-500 text-xs">Secure Crypto Payment</p>
                        </div>
                        <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                    </div>

                    {/* Price Box */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-4 rounded-xl mb-6 flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Total to Pay:</span>
                        <span className="text-2xl font-mono font-bold text-white">${product.price}</span>
                    </div>

                    {/* Payment Method */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {['BTC', 'USDT'].map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`py-3 rounded-xl border font-bold text-sm transition-all ${paymentMethod === method
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-[#13151f] border-gray-700 text-gray-400 hover:bg-gray-800'
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    {/* Wallet Address */}
                    <div className="mb-6 relative group cursor-pointer" onClick={handleCopy}>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Send Exact Amount To:</label>
                        <div className="bg-[#13151f] border border-gray-700 rounded-lg p-3 flex justify-between items-center hover:border-blue-500 transition-colors">
                            <code className="text-xs text-blue-400 truncate mr-2 font-mono">
                                {WALLETS[paymentMethod]}
                            </code>
                            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                        </div>
                        {copied && <span className="absolute -bottom-5 right-0 text-[10px] text-green-500">Copied!</span>}
                    </div>

                    {/* Hash Input */}
                    <form onSubmit={handleSubmit} className="mt-auto">
                        <input
                            type="text"
                            required
                            placeholder="Paste Transaction Hash (TxID)"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            className="w-full bg-[#13151f] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none mb-4 font-mono placeholder-gray-600"
                        />

                        {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || !txHash}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : (
                                <> <CreditCard className="w-5 h-5" /> Confirm Payment </>
                            )}
                        </button>
                    </form>

                </div>

            </div>
        </div>
    );
};

export default PurchaseModal;