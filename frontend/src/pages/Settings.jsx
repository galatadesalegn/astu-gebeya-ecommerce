import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Bell, CreditCard, ArrowRight, Camera, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, loading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
    ];

    if (!user) return null;

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[var(--bg-main)] selection:bg-[#4f46e5] selection:text-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-4xl font-syne font-bold text-[#111827] uppercase tracking-tighter mb-2">Account Settings</h1>
                    <p className="text-gray-500 font-jakarta font-medium">Manage your profile, security, and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-jakarta font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#111827] text-white shadow-xl' : 'text-gray-400 hover:text-[#111827] hover:bg-gray-100'}`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm">
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-50">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-[40px] bg-[#4f46e5] flex items-center justify-center text-4xl font-syne font-black text-white italic shadow-2xl shadow-indigo-500/20">
                                            {user.name.charAt(0)}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-50 text-[#111827] hover:bg-[#4f46e5] hover:text-white transition-all">
                                            <Camera className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-2xl font-syne font-bold text-[#111827] uppercase mb-1">{user.name}</h2>
                                        <p className="text-gray-400 font-jakarta font-medium mb-4">{user.email}</p>
                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                            <span className="px-4 py-1.5 bg-indigo-50 text-[#4f46e5] rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">{user.role}</span>
                                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                                                <CheckCircle className="h-3 w-3" />
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-jakarta font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                                <input type="text" defaultValue={user.name} className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] border-none rounded-2xl font-jakarta font-bold text-[#111827] outline-none focus:ring-2 focus:ring-[#4f46e5]/20 transition-all shadow-inner" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-jakarta font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                                <input type="email" defaultValue={user.email} className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] border-none rounded-2xl font-jakarta font-bold text-[#111827] outline-none focus:ring-2 focus:ring-[#4f46e5]/20 transition-all shadow-inner" />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="px-10 py-4 bg-[#111827] text-white rounded-2xl font-jakarta font-bold uppercase tracking-widest hover:bg-[#4f46e5] transition-all shadow-lg active:scale-95 text-xs">
                                        Save Changes
                                    </button>
                                </form>
                            </motion.div>
                        )}
                        {activeTab !== 'profile' && (
                            <div className="py-20 text-center">
                                <p className="font-syne font-bold text-gray-300 uppercase tracking-widest">Section coming soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;