import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    Trash2,
    ShoppingBag
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';

const Products = () => {
    const { admin } = useContext(AdminContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/api/admin/products');
                setProducts(data.products || []);
            } catch (error) {
                console.error("Products fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (admin?.token) {
            fetchProducts();
        }
    }, [admin?.token]);

    const handleStatusUpdate = async (productId, status) => {
        try {
            await api.put(`/api/admin/product/${productId}/status`, { status });
            setProducts(products.map(p => p._id === productId ? { ...p, status } : p));
        } catch (error) {
            alert("Status update failed");
        }
    };

    const handleProductDelete = async (productId) => {
        if (!window.confirm('Delete this product permanently?')) return;
        try {
            await api.delete(`/api/admin/product/${productId}`);
            setProducts(products.filter(p => p._id !== productId));
        } catch (error) {
            console.error('Delete product error:', error);
            alert('Product deletion failed');
        }
    };

    const filteredProducts = products.filter(p => filter === 'all' || p.status === filter);

    if (loading) return <div>Loading...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Product Registry</h2>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Approve uploads and monitor inventory</p>
                </div>
                <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-2xl">
                    {['all', 'pending', 'approved', 'rejected'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${filter === type ? 'bg-orange-500 text-white' : 'text-[var(--text-muted)] hover:text-gray-600'}
                            `}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                    <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="admin-card overflow-hidden flex flex-col"
                    >
                        <div className="relative h-64 bg-[var(--bg-main)]">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl
                                    ${product.status === 'approved' ? 'bg-emerald-500 text-white' :
                                        product.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}
                                `}>
                                    {product.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter leading-none mb-1">{product.title}</h3>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{product.category}</p>
                                </div>
                                <p className="text-xl font-black text-orange-500">${product.price}</p>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] font-medium line-clamp-2 mb-6">{product.description}</p>

                            <div className="flex items-center gap-3 mb-8 pt-6 border-t border-[var(--border-color)]">
                                <div className="h-8 w-8 rounded-full bg-[var(--bg-section-alt)] flex items-center justify-center text-[10px] font-black">
                                    {product.seller?.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-main)] uppercase">Seller: {product.seller?.name}</p>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)]">{product.seller?.email}</p>
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-4">
                                {product.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(product._id, 'approved')}
                                            className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <CheckCircle2 size={14} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(product._id, 'rejected')}
                                            className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                        >
                                            <XCircle size={14} />
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(product._id, 'pending')}
                                        className="col-span-2 flex items-center justify-center gap-2 bg-[var(--bg-section-alt)] text-[var(--text-muted)] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        <AlertCircle size={14} />
                                        Reset to Pending
                                    </button>
                                )}
                                <button
                                    onClick={() => handleProductDelete(product._id)}
                                    className="col-span-2 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    <Trash2 size={14} />
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Products;
