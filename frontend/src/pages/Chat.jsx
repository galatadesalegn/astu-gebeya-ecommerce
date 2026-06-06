import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, User as UserIcon, ArrowLeft, MoreHorizontal, ShoppingBag, Edit, Trash2, X } from 'lucide-react';

// Socket will be created when Chat mounts to avoid global connections

const ChatInterface = () => {
    const { conversationId } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editText, setEditText] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const scrollRef = useRef();
    const socketRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${conversationId}/messages`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMessages(data);
            } catch (error) {
                console.error("Chat backend error.");
            }
        };

        const fetchConversation = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const current = data.find(c => c._id === conversationId);
                setConversation(current);
            } catch (error) {
                console.error("Conversation fetch error.");
            }
        };

        if (user) {
            // initialize socket when chat mounts
            if (!socketRef.current) {
                socketRef.current = io(import.meta.env.VITE_BACKEND_URL);
            }

            fetchMessages();
            fetchConversation();
            socketRef.current.emit('join_room', conversationId);

            axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${conversationId}/read`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).catch(err => console.error("Failed to mark as read", err));

            socketRef.current.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            socketRef.current.on('message_edited', (data) => {
                setMessages((prev) => prev.map(m => m._id === data.messageId ? { ...m, text: data.text, isEdited: true } : m));
            });

            socketRef.current.on('message_deleted', (data) => {
                setMessages((prev) => prev.filter(m => m._id !== data.messageId));
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('receive_message');
                socketRef.current.off('message_edited');
                socketRef.current.off('message_deleted');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [conversationId, user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
                conversationId,
                text: newMessage,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            socketRef.current?.emit('send_message', { ...data, room: conversationId });
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditMessage = async (e) => {
        e.preventDefault();
        if (!editText.trim() || !editingMessage) return;

        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message/edit`, {
                messageId: editingMessage._id,
                text: editText,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            socketRef.current?.emit('edit_message', { room: conversationId, messageId: editingMessage._id, text: editText });
            setEditingMessage(null);
            setEditText('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message/${messageId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            socketRef.current?.emit('delete_message', { room: conversationId, messageId });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteConversation = async () => {
        if (!window.confirm("Delete this entire conversation? This cannot be undone.")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${conversationId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate('/inbox');
        } catch (error) {
            console.error(error);
        }
    };

    const otherMember = conversation?.participants.find(p => p._id !== user?._id);

    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 transition-colors duration-500">
            <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-[var(--bg-card)] premium-shadow rounded-[32px] overflow-hidden border border-[var(--border-color)]">

                <div className="px-8 py-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-orange-500/10 rounded-full transition">
                            <ArrowLeft className="h-5 w-5 text-[var(--text-muted)]" />
                        </Link>
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-orange-500" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-[var(--bg-card)] rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-black text-[var(--text-main)] tracking-tight uppercase">{otherMember?.name || 'Loading...'}</h2>
                            <p className="text-[10px] text-green-500 font-extrabold uppercase tracking-widest">Active Now</p>
                        </div>
                    </div>

                    {conversation?.product && (
                        <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-[var(--border-color)]">
                            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-[var(--border-color)]">
                                <img src={conversation.product.image} className="h-full w-full object-cover" alt="" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[var(--text-main)] truncate max-w-[120px]">{conversation.product.title}</p>
                                <p className="text-[10px] font-black text-orange-600">${conversation.product.price}</p>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <button onClick={() => setShowOptions(!showOptions)} className="p-2 hover:bg-orange-500/10 rounded-full transition">
                            <MoreHorizontal className="h-5 w-5 text-[var(--text-muted)]" />
                        </button>
                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl py-2 z-50">
                                <button
                                    onClick={() => { handleDeleteConversation(); setShowOptions(false); }}
                                    className="w-full text-left px-4 py-3 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition"
                                >
                                    Delete Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f0e0c0] dark:bg-[#1a1614] scroll-smooth">
                    {messages.map((msg, index) => (
                        <div
                            key={msg._id || index}
                            className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col ${msg.sender === user._id ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                <div
                                    className={`group relative px-6 py-4 rounded-[28px] shadow-sm transition-all ${msg.sender === user._id
                                        ? 'bg-[#8c5638] text-white rounded-br-none'
                                        : 'bg-white dark:bg-[#2a2421] text-[var(--text-main)] rounded-bl-none border border-[#d2b48c] dark:border-[#3e3430]'
                                        }`}
                                >
                                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>

                                    {msg.sender === user._id && (
                                        <div className="absolute top-2 right-full mr-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                                            <button
                                                onClick={() => { setEditingMessage(msg); setEditText(msg.text); }}
                                                className="p-1.5 bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-orange-500 rounded-lg border border-[var(--border-color)] shadow-sm transition"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="p-1.5 bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-red-500 rounded-lg border border-[var(--border-color)] shadow-sm transition"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={`flex items-center gap-2 mt-1.5 px-2 ${msg.sender === user._id ? 'justify-end text-[#8c5638]' : 'justify-start text-[var(--text-muted)]'}`}>
                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {msg.isEdited && <span className="text-[9px] font-black uppercase tracking-widest italic opacity-50">• Edited</span>}
                                    {msg.sender === user._id && msg.isRead && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 opacity-60">• Read</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>


                <div className="p-6 bg-[var(--bg-card)] border-t border-[var(--border-color)]">
                    {editingMessage ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between px-4 py-2 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Editing Message</p>
                                <button onClick={() => { setEditingMessage(null); setEditText(''); }} className="text-[10px] font-black text-orange-600 uppercase hover:underline">Cancel</button>
                            </div>
                            <form onSubmit={handleEditMessage} className="flex gap-4 items-center bg-[var(--bg-main)] p-2 pl-6 rounded-full border border-orange-500/30 shadow-lg shadow-orange-500/5">
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent py-2.5 outline-none text-sm font-bold text-[var(--text-main)]"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="bg-orange-500 text-white p-3 rounded-full shadow-lg"><Send className="h-4 w-4" /></button>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-[var(--bg-main)] p-2 pl-6 rounded-full group focus-within:ring-2 focus-within:ring-orange-500/50 transition-all border border-[var(--border-color)]">
                            <input
                                type="text"
                                placeholder="Message..."
                                className="flex-1 bg-transparent py-2.5 outline-none text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition shadow-lg"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
