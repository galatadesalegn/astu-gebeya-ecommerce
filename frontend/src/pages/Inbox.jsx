import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, ArrowRight, User as UserIcon, Clock, Trash2, ShieldCheck, MailOpen } from 'lucide-react';

const Inbox = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });


            setConversations(data);
        } catch (error) {
            console.error("Failed to fetch conversations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConversations();
    }, [user, navigate]);

    const handleDeleteConversation = async (e, id) => {
        e.preventDefault(); // Prevent navigating to chat
        e.stopPropagation();
        if (!window.confirm("Delete this conversation?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setConversations(conversations.filter(c => c._id !== id));
        } catch (error) {
            console.error("Delete failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-b-2"></div>
        </div>
    );

    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight mb-2 uppercase">Messages</h1>
                        <p className="text-[var(--text-muted)] font-medium">Manage your conversations with buyers and sellers.</p>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] rounded-[32px] premium-shadow border border-[var(--border-color)] overflow-hidden">
                    {conversations.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="h-20 w-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="h-8 w-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--text-main)] mb-2 uppercase">No messages yet</h3>
                            <p className="text-[var(--text-muted)] font-medium">When you contact a seller or a buyer contacts you, messages will appear here.</p>
                            <Link to="/" className="mt-8 btn-primary px-8 py-3">Browse Products</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-color)]">
                            {conversations.map((conv, i) => {
                                const otherUser = conv.participants.find(p => p._id !== user._id);
                                return (
                                    <div className="relative group">
                                        <Link
                                            to={`/chat/${conv._id}`}
                                            key={conv._id}
                                            className="p-6 md:p-8 flex items-center gap-6 hover:bg-orange-500/5 transition-all group/item"
                                        >
                                            <div className="h-16 w-16 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                                <UserIcon className="h-8 w-8 text-[var(--text-muted)] group-hover/item:text-orange-500 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-lg font-black text-[var(--text-main)] truncate uppercase tracking-tight group-hover/item:text-orange-500 transition-colors">
                                                        {otherUser?.name || 'Unknown User'}
                                                    </h3>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-[var(--text-muted)] flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded text-[10px] uppercase font-black tracking-widest">
                                                        {otherUser?.role || 'User'}
                                                    </span>
                                                    <span className="truncate italic opacity-70">
                                                        {conv.lastMessage?.text ? `"${conv.lastMessage.text}"` : `Regarding: ${conv.product?.title || 'Product'}`}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => handleDeleteConversation(e, conv._id)}
                                                    className="h-10 w-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all opacity-0 group-hover/item:opacity-100 shadow-sm"
                                                    title="Delete Conversation"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <div className="h-10 w-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center group-hover/item:bg-orange-500 group-hover/item:text-white group-hover/item:border-orange-500 transition-all text-[var(--text-muted)] shadow-sm">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
