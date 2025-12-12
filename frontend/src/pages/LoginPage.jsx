import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, RefreshCw, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground'; // <--- Import optimized bg

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // OPTIMIZATION: Use Refs instead of State for inputs
    // This prevents re-rendering on every keystroke
    const emailRef = useRef();
    const passwordRef = useRef();
    const captchaInputRef = useRef();

    const [showPassword, setShowPassword] = useState(false);
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Generate Captcha (Memoized logic not needed here as it runs once)
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(result);
        if (captchaInputRef.current) captchaInputRef.current.value = '';
    };

    useEffect(() => { generateCaptcha(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const enteredCaptcha = captchaInputRef.current.value.toUpperCase();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // 1. CAPTCHA CHECK
        if (enteredCaptcha !== captchaCode) {
            setError('Incorrect Security Code.');
            captchaInputRef.current.value = '';
            generateCaptcha();
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06070a] flex items-center justify-center relative overflow-hidden text-gray-200">

            {/* ISOLATED BACKGROUND (Zero Lag) */}
            <AnimatedBackground />

            <div className="relative bg-[#0b0c15]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Market Login</h1>
                    <p className="text-gray-400 mt-2 text-sm">Secure Access Terminal</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-xs font-bold border border-red-800/50 text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                <input
                                    ref={emailRef} // <--- Uncontrolled Input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                <input
                                    ref={passwordRef} // <--- Uncontrolled Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-10 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : (
                                <>Enter Dashboard <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    {/* CAPTCHA SECTION */}
                    <div className="flex flex-col justify-center border-l border-gray-800 pl-8 md:block hidden">
                        <div className="bg-[#13151f] p-6 rounded-xl border border-gray-800 text-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Security Verification</label>

                            <div
                                className="relative bg-[#06070a] h-20 rounded-lg border border-gray-700 mb-4 flex items-center justify-center cursor-pointer group select-none"
                                onClick={generateCaptcha}
                            >
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
                                <span className="text-3xl font-mono font-black text-gray-200 tracking-[0.5em] line-through decoration-wavy decoration-blue-600/50 italic transform -rotate-2">
                                    {captchaCode}
                                </span>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                                    <RefreshCw className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <input
                                ref={captchaInputRef} // <--- Uncontrolled Input
                                type="text"
                                placeholder="ENTER CODE"
                                className="w-full text-center py-2 bg-[#06070a] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none uppercase tracking-widest font-bold"
                                maxLength={5}
                            />
                        </div>

                        <div className="mt-8 text-center space-y-3">
                            <Link to="/signup" className="text-sm text-gray-400 hover:text-white underline">Create New Account</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;