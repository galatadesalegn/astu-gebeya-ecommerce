import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, ShieldCheck, Truck, Headphones, ShoppingCart, ArrowLeft, MessageSquare, ChevronRight, Zap, Phone, Link as LinkIcon, Lock } from 'lucide-react';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [mainImage, setMainImage] = useState('');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
                setMainImage(data.image);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleInquiry = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await api.post(`/api/chat/start`, {
                productId: product._id,
                sellerId: product.seller
            });
            navigate(`/chat/${data._id}`);
        } catch (error) {
            console.error(error);
            showToast("Could not start conversation with seller.", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-b-2"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-6">
            <h2 className="text-3xl font-black">Product Not Found</h2>
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
    );

    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-32 pb-32 transition-colors duration-500 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                    >
                        {toast.type === 'error' ? <div className="h-5 w-5 bg-white text-red-500 rounded-full flex justify-center items-center text-xs font-black">X</div> : <ShieldCheck className="h-5 w-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-12">
                    <Link to="/" className="hover:text-slate-900 transition">Store</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-900">{product.category}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative aspect-square rounded-[40px] overflow-hidden bg-[var(--bg-card)] premium-shadow group border border-[var(--border-color)] cursor-crosshair mb-6">
                            <img src={mainImage} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-125" alt={product.title} />
                        </div>
                        {(() => {
                            const allImages = [product.image, ...(product.images || [])].filter((val, index, self) => self.indexOf(val) === index && val);
                            if (allImages.length > 1) {
                                return (
                                    <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x pb-4 custom-scrollbar">
                                        {allImages.map((img, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setMainImage(img)}
                                                onMouseEnter={() => setMainImage(img)}
                                                className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-[var(--bg-card)] border-2 overflow-hidden cursor-pointer transition-all duration-300 snap-start ${mainImage === img ? 'border-orange-500 shadow-lg shadow-orange-500/30 scale-105 opacity-100' : 'border-[var(--border-color)] opacity-60 hover:opacity-100 hover:border-orange-300'}`}
                                            >
                                                <img src={img} className="h-full w-full object-cover" alt={`${product.title} view ${i + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">In Stock</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                                <span className="text-sm font-black text-slate-900">{product.rating}</span>
                                <span className="text-slate-400 text-sm font-medium">({product.reviews} Reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">{product.title}</h1>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">{product.description}</p>

                        <div className="text-5xl font-black text-slate-900 mb-10">
                            {product.price} {product.currency || 'ETB'}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-slate-100 text-slate-900 py-5 flex items-center justify-center gap-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all active:scale-95 border border-[var(--border-color)]"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Bag
                            </button>
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    navigate('/checkout');
                                }}
                                className="flex-1 bg-orange-500 text-white py-5 flex items-center justify-center gap-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                            >
                                <Zap className="h-5 w-5" />
                                Order Now
                            </button>
                            <button
                                onClick={handleInquiry}
                                className="px-8 py-5 border-2 border-slate-900 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                            >
                                <MessageSquare className="h-5 w-5" />
                                Chat with Seller
                            </button>
                        </div>


                        <div className="mb-12 p-6 rounded-[24px] bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-4 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Seller Contact Info</h3>
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Phone className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Phone</p>
                                            <p className="font-bold">{product.contactPhone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    {product.socialMediaLink && (
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <LinkIcon className="h-4 w-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Media</p>
                                                <a href={product.socialMediaLink} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-600 hover:underline">
                                                    Visit Profile
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 py-2">
                                    <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                                        <Lock className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Please login to view phone number and contact the seller.</p>
                                        <Link to="/login" className="text-orange-600 font-bold text-sm hover:underline">Login or Register →</Link>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="grid grid-cols-2 gap-6 pt-12 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[var(--text-main)] uppercase">Express Delivery</p>
                                    <p className="text-[10px] text-[var(--text-main)] opacity-50 font-bold">2-3 Business Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[var(--text-main)] uppercase">Secure Warranty</p>
                                    <p className="text-[10px] text-[var(--text-main)] opacity-50 font-bold">12 Months Premium</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>


                <div className="mt-32">
                    <div className="border-b border-slate-100 flex gap-12 mb-12">
                        <button className="pb-4 border-b-2 border-slate-900 font-black text-sm uppercase tracking-widest text-slate-900">Description</button>
                        <button className="pb-4 border-b-2 border-transparent font-black text-sm uppercase tracking-widest text-slate-400 hover:text-slate-900 transition">Specifications</button>
                        <button className="pb-4 border-b-2 border-transparent font-black text-sm uppercase tracking-widest text-slate-400 hover:text-slate-900 transition">Shipping & Returns</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900">Product Identity</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Crafted with precision and an unwavering commitment to quality, this item transcends the ordinary. Every curve, material choice, and functional detail has been meticulously considered to provide an experience that is both luxurious and enduring.</p>
                        </div>
                        <div className="bg-[var(--bg-card)] p-10 rounded-[40px] space-y-6 border border-[var(--border-color)]">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 bg-[var(--bg-main)] rounded-full flex items-center justify-center shadow-sm">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                </div>
                                <p className="text-sm font-bold text-[var(--text-main)] opacity-80">Handcrafted by industry experts with premium sourcing.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 bg-[var(--bg-main)] rounded-full flex items-center justify-center shadow-sm">
                                    <Headphones className="h-4 w-4 text-orange-500" />
                                </div>
                                <p className="text-sm font-bold text-[var(--text-main)] opacity-80">Priority 24/7 dedicated support for every owner.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
