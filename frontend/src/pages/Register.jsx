import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, ShoppingCart, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Buyer' });
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { register, verifyOTP, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.triggerOTP && location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
            setShowOTP(true);
            setSuccessMsg('Please enter the verification code sent to your email.');
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            setShowOTP(true);
            setSuccessMsg('A 6-digit verification code has been sent to your email.');
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setErrorMsg('Please enter a valid 6-digit code.');
            return;
        }
        setIsLoading(true);
        setErrorMsg('');
        try {
            await verifyOTP(formData.email, otp);
            if (formData.role === 'Seller') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Verification failed. Please check the code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await resendOTP(formData.email);
            setSuccessMsg('A new verification code has been sent.');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to resend code. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-500">
            
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100/30 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-slate-200/40 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8 uppercase tracking-tighter transition-colors">Enter the <br /><span className="text-orange-500 italic">Market.</span></h2>

                        <div className="space-y-6">
                            {[
                                'Exclusive product drops',
                                'Early access to sales',
                                'Curated selections',
                                '24/7 Priority support'
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-300 transition-colors font-bold">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md transition-colors">
                        <p className="text-slate-900 dark:text-white transition-colors italic font-medium leading-relaxed">
                            "The best shopping experience I've had in years. The platform is so intuitive and the products are truly premium."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-500" />
                            <div>
                                <div className="text-slate-900 dark:text-white transition-colors text-xs font-black">Alex Rivera</div>
                                <div className="text-slate-500 dark:text-slate-400 transition-colors text-[10px] font-bold uppercase tracking-widest">Premium Member</div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 lg:flex-[0.8] p-8 md:p-16 flex flex-col justify-center">
                    {!showOTP ? (
                        <>
                            <div className="text-center lg:text-left mb-8">
                                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
                                <p className="text-slate-400 font-medium tracking-tight">Sign up to get started with your shopping journey.</p>
                            </div>

                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
                                >
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    {errorMsg}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold placeholder:text-slate-300 shadow-sm"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Join as</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Buyer' })}
                                            className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.role === 'Buyer' ? 'border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-card)] shadow-lg' : 'border-[var(--border-color)] text-[var(--text-main)] opacity-50 hover:opacity-100'}`}
                                        >
                                            Buyer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Seller' })}
                                            className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.role === 'Seller' ? 'border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-card)] shadow-lg' : 'border-[var(--border-color)] text-[var(--text-main)] opacity-50 hover:opacity-100'}`}
                                        >
                                            Seller
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                        <input
                                            type="email"
                                            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold placeholder:text-slate-300 shadow-sm"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                        <input
                                            type="password"
                                            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-[var(--text-main)] font-bold placeholder:text-slate-300 shadow-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                            Register
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm">
                                    Already a member? <Link to="/login" className="text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-4 ml-2 uppercase">Login now</Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full"
                        >
                            <div className="text-center lg:text-left mb-8">
                                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Verify Email</h1>
                                <p className="text-slate-400 font-medium tracking-tight">Enter the 6-digit code sent to <span className="text-slate-900 font-bold">{formData.email}</span></p>
                            </div>

                            {errorMsg && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    {errorMsg}
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm font-bold flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Verification Code</label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        className="w-full text-center text-4xl tracking-[20px] font-black py-6 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition text-slate-900 placeholder:text-slate-100 shadow-sm"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Verify Code
                                            <CheckCircle className="h-5 w-5" />
                                        </>
                                    )}
                                </motion.button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-colors disabled:opacity-50"
                                    >
                                        {isResending ? 'Resending...' : "Didn't receive code? Resend"}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowOTP(false)}
                                        className="text-orange-600 font-black uppercase tracking-widest text-[10px] hover:text-orange-700 transition-colors"
                                    >
                                        Back to Registration
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

