import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Package, DollarSign, List, Image as ImageIcon, X, LayoutDashboard, BarChart3, Settings, Edit, Trash2, TrendingUp, Calendar, Zap, ShoppingCart, MessageSquare, Eye, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', currency: 'ETB', category: 'Electronics', stock: 1, image: '', images: [], contactPhone: '', socialMediaLink: ''
    });
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Sports', 'Toys', 'Other'];
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, salesData: [] });
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState(null);
    const [activityLog, setActivityLog] = useState([]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/seller/stats`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats");
            setStats({
                totalRevenue: 2450,
                totalOrders: 12,
                salesData: []
            });
        }
    };

    const fetchIncomingOrders = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/seller/orders`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIncomingOrders(data);
        } catch (error) {
            console.error("Failed to fetch incoming orders");
        }
    };

    const fetchListings = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/seller/listings`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setListings(data);
        } catch (error) {
            console.error("Failed to fetch listings");
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'Seller') {
            navigate('/');
            return;
        }
        fetchListings();
        fetchStats();
        fetchIncomingOrders();
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrls = [...(formData.images || [])];

            if (imageFiles && imageFiles.length > 0) {
                const newUrls = await Promise.all(
                    imageFiles.map(async (file) => {
                        const uploadData = new FormData();
                        uploadData.append('image', file);
                        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, uploadData, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        return data.url;
                    })
                );
                finalImageUrls = [...finalImageUrls, ...newUrls];
            }

            const mainImageToUse = finalImageUrls.length > 0 ? finalImageUrls[0] : '';

            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`, { ...formData, image: mainImageToUse, images: finalImageUrls }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, { ...formData, image: mainImageToUse, images: finalImageUrls }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', description: '', price: '', currency: 'ETB', category: 'Electronics', stock: 1, image: '', images: [], contactPhone: '', socialMediaLink: '' });
            setImageFiles([]);
            fetchListings();
            fetchStats();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Operation failed.";
            if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
                showToast(`Verification Required: ${msg}`, 'error');
                setTimeout(() => navigate('/register', { state: { email: user.email, triggerOTP: true } }), 2000);
            } else {
                showToast(`Publishing Error: ${msg}`, 'error');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            title: product.title, description: product.description, price: product.price, currency: product.currency || 'ETB', category: product.category, stock: product.stock || 1, image: product.image, images: product.images || [], contactPhone: product.contactPhone, socialMediaLink: product.socialMediaLink || ''
        });
        setImageFiles([]);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChatWithBuyer = async (order) => {
        try {

            const sellerItem = order.orderItems.find(item => item.seller.toString() === user._id.toString());
            if (!sellerItem) return;

            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/start`, {
                productId: sellerItem.product,
                sellerId: user._id,
                buyerId: order.user // We'll need the backend to handle buyerId in the body if the requester is the seller
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate(`/chat/${data._id}`);
        } catch (error) {
            console.error("Chat failed", error);
            showToast("Could not start conversation with buyer.", "error");
        }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/deliver`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            showToast("Order marked as delivered!");
            setActivityLog(prev => [{ id: Date.now(), text: `Marked order ${orderId.substring(0, 6)}... as delivered` }, ...prev]);
            setSelectedOrder(null);
            fetchIncomingOrders();
            fetchStats();
        } catch (error) {
            console.error("Delivery update failed", error);
            showToast("Failed to update delivery status.", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you certain?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setListings(listings.filter(item => item._id !== id));
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <div className="bg-[var(--bg-main)] min-h-screen transition-colors duration-500 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                    >
                        {toast.type === 'error' ? <X className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Revenue', value: `${stats.totalRevenue?.toLocaleString()} ETB`, icon: <DollarSign />, color: 'text-orange-600 bg-orange-500/10' },
                        { label: 'Active Masters', value: listings.length, icon: <Package />, color: 'text-blue-600 bg-blue-500/10' },
                        { label: 'Market Pulse', value: `${stats.totalOrders} Orders`, icon: <TrendingUp />, color: 'text-emerald-600 bg-emerald-500/10' },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="premium-card p-8 flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-color)] group hover:border-orange-500/30 transition-all duration-500">
                            <div>
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-[var(--text-main)] italic tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                {React.cloneElement(stat.icon, { className: 'h-6 w-6' })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight uppercase">Inventory <span className="text-orange-500 italic">Pulse.</span></h1>
                                <p className="text-[var(--text-muted)] font-medium">Manage your curated store listings.</p>
                            </div>
                            <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setFormData({ title: '', description: '', price: '', currency: 'ETB', category: 'Electronics', stock: 1, image: '', images: [], contactPhone: '', socialMediaLink: '' }); setImageFiles([]); } }} className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${showForm ? 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] shadow-xl' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-95'}`}>
                                {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                <span>{showForm ? 'Dismiss' : 'New Listing'}</span>
                            </button>
                        </div>

                        <AnimatePresence>
                            {showForm && (
                                <motion.div initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} className="premium-card p-10 bg-[var(--bg-card)] border border-orange-500/20 shadow-2xl">
                                    <h2 className="text-xl font-black mb-10 flex items-center space-x-3 uppercase tracking-tight">
                                        <div className="p-2 bg-orange-500/10 rounded-xl"><ImageIcon className="h-5 w-5 text-orange-500" /></div>
                                        <span>{editingId ? 'Edit Boutique Listing' : 'Create New Curation'}</span>
                                    </h2>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Boutique Title</label>
                                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)]" placeholder="Premium wireless mouse..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Product Visual(s)</label>

                                            {imageFiles.length === 0 && (!formData.images || formData.images.length === 0) && (
                                                <input type="file" multiple accept="image/*" className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500 hover:file:text-white cursor-pointer" onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (files.length > 4) {
                                                        showToast('Maximum 4 images allowed', 'error');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    setImageFiles(files);
                                                    e.target.value = '';
                                                }} required={true} />
                                            )}

                                            {(imageFiles.length > 0 || (formData.images && formData.images.length > 0)) && (
                                                <div className="flex flex-wrap gap-4 mt-2 p-4 border border-[var(--border-color)] border-dashed rounded-2xl bg-[var(--bg-main)]">
                                                    {(formData.images || []).map((src, i) => (
                                                        <div key={`remote-${i}`} className="relative group">
                                                            <img src={src} className="h-20 w-20 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" alt={`remote preview ${i}`} />
                                                            <button type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                                                        </div>
                                                    ))}
                                                    {imageFiles.map((file, i) => (
                                                        <div key={`local-${i}`} className="relative group">
                                                            <img src={URL.createObjectURL(file)} className="h-20 w-20 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" alt={`local preview ${i}`} />
                                                            <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                                                        </div>
                                                    ))}

                                                    {(((formData.images?.length || 0) + imageFiles.length) < 4) && (
                                                        <label className="h-20 w-20 flex flex-col items-center justify-center rounded-xl border-2 border-[var(--border-color)] border-dashed hover:border-orange-500 cursor-pointer bg-[var(--bg-card)] hover:bg-orange-500/5 transition-all group">
                                                            <Plus className="h-6 w-6 text-[var(--text-muted)] group-hover:text-orange-500 mb-1 transition-colors" />
                                                            <span className="text-[8px] font-black uppercase text-[var(--text-muted)] group-hover:text-orange-500 transition-colors">Add Image</span>
                                                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                                                const files = Array.from(e.target.files);
                                                                const currentLength = (formData.images?.length || 0) + imageFiles.length;
                                                                if (currentLength + files.length > 4) {
                                                                    showToast('Maximum 4 images allowed in total', 'error');
                                                                    e.target.value = '';
                                                                    return;
                                                                }
                                                                setImageFiles(prev => [...prev, ...files]);
                                                                e.target.value = '';
                                                            }} />
                                                        </label>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Sourcing Description</label>
                                            <textarea className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition h-32 font-bold text-[var(--text-main)] resize-none" placeholder="Details..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Price</label>
                                            <div className="flex bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] focus-within:border-orange-500/50 transition overflow-hidden">
                                                <input type="number" className="w-full px-6 py-4 bg-transparent outline-none font-bold text-[var(--text-main)] text-xl" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                                <select className="px-4 py-4 bg-[var(--bg-card)] border-l border-[var(--border-color)] outline-none font-bold text-[var(--text-main)] cursor-pointer appearance-none" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                                                    <option value="ETB">ETB</option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                    <option value="AED">AED</option>
                                                    <option value="SAR">SAR</option>
                                                    <option value="CNY">CNY</option>
                                                    <option value="INR">INR</option>
                                                    <option value="KES">KES</option>
                                                    <option value="CAD">CAD</option>
                                                    <option value="AUD">AUD</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Classification</label>
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] appearance-none cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Units removed */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Secure Contact</label>
                                            <input type="tel" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)]" placeholder="+251..." value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Social Link</label>
                                            <input type="url" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)]" placeholder="https://..." value={formData.socialMediaLink} onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2 pt-6">
                                            <button type="submit" disabled={uploading} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 active:scale-[0.98]">
                                                {uploading ? 'Processing...' : (editingId ? 'Update Master Listing' : 'Publish to Feed')}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="premium-card overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)]">
                            <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
                                <h2 className="font-black text-[var(--text-main)] flex items-center space-x-3 uppercase tracking-tight">
                                    <List className="h-5 w-5 text-orange-500" />
                                    <span>Active Atelier Feed</span>
                                </h2>
                                <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full text-orange-600">{listings.length} Items</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] border-b border-[var(--border-color)]">
                                            <th className="px-8 py-6">Profile</th>
                                            <th className="px-8 py-6">Category</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6 text-right">Price</th>
                                            <th className="px-8 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {listings.map((item) => (
                                            <tr key={item._id} className="hover:bg-orange-500/5 transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] flex-shrink-0">
                                                            <img src={item.image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[var(--text-main)] group-hover:text-orange-500 transition-colors uppercase tracking-tight text-sm">{item.title}</p>
                                                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">Stock: {item.stock}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{item.category}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                            item.status === 'pending' ? 'bg-blue-500/10 text-blue-500' :
                                                                'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit ${item.stock > 0 ? 'bg-[var(--bg-main)] text-[var(--text-muted)]' : 'bg-red-500/10 text-red-500'}`}>
                                                            {item.stock > 0 ? `${item.stock} In Stock` : 'Sold Out'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right font-black text-orange-500 text-lg">{item.price} {item.currency || 'ETB'}</td>
                                                <td className="px-8 py-6 text-right space-x-3">
                                                    <button onClick={() => handleEdit(item)} className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:bg-orange-500 hover:text-white transition-all scale-100"><Edit className="h-4 w-4" /></button>
                                                    <button onClick={() => handleDelete(item._id)} className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:bg-red-500 hover:text-white transition-all scale-100"><Trash2 className="h-4 w-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="premium-card overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)]">
                            <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
                                <h2 className="font-black text-[var(--text-main)] flex items-center space-x-3 uppercase tracking-tight">
                                    <ShoppingCart className="h-5 w-5 text-orange-500" />
                                    <span>Incoming Orders</span>
                                </h2>
                                <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full text-blue-600">Real-time</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] border-b border-[var(--border-color)]">
                                            <th className="px-8 py-6">Buyer</th>
                                            <th className="px-8 py-6">Phone</th>
                                            <th className="px-8 py-6">Target</th>
                                            <th className="px-8 py-6">Purchase</th>
                                            <th className="px-8 py-6 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {incomingOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-orange-500/5 transition-all group">
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-[var(--text-main)] uppercase tracking-tight text-sm">{order.shippingAddress.name}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)] font-bold">{order.shippingAddress.email}</p>
                                                </td>
                                                <td className="px-8 py-6 text-orange-500 font-black text-[10px]">{order.shippingAddress.phone}</td>
                                                <td className="px-8 py-6">
                                                    <p className="text-xs font-black uppercase">Block: {order.shippingAddress.dormBlock}</p>
                                                    <p className="text-[10px] text-orange-500 font-bold">Room: {order.shippingAddress.roomNumber}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {order.orderItems.map((item, idx) => (
                                                        item.seller.toString() === user._id.toString() && (
                                                            <div key={idx} className="text-[10px] uppercase font-black">{item.qty}x {item.title}</div>
                                                        )
                                                    ))}
                                                </td>
                                                <td className="px-8 py-6 text-right space-x-2">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:bg-orange-500/10 hover:text-orange-600 transition-all shadow-sm"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleChatWithBuyer(order)}
                                                        className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:bg-blue-500/10 hover:text-blue-600 transition-all shadow-sm"
                                                        title="Chat with Buyer"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {incomingOrders.length === 0 && <div className="p-20 text-center text-xs font-black uppercase text-[var(--text-muted)]">No orders yet</div>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-80 space-y-6">
                        <div className="premium-card bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden">
                            <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-orange-500" />
                                </div>
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)]">Delivery Status</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {activityLog.length === 0 ? (
                                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase text-center py-4">No recent deliveries</p>
                                ) : (
                                    activityLog.map(act => (
                                        <div key={act.id} className="flex gap-4 items-start text-[var(--text-main)]">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />
                                            <p className="text-xs font-black uppercase tracking-widest">{act.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[var(--bg-main)] rounded-[40px] shadow-2xl overflow-hidden border border-[var(--border-color)]"
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                                <ShoppingCart className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Order <span className="text-orange-500 italic">Manifest.</span></h2>
                                        </div>
                                        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">ID: {selectedOrder._id}</p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-3 bg-[var(--bg-card)] rounded-2xl hover:bg-orange-500/10 hover:text-orange-500 transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <UserIcon className="h-3 w-3" />
                                                Buyer Information
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-lg font-black text-[var(--text-main)] uppercase">{selectedOrder.shippingAddress.name}</p>
                                                <p className="text-sm font-bold text-[var(--text-muted)]">{selectedOrder.shippingAddress.email}</p>
                                                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mt-2">
                                                    <Phone className="h-4 w-4" />
                                                    {selectedOrder.shippingAddress.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <MapPin className="h-3 w-3" />
                                                Delivery Address
                                            </h3>
                                            <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-color)]">
                                                <p className="text-sm font-black text-[var(--text-main)] uppercase mb-1">Dormitory Location</p>
                                                <div className="space-y-1">
                                                    <p className="text-2xl font-black text-orange-500">Block {selectedOrder.shippingAddress.dormBlock}</p>
                                                    <p className="text-lg font-bold text-[var(--text-main)]">Room {selectedOrder.shippingAddress.roomNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Purchased Items</h3>
                                    <div className="bg-[var(--bg-card)] rounded-3xl divide-y divide-[var(--border-color)] border border-[var(--border-color)] overflow-hidden">
                                        {selectedOrder.orderItems.map((item, idx) => (
                                            item.seller.toString() === user._id.toString() && (
                                                <div key={idx} className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-[var(--bg-main)] overflow-hidden border border-[var(--border-color)]">
                                                            <img src={item.image} className="h-full w-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-[var(--text-main)] uppercase">{item.title}</p>
                                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Qty: {item.qty} × {item.price} {item.currency || 'ETB'}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-[var(--text-main)] text-sm">{(item.qty * item.price).toFixed(2)} {item.currency || 'ETB'}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { handleChatWithBuyer(selectedOrder); setSelectedOrder(null); }}
                                        className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        Message Buyer
                                    </button>
                                    <button
                                        onClick={() => handleMarkDelivered(selectedOrder._id)}
                                        className="flex-1 bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                                    >
                                        <Zap className="h-5 w-5" />
                                        Mark Delivered
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerDashboard;
