import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    LockKeyhole,
    XCircle
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useContext(AdminContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row items-stretch overflow-hidden">
            {/* Left Column: Brand & Security */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-20 relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="z-10 text-center"
                >
                    <div className="h-24 w-24 min-w-24 overflow-hidden rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/50 mb-12 border border-white/20">
                        <img src="/astu-gebeya.jpg" alt="Astu Gebeya Logo" className="h-full w-full object-cover" />
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-widest uppercase mb-4">Central</h1>
                    <p className="text-orange-500 font-extrabold uppercase tracking-[.5em] text-xs">ASTU GEBEYA | Command & Control</p>
                    <div className="mt-16 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="bg-[var(--bg-card)]/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <LockKeyhole className="text-orange-500 mb-3 mx-auto" />
                            <p className="text-[10px] font-black uppercase text-white tracking-widest leading-relaxed">Encrypted Access</p>
                        </div>
                        <div className="bg-[var(--bg-card)]/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <ShieldCheck className="text-orange-500 mb-3 mx-auto" />
                            <p className="text-[10px] font-black uppercase text-white tracking-widest leading-relaxed">Admin Only</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none mb-4">Hello Administrator.</h2>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Enter your restricted credentials to proceed</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs">
                            <XCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                    placeholder="admin@astugebeya.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 active:scale-95 hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    Enter Command Portal
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                <p className="mt-12 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">
                    Authorized Access Only — Security System Online
                </p>
            </div>
        </div>
    );
};

export default Login;
