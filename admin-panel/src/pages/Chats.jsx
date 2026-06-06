import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    MessageSquare,
    Search,
    Flag,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    AlertCircle,
    UserCheck,
    Clock,
    ArrowRight
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

const Chats = () => {
    const { admin } = useContext(AdminContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, flagged

    const fetchChats = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/chats`, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setConversations(data);
        } catch (error) {
            console.error("Chats fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [admin.token]);

    const handleToggleFlag = async (chatId) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/chat/${chatId}/flag`, {}, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setConversations(conversations.map(c => c._id === chatId ? { ...c, isFlagged: data.isFlagged } : c));
        } catch (error) {
            alert("Flag update failed");
        }
    };

    const filteredChats = conversations.filter(c => {
        if (filter === 'flagged') return c.isFlagged;
        return true;
    });

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-b-2"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Safe Communication</h2>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Monitor chats for appropriate behavior</p>
                </div>

                <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${filter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-gray-600'}
                        `}
                    >
                        Active Streams
                    </button>
                    <button
                        onClick={() => setFilter('flagged')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${filter === 'flagged' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-muted)] hover:text-red-500'}
                        `}
                    >
                        Flagged Threats
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                        {filteredChats.map((conv) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key={conv._id}
                                className={`p-10 hover:bg-[var(--bg-main)]/50 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8
                                ${conv.isFlagged ? 'bg-red-50/20' : ''}
                            `}
                            >
                                <div className="flex items-center gap-10 flex-1 min-w-0">
                                    <div className="flex -space-x-5 relative flex-shrink-0">
                                        {conv.participants.map((p, i) => (
                                            <div key={p._id} className={`h-16 w-16 rounded-[24px] border-4 border-white flex items-center justify-center font-black text-[12px] shadow-xl z-${20 - i * 10} relative overflow-hidden
                                            ${i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}
                                        `}>
                                                {p.name?.[0].toUpperCase()}
                                                {p.isVerified && (
                                                    <div className="absolute bottom-0 right-0 bg-[var(--bg-card)] p-0.5 rounded-tl-lg">
                                                        <UserCheck size={12} className="text-emerald-500" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight flex items-center gap-3 mb-1">
                                            <span className="truncate">{conv.participants[0]?.name}</span>
                                            <ArrowRight size={14} className="text-gray-300" />
                                            <span className="truncate text-[var(--text-muted)]">{conv.participants[1]?.name || 'Unknown User'}</span>
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <AlertCircle size={12} />
                                                Target: {conv.product?.title || 'System Inquiry'}
                                            </p>
                                            <span className="h-1 w-1 rounded-full bg-gray-200"></span>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={12} />
                                                Last Active: {new Date(conv.updatedAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 bg-[var(--bg-main)]/80 p-4 rounded-2xl max-w-2xl border border-[var(--border-color)]">
                                            <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2 italic">
                                                "{conv.lastMessage?.text || 'No data transmission yet'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] shadow-sm ml-auto xl:ml-0">
                                    <button
                                        onClick={() => handleToggleFlag(conv._id)}
                                        className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl transition-all group
                                        ${conv.isFlagged ? 'bg-red-500 text-white' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500'}
                                    `}
                                    >
                                        <Flag size={20} className={conv.isFlagged ? 'fill-current' : ''} />
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${conv.isFlagged ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-red-500'}`}>
                                            {conv.isFlagged ? 'Unflag' : 'Flag Thread'}
                                        </span>
                                    </button>

                                    <button className="flex flex-col items-center gap-1.5 px-5 py-3 bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-all group">
                                        <ShieldAlert size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-orange-500">Security Check</span>
                                    </button>

                                    <div className="h-10 w-[1px] bg-[var(--bg-section-alt)] mx-2"></div>

                                    <button className="flex flex-col items-center gap-1.5 px-5 py-3 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group">
                                        <CheckCircle2 size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-widest inherit">Secure Hub</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredChats.length === 0 && (
                        <div className="p-32 text-center">
                            <div className="h-24 w-24 bg-[var(--bg-main)] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-[var(--border-color)] rotate-12">
                                <MessageSquare className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter">No encrypted signals</h3>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-3">The communication channels are currently clear</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Chats;
