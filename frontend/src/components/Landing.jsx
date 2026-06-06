import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, ShieldCheck, Users, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-jakarta font-black uppercase tracking-widest mb-6 border border-orange-500/20">
                                The Future of Local Trade
                            </span>
                            <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tight leading-tight mb-6 uppercase text-[var(--text-main)]">
                                Discover <br /> 
                                <span className="text-orange-500 italic">Excellence.</span>
                            </h1>
                            <p className="text-lg text-[var(--text-muted)] font-jakarta font-medium max-w-lg mb-10 leading-relaxed">
                                Join the premier ASTU GEBEYA community. A modern marketplace designed for seamless discovery, trusted transactions, and fast delivery.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link 
                                    to="/register" 
                                    className="px-8 py-4 bg-orange-500 text-white rounded-xl font-jakarta font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2 text-sm"
                                >
                                    Start Exploring
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl font-jakarta font-bold uppercase tracking-wider hover:bg-[var(--bg-main)] transition-all active:scale-95 text-sm"
                                >
                                    Log In
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 aspect-square rounded-[60px] overflow-hidden border border-[var(--border-color)] shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Modern Marketplace" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex -space-x-3">
                                                {[1,2,3].map(i => (
                                                    <img key={i} src={`https://randomuser.me/api/portraits/men/${i+10}.jpg`} className="h-8 w-8 rounded-full border-2 border-orange-500" alt="user" />
                                                ))}
                                            </div>
                                            <p className="text-white text-xs font-black uppercase tracking-widest">2.4k+ Active Users</p>
                                        </div>
                                        <p className="text-white/80 text-sm font-bold">Trusted by the community for quality and speed.</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[var(--bg-section-alt)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Zap className="h-8 w-8" />,
                                title: "Instant Access",
                                desc: "Sign up in seconds and start browsing a curated selection of products."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8" />,
                                title: "Secure Trade",
                                desc: "Verified sellers and protected payments ensure a worry-free experience."
                            },
                            {
                                icon: <ShoppingBag className="h-8 w-8" />,
                                title: "Sell Anything",
                                desc: "Convert your items into cash by reaching our growing network of buyers."
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="p-12 rounded-[40px] bg-[var(--bg-main)] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center"
                            >
                                <div className="h-16 w-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-syne font-extrabold uppercase mb-4 tracking-tight text-[var(--text-main)]">
                                    {feature.title}
                                </h3>
                                <p className="text-base font-jakarta text-[var(--text-muted)] font-semibold leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold uppercase tracking-tight mb-6 text-[var(--text-main)]">
                        Ready to join the <span className="text-orange-500 italic">Atelier?</span>
                    </h2>
                    <p className="text-lg font-jakarta text-[var(--text-muted)] font-medium mb-10">
                        Create an account today and experience the best e-commerce platform in the region.
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white rounded-2xl font-jakarta font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 active:scale-95 text-sm"
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
