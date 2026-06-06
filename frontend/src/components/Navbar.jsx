import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/astu-gebeya.jpg';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { ShoppingCart, User, LogOut, MessageSquare, Menu, Search, X, ChevronDown, Moon, Sun, Settings, LayoutDashboard, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        if (isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] md:pt-4 px-0 md:px-6 lg:px-8 transition-all duration-500 pointer-events-none group">
            <nav className="max-w-7xl mx-auto w-full pointer-events-auto transition-transform duration-500 lg:group-hover:scale-[1.01] lg:group-hover:-translate-y-1">
                <div className="glass bg-[var(--bg-overlay)] backdrop-blur-2xl md:rounded-[36px] border-b md:border border-[var(--border-color)] shadow-sm md:group-hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.15)] md:group-hover:border-orange-500/30 transition-all duration-500 overflow-visible relative">
                    <div className="px-4 sm:px-6 xl:px-8 relative z-20 md:group-hover:bg-[var(--bg-main)] transition-colors duration-500">
                        <div className="flex justify-between h-20 items-center gap-4">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-3 shrink-0 group">
                                <img
                                    src={logoImg}
                                    alt="ASTU GEBEYA logo"
                                    style={{
                                        width: 42,
                                        height: 42,
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        border: '2px solid #f97316',
                                        boxShadow: '0 2px 12px rgba(249,115,22,0.30)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    className="group-hover:scale-105"
                                />
                                <span className="text-2xl font-black tracking-tighter text-beautiful hidden sm:block">
                                    ASTU GEBEYA<span className="text-orange-500">.</span>
                                </span>
                            </Link>

                            {/* Desktop Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-md relative group px-4">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--text-main)] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] focus:bg-[var(--bg-main)] focus:ring-4 focus:ring-orange-500/5 outline-none transition-all text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                                />
                            </div>

                            {/* Desktop Nav Links & User Actions */}
                            <div className="hidden lg:flex items-center space-x-12">
                                <div className="flex items-center space-x-2">
                                    <a href="/#products" className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/5 transition-all active:scale-95 leading-none">Collection</a>
                                    <a href="/#services" className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/5 transition-all active:scale-95 leading-none">Services</a>
                                    <a href="/#contact" className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-500/5 transition-all active:scale-95 leading-none">Connect</a>
                                </div>
                            </div>

                            <div className="hidden lg:block h-6 w-px bg-[var(--border-color)]" />

                            <div className="hidden lg:flex items-center space-x-6">

                                <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition active:scale-90 relative top-0.5">
                                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                </button>

                                {user && (
                                    <Link to="/messages" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition relative top-0.5">
                                        <MessageSquare className="h-5 w-5" />
                                    </Link>
                                )}

                                <Link to="/cart" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition relative top-0.5">
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 h-4 w-4 bg-orange-500 text-[10px] font-black text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {user ? (
                                    <div className="relative group/user" ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                            className="flex items-center space-x-3 bg-[var(--bg-card)] px-5 py-2.5 rounded-full hover:bg-[var(--bg-main)] hover:border-orange-500/30 transition-all border border-[var(--border-color)] group active:scale-95 shadow-sm"
                                        >
                                            <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white uppercase italic shadow-lg shadow-orange-500/20">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="text-left hidden xl:block">
                                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-0.5">Member</p>
                                                <p className="text-xs font-black text-[var(--text-main)] truncate max-w-[80px] uppercase tracking-tight leading-none">{user.name}</p>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 text-[var(--text-muted)] group-hover:text-orange-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* User Dropdown */}
                                        <div className={`absolute top-full right-0 mt-3 w-64 bg-[var(--bg-card)] rounded-[24px] shadow-2xl border border-[var(--border-color)] transition-all duration-300 p-3 z-50 ${isUserDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                            <div className="px-4 py-3 border-b border-[var(--border-color)] mb-2">
                                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Authentique Identity</p>
                                                <p className="text-sm font-black text-[var(--text-main)] uppercase">{user.name}</p>
                                                <p className="text-[10px] text-[var(--text-muted)] font-medium truncate">{user.email || 'member@astugebeya.com'}</p>
                                            </div>

                                            <div className="space-y-1">
                                                {user.role === 'Seller' && (
                                                    <Link to="/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-black text-[var(--text-main)] hover:bg-orange-500/10 hover:text-orange-600 rounded-xl transition-all uppercase tracking-widest group/item">
                                                        <LayoutDashboard className="h-4 w-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
                                                        Seller Dashboard
                                                    </Link>
                                                )}
                                                <Link to="/cart" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-black text-[var(--text-main)] hover:bg-orange-500/10 hover:text-orange-600 rounded-xl transition-all uppercase tracking-widest group/item">
                                                    <ShoppingCart className="h-4 w-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
                                                    My Selection ({cartCount})
                                                </Link>
                                                <Link to="/messages" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-black text-[var(--text-main)] hover:bg-orange-500/10 hover:text-orange-600 rounded-xl transition-all uppercase tracking-widest group/item">
                                                    <MessageSquare className="h-4 w-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
                                                    Atelier Messages
                                                </Link>
                                                <Link to="/" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-4 py-3 px-4 text-xs font-black text-[var(--text-main)] hover:bg-orange-500/10 hover:text-orange-600 rounded-xl transition-all uppercase tracking-widest group/item">
                                                    <Package className="h-4 w-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
                                                    Browse Products
                                                </Link>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                                                <button onClick={() => { handleLogout(); setIsUserDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest group/item">
                                                    <LogOut className="h-4 w-4 group-hover/item:translate-x-1 transition-transform" />
                                                    Secure Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" className="bg-orange-500 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                                        Join ASTU GEBEYA
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex lg:hidden items-center">
                                <button
                                    className="p-2 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-[var(--bg-card)] border-t border-[var(--border-color)] p-6 space-y-6 shadow-2xl relative z-10 animate-in slide-in-from-top duration-500">
                        <div className="grid grid-cols-1 gap-3">
                            <a href="/#products" className="flex items-center justify-center p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-main)] hover:bg-orange-500/5 hover:text-orange-500 transition-colors" onClick={() => setIsMenuOpen(false)}>The Collection</a>
                            <a href="/#services" className="flex items-center justify-center p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-main)] hover:bg-orange-500/5 hover:text-orange-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Our Services</a>
                            <a href="/#contact" className="flex items-center justify-center p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-main)] hover:bg-orange-500/5 hover:text-orange-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Connect</a>
                        </div>

                        <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center p-5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-main)] hover:bg-orange-500/5 gap-3 transition-all active:scale-95">
                            {theme === 'light' ? <Moon className="h-4 w-4 text-orange-500" /> : <Sun className="h-4 w-4 text-orange-500" />}
                            {theme === 'light' ? 'Nocturnal Mode' : 'Luminescent Mode'}
                        </button>

                        {!user ? (
                            <div className="pt-4">
                                <Link to="/login" className="block w-full text-center bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-orange-500/20" onClick={() => setIsMenuOpen(false)}>Join ASTU GEBEYA</Link>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
                                <div className="flex items-center gap-4 mb-4 px-2">
                                    <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl font-black text-white italic shadow-lg shadow-orange-500/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight italic">{user.name}</p>
                                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md inline-block mt-1">{user.role} Member</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {user.role === 'Seller' && (
                                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest text-orange-600 transition-all active:scale-[0.98]">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Seller Dashboard
                                        </Link>
                                    )}
                                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-main)] transition-all active:scale-[0.98]">
                                        <ShoppingCart className="h-4 w-4 text-orange-500" />
                                        Selections ({cartCount})
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-600 transition-all active:scale-[0.98]">
                                        <LogOut className="h-4 w-4" />
                                        Secure Exit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav >
        </div >
    );
};

export default Navbar;
