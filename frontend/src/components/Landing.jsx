import React, { useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Users, ArrowRight, Star, ShoppingBag, Sparkles, Zap, ShieldCheck, Mail, Headphones, Moon, Sun } from 'lucide-react';
import logoImg from '../assets/astu-gebeya.jpg';
import { ThemeContext } from '../context/ThemeContext';

const Landing = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const sectionRef = useRef(null);
    const { scrollYProgress: globalScroll } = useScroll();
    const parallaxY1 = useTransform(globalScroll, [0, 1], [0, 200]);
    const parallaxY2 = useTransform(globalScroll, [0, 1], [0, -300]);
    const parallaxY3 = useTransform(globalScroll, [0, 1], [0, 150]);
    const parallaxY4 = useTransform(globalScroll, [0, 1], [0, -200]);

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

    return (
        <div className="min-h-screen bg-[var(--bg-card)] dark:bg-[var(--bg-main)] overflow-hidden selection:bg-[#4f46e5] selection:text-white transition-colors duration-500">
            {/* Branding Header */}
            <header className="absolute top-0 left-0 right-0 z-50 py-8 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img 
                            src={logoImg} 
                            alt="Logo" 
                            className="w-10 h-10 rounded-xl shadow-lg border-2 border-[var(--bg-card)] group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-xl font-black tracking-tighter text-[var(--text-main)]">
                            ASTU GEBEYA<span className="text-[#4f46e5]">.</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-[var(--bg-section-alt)] text-[var(--text-muted)] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        <Link to="/login" className="text-sm font-jakarta font-bold text-[var(--text-muted)] hover:text-[#4f46e5] dark:hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="px-6 py-2.5 bg-[var(--text-main)] dark:bg-[var(--bg-card)] text-[var(--bg-card)] dark:text-[var(--text-main)] rounded-full text-sm font-jakarta font-bold hover:bg-[#4f46e5] dark:hover:bg-indigo-50 transition-all shadow-sm">Join Us</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 bg-[var(--bg-main)] min-h-screen flex items-center overflow-hidden transition-colors duration-500" onMouseMove={handleMouseMove}>
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 z-0">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 50, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                            x: [0, -50, 0],
                            y: [0, 40, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(79,70,229,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(79,70,229,0.15),transparent_50%)]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-jakarta font-bold uppercase tracking-widest mb-8"
                            >
                                <Sparkles className="w-3 h-3" />
                                New Generation Marketplace
                            </motion.div>
                            
                            <h1 className="text-5xl md:text-7xl font-syne font-bold tracking-tight leading-[1.1] mb-8 text-[var(--text-main)]">
                                Shop the Vibe.<br /> 
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-[#4f46e5]">Elevate Your Style</span>
                                    <motion.span 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="absolute bottom-2 left-0 h-3 bg-indigo-100 dark:bg-indigo-900/50 -z-0"
                                    />
                                </span><br />
                                with ASTU GEBEYA.
                            </h1>
                            <p className="text-lg text-[var(--text-muted)] font-jakarta font-medium max-w-lg mb-12 leading-relaxed">
                                Experience the future of shopping with our curated collections designed for those who dare to stand out.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
                                <Link 
                                    to="/register" 
                                    className="group px-10 py-5 bg-[var(--text-main)] dark:bg-[var(--bg-card)] text-[var(--bg-card)] dark:text-[var(--text-main)] rounded-2xl font-jakarta font-bold flex items-center gap-3 hover:bg-[#4f46e5] dark:hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
                                >
                                    Start Exploring
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                
                                <div className="flex items-center gap-5">
                                    <div className="flex -space-x-4">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="h-12 w-12 rounded-2xl border-4 border-[var(--bg-card)] overflow-hidden shadow-sm">
                                                <img src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+40}.jpg`} className="h-full w-full object-cover" alt="user" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-jakarta font-black text-[var(--text-main)]">15k+ Members</p>
                                        <p className="text-xs font-jakarta font-bold text-[var(--text-muted)]">Growing Daily</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative hidden lg:block"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[40px] blur-2xl -z-10" />
                            <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-[var(--bg-card)] group">
                                <img 
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" 
                                    alt="Style Banner" 
                                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Floating Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute bottom-8 left-8 right-8 p-6 bg-[var(--bg-card)] dark:bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500 text-white rounded-xl">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <span className="font-syne font-bold text-[var(--text-main)]">New Collection</span>
                                        </div>
                                        <span className="text-xs font-jakarta font-black text-indigo-500 uppercase tracking-wider">Summer '26</span>
                                    </div>
                                    <div className="h-2 w-full bg-[var(--bg-section-alt)] rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ delay: 1.5, duration: 1 }}
                                            className="h-full bg-[#4f46e5]"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-[var(--bg-card)] dark:bg-[var(--bg-main)] relative overflow-hidden group/services transition-colors duration-500" id="services" onMouseMove={handleMouseMove}>
                <motion.div style={{ y: parallaxY3 }} className="absolute inset-0 pointer-events-none z-0">
                    <div className="hidden lg:block absolute top-[20%] right-[10%] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
                </motion.div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 dark:text-indigo-400 font-jakarta font-bold text-xs uppercase tracking-[0.4em] mb-4 block">The Experience</span>
                        <h2 className="text-4xl md:text-6xl font-syne font-bold text-[var(--text-main)] tracking-tight uppercase">
                            Our Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Zap className="h-8 w-8" />,
                                title: "Fast & Accessible",
                                desc: "Quick, secure, and user-friendly platform designed for the modern generation."
                            },
                            {
                                icon: <Users className="h-8 w-8" />,
                                title: "Sell Freely",
                                desc: "Connect with thousands of buyers and list your products without hidden fees."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8" />,
                                title: "Trusted Trade",
                                desc: "Verified community and secure transactions for a worry-free experience."
                            }
                        ].map((service, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="p-16 rounded-[50px] bg-[var(--bg-main)] dark:bg-[var(--bg-card)] border border-[var(--border-color)] dark:border-white/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-center flex flex-col items-center"
                            >
                                <div className="h-24 w-24 bg-[#4f46e5] text-white rounded-[32px] flex items-center justify-center mb-10 shadow-xl shadow-indigo-500/20">
                                    {service.icon}
                                </div>
                                <h3 className="text-3xl font-syne font-bold text-[var(--text-main)] mb-6 uppercase tracking-tight">{service.title}</h3>
                                <p className="text-xl text-[var(--text-muted)] font-jakarta font-medium leading-relaxed">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inquiry Section */}
            <section className="py-24 bg-[var(--bg-main)] dark:bg-[var(--bg-main)] transition-colors duration-500" id="contact">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-indigo-600 dark:text-indigo-400 font-jakarta font-bold text-xs uppercase tracking-[0.4em] mb-8 block">Connect</span>
                            <h2 className="text-5xl md:text-7xl font-syne font-bold mb-10 text-[var(--text-main)] uppercase leading-none">
                                Join the <br /> <span className="text-[#4f46e5] italic">ASTU GEBEYA.</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-[var(--bg-card)] dark:bg-[var(--bg-card)] rounded-2xl flex items-center justify-center shadow-sm border border-[var(--border-color)] dark:border-white/5">
                                        <Mail className="h-6 w-6 text-[#4f46e5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-jakarta font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-xl font-jakarta font-bold text-[var(--text-main)]">astugebeya@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-[var(--bg-card)] dark:bg-[var(--bg-card)] rounded-2xl flex items-center justify-center shadow-sm border border-[var(--border-color)] dark:border-white/5">
                                        <Headphones className="h-6 w-6 text-[#4f46e5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-jakarta font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Support</p>
                                        <p className="text-xl font-jakarta font-bold text-[var(--text-main)]">+251 944 670 015</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-[var(--bg-card)] dark:bg-[var(--bg-card)] p-12 rounded-[50px] shadow-2xl border border-[var(--border-color)] dark:border-white/5"
                        >
                            <h3 className="text-3xl font-syne font-bold mb-8 text-[var(--text-main)] uppercase tracking-tighter">Inquiry</h3>
                            <form className="space-y-6">
                                <input type="text" placeholder="Identification" className="w-full bg-[var(--bg-main)] dark:bg-[var(--bg-main)] border-none rounded-2xl px-6 py-4 outline-none font-jakarta font-bold text-[var(--text-main)] placeholder:text-gray-300 dark:placeholder:text-zinc-700 shadow-inner" required />
                                <input type="email" placeholder="Communication Channel" className="w-full bg-[var(--bg-main)] dark:bg-[var(--bg-main)] border-none rounded-2xl px-6 py-4 outline-none font-jakarta font-bold text-[var(--text-main)] placeholder:text-gray-300 dark:placeholder:text-zinc-700 shadow-inner" required />
                                <textarea rows="4" placeholder="What is your story?" className="w-full bg-[var(--bg-main)] dark:bg-[var(--bg-main)] border-none rounded-2xl px-6 py-4 outline-none font-jakarta font-bold text-[var(--text-main)] resize-none placeholder:text-gray-300 dark:placeholder:text-zinc-700 shadow-inner" required></textarea>
                                <button type="submit" className="w-full bg-[#4f46e5] text-white py-5 rounded-2xl font-jakarta font-bold uppercase tracking-widest hover:bg-[#4338ca] transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[var(--bg-card)] dark:bg-[var(--bg-main)] transition-colors duration-500">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold uppercase tracking-tight mb-6 text-[var(--text-main)]">
                        Ready to join the <span className="text-[#4f46e5] italic">Atelier?</span>
                    </h2>
                    <p className="text-lg font-jakarta text-[var(--text-muted)] font-medium mb-10">
                        Create an account today and experience the best e-commerce platform in the region.
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--text-main)] dark:bg-[var(--bg-card)] text-[var(--bg-card)] dark:text-[var(--text-main)] rounded-2xl font-jakarta font-bold uppercase tracking-wider hover:bg-[#4f46e5] dark:hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 text-sm"
                    >
                        Create My Account
                        <Users className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
