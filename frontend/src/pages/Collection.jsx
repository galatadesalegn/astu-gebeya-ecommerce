import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Filter, ShoppingCart, Star, Sparkles, Zap, 
    ShieldCheck, ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CATEGORIES = [
    { name: 'All', icon: <Sparkles />, count: '2.4k+ Items', color: 'bg-slate-900 text-white', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
    { name: 'Electronics', icon: <Zap />, count: '1.2k+ Items', color: 'bg-blue-500 text-white', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Fashion', icon: <ShoppingCart />, count: '800+ Items', color: 'bg-orange-500 text-white', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800' },
    { name: 'Luxury', icon: <Star />, count: '450+ Items', color: 'bg-purple-500 text-white', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
];

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1000000);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const query = useMemo(() => new URLSearchParams(location.search).get('search'), [location.search]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/products`);
                const productList = data.products || (Array.isArray(data) ? data : []);
                setProducts(productList.map(p => ({
                    ...p,
                    rating: Number(p.rating || (4.0 + Math.random() * 1.0).toFixed(1)),
                    reviews: p.reviews || Math.floor(Math.random() * 2000),
                })));
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = !query || p.title.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        return result;
    }, [products, activeCategory, query, sortBy]);

    return (
        <div className="pt-24 min-h-screen bg-[var(--bg-main)]">
            <section className="py-20 max-w-7xl mx-auto px-4" onMouseMove={handleMouseMove}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 bg-[var(--bg-card)] p-6 rounded-[30px] border border-[var(--border-color)]">
                    <div className="flex flex-wrap items-center gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat.name ? 'bg-slate-900 text-white shadow-xl' : 'bg-[var(--bg-main)] text-slate-500 hover:bg-slate-100'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query || ''}
                                onChange={(e) => navigate(`/collection?search=${e.target.value}`)}
                                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl outline-none font-bold"
                            />
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl font-black uppercase mb-12">The Collection</h2>

                {loading ? (
                    <div className="text-center py-20 font-black uppercase tracking-widest">Sourcing items...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-[40px]">
                        <p className="font-black uppercase text-slate-400">No items found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group">
                                <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[var(--bg-card)] mb-6 border border-[var(--border-color)] group-hover:border-orange-500/30 transition-all duration-300">
                                    <Link to={`/product/${product._id}`} className="block w-full h-full">
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </Link>
                                    <div className="absolute inset-x-4 bottom-4 translate-y-24 group-hover:translate-y-0 transition-all duration-500 space-y-2">
                                        <button onClick={() => addToCart(product)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4">
                                            <ShoppingCart className="h-3 w-3" /> Add to Bag
                                        </button>
                                        <button onClick={() => { addToCart(product); navigate('/checkout'); }} className="w-full bg-orange-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4">
                                            <Zap className="h-3 w-3" /> Order Now
                                        </button>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-black uppercase tracking-tighter line-clamp-2">{product.title}</h3>
                                        <p className="font-black">{product.price} ETB</p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Collection;
