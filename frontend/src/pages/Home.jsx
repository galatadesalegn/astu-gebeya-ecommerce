import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import {
    Search, Filter, ShoppingCart, Star, ArrowRight,
    Sparkles, Zap, ShieldCheck, Truck, Headphones,
    Facebook, Twitter, Instagram, Linkedin, Mail,
    ChevronLeft, ChevronRight, PlayCircle, Heart,
    MoveRight, MousePointer2, TrendingUp, Users
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';




const CATEGORIES = [
    { name: 'All', icon: <Sparkles />, count: '2.4k+ Items', color: 'bg-slate-900 text-white', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
    { name: 'Electronics', icon: <Zap />, count: '1.2k+ Items', color: 'bg-blue-500 text-white', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Fashion', icon: <ShoppingCart />, count: '800+ Items', color: 'bg-orange-500 text-white', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800' },
    { name: 'Luxury', icon: <Star />, count: '450+ Items', color: 'bg-purple-500 text-white', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
];

const TESTIMONIALS = [
    {
        name: 'Sarah Johnson',
        role: 'Verified Buyer',
        content: "The quality of the products is absolutely top-notch. I've bought multiple items and they never disappoint. Fast delivery too!",
        image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
        name: 'Michael Chen',
        role: 'Tech Enthusiast',
        content: "Best customer service I've experienced online. They were very helpful when I had questions about my order. Highly recommended!",
        image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
        name: 'Emma Williams',
        role: 'Fashion Designer',
        content: "Love the minimalist aesthetic of the store. It's so easy to find what I'm looking for. The checkout process is seamless.",
        image: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
];

const Home = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const { scrollYProgress: globalScroll } = useScroll();
    const parallaxY1 = useTransform(globalScroll, [0, 1], [0, 200]);
    const parallaxY2 = useTransform(globalScroll, [0, 1], [0, -300]);
    const parallaxY3 = useTransform(globalScroll, [0, 1], [0, 150]);
    const parallaxY4 = useTransform(globalScroll, [0, 1], [0, -200]);

    const [toast, setToast] = useState(null);
    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 4000);
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1000000); // Default max price
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const { addToCart } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();

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
                if (productList && productList.length > 0) {
                    const enhancedData = productList.map(p => ({
                        ...p,
                        rating: Number(p.rating || (4.0 + Math.random() * 1.0).toFixed(1)),
                        reviews: p.reviews || Math.floor(Math.random() * 2000),
                        createdAt: p.createdAt || new Date().toISOString()
                    }));
                    setProducts(enhancedData);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
            const matchesPrice = p.price <= priceRange;
            const matchesRating = p.rating >= minRating;
            return matchesCategory && matchesSearch && matchesPrice && matchesRating;
        });

        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

        return result;
    }, [products, activeCategory, query, priceRange, minRating, sortBy]);

    const bestProducts = useMemo(() => {
        return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }, [products]);

    return (
        <div className="bg-[var(--bg-main)] dark:bg-[var(--bg-main)] min-h-screen selection:bg-orange-500 selection:text-white transition-colors duration-500 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-full shadow-2xl bg-emerald-500 text-white flex items-center gap-3 font-black text-sm uppercase tracking-widest"
                    >
                        <ShieldCheck className="h-5 w-5" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <section
                className="relative flex items-center justify-center overflow-hidden group/hero min-h-screen"
                onMouseMove={handleMouseMove}
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=85&w=1920)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >

                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500 z-0"
                    style={{
                        background: useTransform(
                            [springX, springY],
                            ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(249, 115, 22, 0.15), transparent 80%)`
                        )
                    }}
                />


                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(10,10,10,0.62) 0%, rgba(10,10,10,0.45) 60%, rgba(10,10,10,0.70) 100%)',
                    }}
                />


                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: '-80px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px', height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >

                        <span
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-10"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'rgba(255,255,255,0.90)',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                            ASTU GEBEYA — E-Commerce
                        </span>


                        <h1
                            className="font-black tracking-tight leading-[1.05] mb-6 flex flex-col items-center"
                            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: '#ffffff' }}
                        >
                            <div className="flex flex-wrap justify-center">
                                {"Everything you ".split('').map((char, index) => (
                                    <motion.span
                                        key={`line1-${index}`}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.03, ease: 'easeOut' }}
                                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center text-center mt-[-4px] sm:mt-0">
                                {"need, ".split('').map((char, index) => (
                                    <motion.span
                                        key={`line2-${index}`}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: ("Everything you ".length + index) * 0.03, ease: 'easeOut' }}
                                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                                <span style={{
                                    background: 'linear-gradient(90deg, #fb923c, #f43f5e)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                }}>
                                    {"delivered.".split('').map((char, index) => (
                                        <motion.span
                                            key={`part3-${index}`}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: ("Everything you need, ".length + index) * 0.03, ease: 'easeOut' }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            </div>
                        </h1>


                        <p
                            className="mx-auto mb-10"
                            style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', lineHeight: 1.7 }}
                        >
                            Explore our exclusive selection of quality products.
                        </p>


                        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
                            <a
                                href="#products"
                                className="inline-flex items-center gap-2 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                                style={{
                                    padding: '14px 32px',
                                    background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)',
                                    boxShadow: '0 4px 24px rgba(249,115,22,0.45)',
                                }}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Shop Now
                            </a>
                            <a
                                href="#products"
                                className="inline-flex items-center gap-2 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
                                style={{
                                    padding: '14px 32px',
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.30)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                Browse Products
                                <MoveRight className="h-4 w-4" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>


            <section className="py-20 min-h-screen flex flex-col justify-center bg-[var(--bg-card)] relative overflow-hidden group/products transition-all duration-500 section-perspective" id="products" onMouseMove={handleMouseMove}>


                <motion.div style={{ y: parallaxY1 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ rotateX: [0, 15, 0], rotateY: [0, -20, 0] }}
                        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                        className="hidden md:block absolute top-[10%] left-[5%] w-48 h-48 bg-gradient-to-br from-white/90 to-slate-100/30 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 backdrop-blur-md dark:hidden preserve-3d"
                    />
                </motion.div>

                <motion.div style={{ y: parallaxY2 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ rotateX: [0, -10, 0], rotateY: [0, 15, 0] }}
                        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
                        className="hidden md:block absolute bottom-[15%] right-[3%] w-64 h-64 bg-gradient-to-tr from-white/80 to-blue-50/30 rounded-full shadow-[0_30px_60px_-15px_rgba(0,100,255,0.05)] border border-white/60 backdrop-blur-lg dark:hidden preserve-3d"
                    />
                </motion.div>


                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/products:opacity-100 transition-opacity duration-500 z-0"
                    style={{
                        background: useTransform(
                            [springX, springY],
                            ([x, y]) => `radial-gradient(1000px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
                        )
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8 bg-[var(--bg-card)] p-6 rounded-[30px] border border-[var(--border-color)]">
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
                                    placeholder="Search ASTU GEBEYA..."
                                    value={query || ''}
                                    onChange={(e) => navigate(`/?search=${e.target.value}`)}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-bold transition-all"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-6 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-xs font-black outline-none cursor-pointer"
                            >
                                <option value="newest">Latest</option>
                                <option value="rating">Top Rated</option>
                                <option value="price-low">Price: Low</option>
                                <option value="price-high">Price: High</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] tracking-tight uppercase leading-none">
                            Collection
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Displaying 8 Featured Drops
                        </p>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="py-20 text-center bg-[var(--bg-card)] rounded-[40px] border-2 border-dashed border-[var(--border-color)]">
                            <Search className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-[var(--text-main)] uppercase">Nothing detected</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.slice(0, 8).map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[var(--bg-card)] mb-6 premium-shadow border border-[var(--border-color)] group-hover:border-orange-300/50 group-hover:shadow-orange-500/10 transition-all duration-300">
                                        <Link to={`/product/${product._id}`} className="block w-full h-full">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        </Link>
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-1">
                                                <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                                                <span className="text-[10px] font-black text-slate-900">{product.rating}</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-4 bottom-4 translate-y-24 group-hover:translate-y-0 transition-all duration-500 space-y-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product);
                                                }}
                                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all hover:bg-slate-800"
                                            >
                                                <ShoppingCart className="h-3 w-3" />
                                                Add to Bag
                                            </button>
                                            <button
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                className="w-full bg-orange-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all hover:bg-orange-600"
                                            >
                                                <Zap className="h-3 w-3" />
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tighter group-hover:text-orange-500 h-10 line-clamp-2 leading-tight">{product.title}</h3>
                                            <p className="font-black text-[var(--text-main)]">{product.price} {product.currency || 'ETB'}</p>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            <section className="py-20 min-h-screen flex flex-col justify-center bg-[var(--bg-section-alt)] relative overflow-hidden group/services transition-all duration-500 section-perspective" id="services" onMouseMove={handleMouseMove}>


                <motion.div style={{ y: parallaxY3 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ rotateZ: [0, 5, 0] }}
                        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
                        className="hidden lg:block absolute top-[20%] right-[10%] w-96 h-96 bg-gradient-to-br from-white/80 to-blue-200/30 rounded-full blur-3xl opacity-80 dark:hidden"
                    />
                </motion.div>

                <motion.div style={{ y: parallaxY4 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ rotateX: [0, 20, 0], rotateZ: [10, 15, 10] }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1 }}
                        className="hidden md:block absolute bottom-[10%] left-[8%] w-40 h-40 bg-white/70 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,100,255,0.08)] border border-white/80 backdrop-blur-xl dark:hidden preserve-3d"
                    />
                </motion.div>


                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/services:opacity-100 transition-opacity duration-500 z-0"
                    style={{
                        background: useTransform(
                            [springX, springY],
                            ([x, y]) => `radial-gradient(1000px circle at ${x}px ${y}px, rgba(245, 158, 11, 0.1), transparent 80%)`
                        )
                    }}
                />

                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-orange-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">The Experience</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-main)] tracking-tight uppercase leading-none">
                            Service
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Zap className="h-9 w-9" />,
                                title: "Fast & Accessible",
                                desc: "Fast, secure, and easily accessible product services that prioritize your time and safety."
                            },
                            {
                                icon: <Users className="h-9 w-9" />,
                                title: "Sell Freely",
                                desc: "Reach thousands of potential buyers and sell your products across our platform completely for free."
                            },
                            {
                                icon: <ShieldCheck className="h-9 w-9" />,
                                title: "Trusted Payment",
                                desc: "Secure and reliable payment methods, with the flexibility and trust of in-person transactions."
                            }
                        ]
                            .map((service, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -10
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                    }}
                                    className="p-16 rounded-[60px] bg-white dark:bg-white/5 border border-[var(--border-color)] hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)] transition-all group shadow-sm flex flex-col items-center text-center cursor-pointer"
                                >
                                    <div className="h-24 w-24 bg-orange-500 rounded-[30px] flex items-center justify-center text-white mb-10 shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight mb-6 transition-colors group-hover:text-orange-500">{service.title}</h3>
                                    <p className="text-[var(--text-muted)] opacity-80 font-bold leading-relaxed text-xl">{service.desc}</p>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </section>


            <motion.section
                ref={sectionRef}
                className="py-20 min-h-screen flex flex-col justify-center bg-[var(--bg-section-alt)] text-[var(--text-main)] relative overflow-hidden group/section transition-all duration-700"
                id="contact"
                onMouseMove={handleMouseMove}
            >

                <motion.div style={{ y: parallaxY1 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ x: [0, 30, 0] }}
                        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
                        className="hidden lg:block absolute -top-10 left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-orange-300/30 to-pink-300/20 rounded-full blur-3xl opacity-80 dark:opacity-5"
                    />
                </motion.div>

                <motion.div style={{ y: parallaxY2 }} className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ rotateY: [0, -20, 0], rotateX: [10, -10, 10] }}
                        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 2 }}
                        className="hidden md:block absolute bottom-[20%] right-[10%] w-48 h-48 bg-gradient-to-bl from-white/90 to-orange-100/40 rounded-[50px] shadow-[0_20px_40px_-10px_rgba(249,115,22,0.1)] border border-white/80 backdrop-blur-2xl dark:hidden preserve-3d"
                    />
                </motion.div>


                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 z-0"
                    style={{
                        background: useTransform(
                            [springX, springY],
                            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, var(--color-accent), transparent 40%)`
                        ),
                        opacity: 0.1
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        <div>
                            <span className="text-orange-500 font-black text-xs uppercase tracking-[0.4em] mb-8 block">Connect</span>
                            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter uppercase leading-none">
                                Join the <br /> <span className="text-orange-500 italic">ASTU GEBEYA.</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Business Atelier</p>
                                        <p className="text-xl font-bold">astugebeya@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                        <Headphones className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Connection</p>
                                        <p className="text-xl font-bold">+251 944 670 015</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                        <svg className="h-5 w-5 text-orange-500 fill-current" viewBox="0 0 24 24">
                                            <path d="M11.944 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.592 0 11.944 0zm5.892 8.448l-1.92 9.06c-.144.648-.528.804-1.068.504l-2.928-2.16-1.416 1.368c-.156.156-.288.288-.588.288l.216-3.048 5.544-5.016c.24-.216-.048-.336-.372-.12l-6.852 4.308-2.952-.924c-.648-.204-.66-.648.132-.96l11.532-4.452c.54-.192 1.008.132.864.744z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Telegram Community</p>
                                        <a href="https://t.me/astu_gebeya_store" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-orange-500 transition-colors uppercase italic">@astu_gebeya_store</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[50px] p-10 lg:p-16 shadow-2xl">
                            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Inquiry</h3>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showToast("Message sent directly to the Admin Panel!"); e.target.reset(); }}>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Identification"
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-all text-[var(--text-main)] font-bold placeholder:text-slate-400 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Communication Channel"
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-all text-[var(--text-main)] font-bold placeholder:text-slate-400 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <textarea
                                        rows="4"
                                        placeholder="What is your story?"
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-all text-[var(--text-main)] font-bold resize-none placeholder:text-slate-400 shadow-sm"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 active:scale-95">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-32 pt-16 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-orange-500 transition">Privacy Atelier</a>
                            <a href="#" className="hover:text-orange-500 transition">Terms of Service</a>
                            <a href="#" className="hover:text-orange-500 transition">Sourcing Map</a>
                        </div>
                        <p>© 2026 ASTU GEBEYA Collection. All designs protected.</p>
                    </div>
                </div>
            </motion.section>
        </div >
    );
};

export default Home;
