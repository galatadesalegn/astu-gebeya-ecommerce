import React from 'react';
import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[var(--bg-card)] pt-24 pb-12 text-[var(--text-main)] border-t border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="p-1.5 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/10">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-beautiful uppercase italic">
                                ASTU GEBEYA<span className="text-orange-500">.</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-main)] opacity-70 font-medium leading-relaxed">
                            The premier destination for quality products. We bring you curated items from around the globe.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/in/galata-desalegn-7197023a0/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm text-[var(--text-main)]">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://www.twitter.com/galatadesalegn" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm text-[var(--text-main)]">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/galaxy_gelo/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm text-[var(--text-main)]">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://t.me/astu_gebeya_store" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm text-[var(--text-main)]">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M11.944 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.592 0 11.944 0zm5.892 8.448l-1.92 9.06c-.144.648-.528.804-1.068.504l-2.928-2.16-1.416 1.368c-.156.156-.288.288-.588.288l.216-3.048 5.544-5.016c.24-.216-.048-.336-.372-.12l-6.852 4.308-2.952-.924c-.648-.204-.66-.648.132-.96l11.532-4.452c.54-.192 1.008.132.864.744z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-orange-500">Curations</h4>
                        <ul className="space-y-4">
                            {['Electronics', 'Fashion', 'Home Goods', 'Luxury', 'Authentics'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-[var(--text-main)] opacity-60 hover:text-orange-500 hover:opacity-100 font-medium transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-orange-500">Services</h4>
                        <ul className="space-y-4">
                            {['Seller Portal', 'Buyer Protection', 'Local Delivery', 'Product Verification', 'Direct Chat'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-[var(--text-main)] opacity-60 hover:text-orange-500 hover:opacity-100 font-medium transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-orange-500">Atelier Pulse</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <div className="h-10 w-10 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="text-[var(--text-main)] font-medium">
                                    <p className="text-[var(--text-main)] uppercase text-[10px] font-black tracking-widest">Inquiry Line</p>
                                    <p className="text-xs opacity-70">astugebeya@gmail.com</p>
                                </div>
                            </li>
                            <li className="p-6 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] shadow-sm">
                                <p className="text-[var(--text-main)] text-xs font-black uppercase tracking-widest mb-2">Join the Atelier</p>
                                <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-xl shadow-inner">
                                    <input type="text" placeholder="Email" className="bg-transparent px-4 py-2 text-xs outline-none w-full text-[var(--text-main)] font-bold placeholder:text-slate-400" />
                                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-orange-600 transition-colors">Join</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[var(--text-main)] opacity-40 text-sm font-medium">
                        &copy; 2026 ASTU GEBEYA Collection. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-[var(--text-main)] opacity-50 hover:text-orange-500 hover:opacity-100 text-xs font-medium transition-all">Privacy Boutique</Link>
                        <Link to="/" className="text-[var(--text-main)] opacity-50 hover:text-orange-500 hover:opacity-100 text-xs font-medium transition-all">Terms of Service</Link>
                        <Link to="/" className="text-[var(--text-main)] opacity-50 hover:text-orange-500 hover:opacity-100 text-xs font-medium transition-all">Sourcing</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

