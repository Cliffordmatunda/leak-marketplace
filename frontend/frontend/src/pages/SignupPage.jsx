import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, RefreshCw, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import AnimatedBackground from '../components/AnimatedBackground';

const SignupPage = () => {
    const navigate = useNavigate();

    // REFS (No re-renders while typing)
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const captchaInputRef = useRef();

    const [showPassword, setShowPassword] = useState(false);
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        if (enteredCaptcha !== captchaCode) {
            setError('Invalid Security Code');
            generateCaptcha();
            return;
        }

        // Gather data from refs
        const formData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            passwordConfirm: confirmRef.current.value
        };

        setIsLoading(true);

        try {
            await api.post('/users/signup', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06070a] flex items-center justify-center relative overflow-hidden text-gray-200">

            <AnimatedBackground />

            <div className="relative bg-[#0b0c15]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-gray-400 mt-2 text-sm">Join the network</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-xs font-bold border border-red-800/50 text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                <input
                                    ref={nameRef}
                                    required
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                <input
                                    ref={emailRef}
                                    required
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                    <input
                                        ref={passwordRef}
                                        required
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-4 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-600 group-focus-within:text-blue-500" />
                                    <input
                                        ref={confirmRef}
                                        required
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-4 py-2 bg-[#13151f] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : (
                                <>Register Account <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col justify-center border-l border-gray-800 pl-8 md:block hidden">
                        <div className="bg-[#13151f] p-6 rounded-xl border border-gray-800 text-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Human Verification</label>

                            <div
                                className="relative bg-[#06070a] h-20 rounded-lg border border-gray-700 mb-4 flex items-center justify-center cursor-pointer group select-none"
                                onClick={generateCaptcha}
                            >
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
                                <span className="text-3xl font-mono font-black text-gray-200 tracking-[0.5em] line-through decoration-wavy decoration-blue-600/50 italic transform rotate-3">
                                    {captchaCode}
                                </span>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                                    <RefreshCw className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <input
                                ref={captchaInputRef}
                                type="text"
                                placeholder="ENTER CODE"
                                className="w-full text-center py-2 bg-[#06070a] border border-gray-700 rounded-lg focus:border-blue-500 text-white outline-none uppercase tracking-widest font-bold"
                                maxLength={5}
                            />
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-gray-400 mb-4 text-sm">Already verified?</p>
                            <Link to="/login" className="w-full border border-gray-600 text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors block">
                                Log In Here
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;