import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, loading, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);
        try {
            await updateProfile(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[var(--bg-main)] selection:bg-[#4f46e5] selection:text-white">
            <div className="max-w-4xl mx-auto px-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="inline-flex items-center space-x-2 text-[var(--text-muted)] hover:text-orange-500 transition-colors group mb-8"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-tight text-sm">Back</span>
                </button>
                <div className="mb-12">
                    <h1 className="text-4xl font-syne font-bold text-[#111827] dark:text-white uppercase tracking-tighter mb-2">Account Settings</h1>
                    <p className="text-gray-500 font-jakarta font-medium">Manage your personal information.</p>
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-[40px] border border-gray-100 dark:border-white/10 p-8 md:p-12 shadow-sm">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-50 dark:border-white/5">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-[40px] bg-[#4f46e5] flex items-center justify-center text-4xl font-syne font-black text-white italic shadow-2xl shadow-indigo-500/20">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-syne font-bold text-[#111827] dark:text-white uppercase mb-1">{user.name}</h2>
                                <p className="text-gray-400 font-jakarta font-medium mb-4">{user.email}</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-[#4f46e5] rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">{user.role}</span>
                                    <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1.5">
                                        <CheckCircle className="h-3 w-3" />
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Update Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-jakarta font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] dark:bg-white/5 border-none rounded-2xl font-jakarta font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#4f46e5]/20 transition-all shadow-inner" 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-jakarta font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                        <input 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] dark:bg-white/5 border-none rounded-2xl font-jakarta font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#4f46e5]/20 transition-all shadow-inner" 
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isUpdating}
                                className="px-10 py-5 bg-[#111827] dark:bg-[#4f46e5] text-white rounded-2xl font-jakarta font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 text-xs flex items-center gap-3 disabled:opacity-50"
                            >
                                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isUpdating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;