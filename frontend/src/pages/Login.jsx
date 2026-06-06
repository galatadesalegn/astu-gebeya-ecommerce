import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            await login(email, password);


            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser && savedUser.role === 'Seller') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-500">
            
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100/30 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-slate-200/40 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl flex flex-col lg:flex-row rounded-[40px] overflow-hidden bg-[var(--bg-card)] shadow-2xl relative z-10 border border-[var(--border-color)]"
            >
                
                <div className="hidden lg:flex flex-1 bg-[var(--bg-main)] hover:bg-[var(--bg-section-alt)] dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors duration-500 group p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <img
                            src="/hero-bg.png"
                            className="w-full h-full object-cover grayscale"
                            alt="ASTU GEBEYA Background"
                        />
                    </div>
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center space-x-2 mb-12">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Sparkles className="h-6 w-6 text-slate-900" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic transition-colors">ASTU GEBEYA<span className="text-orange-500">.</span></span>
                        </Link>
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6 uppercase tracking-tighter transition-colors">Your Unified <br /><span className="text-orange-500 italic">Marketplace.</span></h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">Access your curation of global products and managed selections.</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-6 mt-12 bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-white/10 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest transition-colors">Atelier Protected</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors">End-to-End Encryption</div>
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 lg:flex-[0.8] p-8 md:p-16 flex flex-col justify-center">
                    <div className="text-center lg:text-left mb-10">
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 font-medium tracking-tight">Login to your account to continue shopping.</p>
                    </div>

                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span>{errorMsg}</span>
                            </div>
                            {errorMsg.includes('verify') && (
                                <Link
                                    to="/register"
                                    state={{ email, triggerOTP: true }}
                                    className="text-orange-600 hover:underline ml-5 text-xs uppercase tracking-widest"
                                >
                                    Verify your email now →
                                </Link>
                            )}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="email"
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold placeholder:text-slate-300 shadow-sm"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-orange-600 hover:text-orange-700">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold placeholder:text-slate-300 shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm">
                            New here? <Link to="/register" className="text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-4 ml-2 uppercase">Create an account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
