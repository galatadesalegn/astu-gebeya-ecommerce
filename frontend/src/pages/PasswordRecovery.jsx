import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordRecovery = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            setMessage({ type: 'success', text: data.message });
            setStep(2);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send recovery code.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/verify-reset-otp`, { email, otp });
            setMessage({ type: 'success', text: data.message });
            setStep(3);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired code.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match.' });
        }
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/reset-password`, { email, otp, password });
            setMessage({ type: 'success', text: data.message });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password.' });
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
                className="w-full max-w-md bg-[var(--bg-card)] rounded-[40px] shadow-2xl p-8 md:p-12 border border-[var(--border-color)] relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-orange-50 rounded-2xl mb-6 shadow-sm border border-orange-100">
                        <KeyRound className="h-8 w-8 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Password Recovery</h1>
                    <p className="text-slate-400 font-medium">
                        {step === 1 && "Enter your email to receive a recovery code."}
                        {step === 2 && "Enter the 6-digit code sent to your email."}
                        {step === 3 && "Set a new secure password for your account."}
                    </p>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mb-6 p-4 rounded-2xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSendOTP}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold shadow-sm"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                disabled={isLoading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                            >
                                {isLoading ? <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Recovery Code"}
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOTP}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Recovery Code</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="text"
                                        maxLength="6"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold tracking-[0.5em] text-center text-xl shadow-sm"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        className="text-[10px] font-black uppercase text-orange-600 hover:text-orange-700 tracking-widest"
                                    >
                                        Resend Code?
                                    </button>
                                </div>
                            </div>
                            <button
                                disabled={isLoading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                            >
                                {isLoading ? <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify Code"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:text-slate-600 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Change Email
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleResetPassword}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="password"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold shadow-sm"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                disabled={isLoading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                            >
                                {isLoading ? <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : "Update Password"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-10 text-center">
                    <Link to="/login" className="text-slate-400 font-bold uppercase tracking-tighter text-sm hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PasswordRecovery;
