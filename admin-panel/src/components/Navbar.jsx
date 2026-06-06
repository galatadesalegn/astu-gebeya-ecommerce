import React, { useContext, useState, useEffect } from 'react';
import { Bell, Search, User as UserIcon, Flag, AlertTriangle, X, ShieldAlert, Sun, Moon } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { admin } = useContext(AdminContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Dynamic data fetch to simulate alerts for flagged items
    const fetchAlerts = async () => {
        try {
            const [chatsRes, productsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/chats`, { headers: { Authorization: `Bearer ${admin.token}` } }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${admin.token}` } })
            ]);

            const flaggedChats = chatsRes.data.filter(c => c.isFlagged).map(c => ({
                id: c._id,
                type: 'CHAT',
                title: 'Flagged Conversation',
                desc: `Suspicious activity between ${c.participants?.[0]?.name || 'Unknown User'} and others`,
                time: new Date(c.updatedAt).toLocaleTimeString(),
                link: '/chats'
            }));

            const pendingProducts = (productsRes.data.products || []).filter(p => p.status === 'pending').map(p => ({
                id: p._id,
                type: 'PRODUCT',
                title: 'New Product Review',
                desc: `${p.title} requires approval`,
                time: new Date(p.createdAt).toLocaleTimeString(),
                link: '/products'
            }));

            const combined = [...flaggedChats, ...pendingProducts].slice(0, 5);
            setNotifications(combined);
            setUnreadCount(combined.length);
        } catch (error) {
            console.error("Alerts fetch error:", error);
        }
    };

    useEffect(() => {
        if (admin?.token) {
            fetchAlerts();
            const interval = setInterval(fetchAlerts, 30000); // 30s poll
            return () => clearInterval(interval);
        }
    }, [admin?.token]);

    return (
        <header className="h-24 bg-[var(--bg-card)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-10 sticky top-0 z-[100] transition-colors duration-300">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for users, products, or signals..."
                        className="w-full bg-[var(--bg-main)] border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold placeholder:text-[var(--text-muted)] text-[var(--text-main)] focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-xl bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className={`relative p-3 rounded-xl transition-all
                            ${showNotifs ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/10'}
                        `}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 border-2 border-[var(--bg-card)] rounded-full text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-[400px] bg-[var(--bg-card)] rounded-[32px] shadow-2xl border border-[var(--border-color)] overflow-hidden z-[110]"
                            >
                                <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert size={18} className="text-orange-500" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[.2em]">Security Pulse</h4>
                                    </div>
                                    <button onClick={() => setShowNotifs(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                                    {notifications.length > 0 ? notifications.map((n) => (
                                        <Link
                                            key={n.id}
                                            to={n.link}
                                            onClick={() => setShowNotifs(false)}
                                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[var(--bg-main)] transition-all border border-transparent hover:border-[var(--border-color)] group"
                                        >
                                            <div className={`p-3 rounded-xl flex-shrink-0 
                                                ${n.type === 'CHAT' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}
                                            `}>
                                                {n.type === 'CHAT' ? <Flag size={16} /> : <AlertTriangle size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h5 className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-tight">{n.title}</h5>
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)]">{n.time}</span>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-muted)] font-medium leading-normal line-clamp-2">{n.desc}</p>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className="p-10 text-center">
                                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">No critical anomalies</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-[var(--bg-main)] border-t border-[var(--border-color)]">
                                    <Link to="/reports" onClick={() => setShowNotifs(false)} className="block w-full text-center py-3 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white rounded-xl transition-all">
                                        View All System Logs
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-10 w-px bg-[var(--border-color)] mx-2"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">{admin?.name}</p>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">{admin?.role} Operator</p>
                    </div>
                    <div className="h-12 w-12 rounded-[20px] bg-orange-100 flex items-center justify-center text-orange-600 border-2 border-orange-200 shadow-lg shadow-orange-500/10 group-hover:rotate-12 transition-transform">
                        <UserIcon size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
