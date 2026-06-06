import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-32 pb-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center space-x-2 text-[var(--text-muted)] hover:text-orange-500 transition mb-12 group">
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-tight text-sm">Continue Shopping</span>
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">

                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-4xl font-black text-[var(--text-main)] uppercase tracking-tight">Your Shopping Bag</h1>
                            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-black tracking-tight">{cartCount} Items</span>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="bg-[var(--bg-card)] rounded-[40px] p-20 text-center border border-[var(--border-color)] premium-shadow">
                                <div className="h-24 w-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--border-color)]">
                                    <ShoppingBag className="h-10 w-10 text-orange-500" />
                                </div>
                                <h2 className="text-2xl font-black text-[var(--text-main)] mb-4 uppercase">Your bag is empty</h2>
                                <p className="text-[var(--text-muted)] font-medium mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your bag yet. Start exploring our premium collection.</p>
                                <Link to="/" className="btn-primary inline-flex">Explore Products</Link>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[var(--bg-card)] rounded-[32px] p-6 pr-10 flex flex-col md:flex-row items-center gap-8 border border-[var(--border-color)] premium-shadow relative group"
                                    >
                                        <div className="h-32 w-32 rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-color)] flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">{item.category}</div>
                                            <h3 className="text-xl font-black text-[var(--text-main)] mb-2 truncate max-w-sm uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-2xl font-black text-orange-600">{item.price} {item.currency || 'ETB'}</p>
                                        </div>

                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center bg-[var(--bg-main)] rounded-full p-1 border border-[var(--border-color)]">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="p-2 hover:bg-orange-500 hover:text-white rounded-full transition-all shadow-sm active:scale-90"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-[var(--text-main)]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="p-2 hover:bg-orange-500 hover:text-white rounded-full transition-all shadow-sm active:scale-90"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-[var(--text-muted)] hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Remove Item
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>


                    {cartItems.length > 0 && (
                        <div className="lg:w-96">
                            <div className="bg-[var(--bg-card)] rounded-[40px] p-10 text-[var(--text-main)] sticky top-32 space-y-8 premium-shadow border border-[var(--border-color)]">
                                <h2 className="text-2xl font-black uppercase tracking-tight italic">Order Summary</h2>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between text-[var(--text-main)] font-medium opacity-60">
                                        <span className="uppercase text-[10px] font-black tracking-widest">Subtotal</span>
                                        <span className="text-[var(--text-main)] font-black">{cartTotal.toFixed(2)} {cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}</span>
                                    </div>
                                    <div className="flex justify-between text-[var(--text-main)] font-medium opacity-60">
                                        <span className="uppercase text-[10px] font-black tracking-widest">Tax</span>
                                        <span className="text-[var(--text-main)] font-black">0.00 {cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[var(--border-color)] flex justify-between items-end">
                                    <div>
                                        <p className="text-[var(--text-main)] opacity-50 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-4xl font-black text-[var(--text-main)]">{cartTotal.toFixed(2)} {cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}</p>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="w-full bg-orange-500 text-white !py-5 flex items-center justify-center gap-3 !text-lg !rounded-[24px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 active:scale-95">
                                    Checkout
                                    <ArrowRight className="h-6 w-6" />
                                </button>

                                <div className="pt-4 flex items-center justify-center gap-3 opacity-30 dark:invert">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
