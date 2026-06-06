import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Truck, CreditCard, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dormBlock: '',
        roomNumber: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Peer to Peer (Hand-to-Hand)');

    if (!user) {
        navigate('/login');
        return null;
    }

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderItems = cartItems.map(item => ({
                title: item.title,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id,
                seller: item.seller,
            }));

            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice: 0.0,
                shippingPrice: 0.0,
                totalPrice: cartTotal,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            clearCart();
            setStep(3);
        } catch (error) {
            console.error(error);
            showToast("Failed to place order.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--bg-section-alt)] min-h-screen pt-32 pb-32 transition-colors duration-500 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                    >
                        {toast.type === 'error' ? <div className="h-5 w-5 bg-white text-red-500 rounded-full flex justify-center items-center text-xs font-black">X</div> : <CheckCircle className="h-5 w-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-center mb-16">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-slate-300'}`}>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-current font-black">1</div>
                        <span className="font-bold text-sm uppercase tracking-widest hidden sm:block">Shipping</span>
                    </div>
                    <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-slate-300'}`}>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-current font-black">2</div>
                        <span className="font-bold text-sm uppercase tracking-widest hidden sm:block">Payment</span>
                    </div>
                    <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-500' : 'text-slate-300'}`}>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-current font-black">3</div>
                        <span className="font-bold text-sm uppercase tracking-widest hidden sm:block">Success</span>
                    </div>
                </div>

                <div className="bg-[var(--bg-main)] rounded-[40px] premium-shadow border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 md:p-16">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <Truck className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Order Details</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] shadow-sm"
                                            value={shippingAddress.name} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Email Address</label>
                                        <input type="email" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] shadow-sm"
                                            value={shippingAddress.email} readOnly />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Phone Number</label>
                                    <input type="tel" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] shadow-sm"
                                        placeholder="09..."
                                        value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Dorm Block</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] shadow-sm"
                                            value={shippingAddress.dormBlock} onChange={e => setShippingAddress({ ...shippingAddress, dormBlock: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-1">Room Number</label>
                                        <input type="text" className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-orange-500/50 outline-none transition font-bold text-[var(--text-main)] shadow-sm"
                                            value={shippingAddress.roomNumber} onChange={e => setShippingAddress({ ...shippingAddress, roomNumber: e.target.value })} required />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 flex justify-end">
                                <button onClick={() => setStep(2)} disabled={!shippingAddress.phone || !shippingAddress.dormBlock || !shippingAddress.roomNumber} className="btn-primary !px-10 !py-4 flex items-center gap-2">
                                    Continue to Confirmation
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 md:p-16">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Payment Method</h2>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-[32px] border-2 border-orange-200 dark:border-orange-500/20 mb-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <CheckCircle className="h-6 w-6 text-orange-600" />
                                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Peer-to-Peer Transaction</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    Online payment is not required. You will pay the seller directly (face-to-face) upon delivery of your order at your dormitory.
                                </p>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-[32px] border-2 border-orange-200 dark:border-orange-500/20 mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-orange-600 font-bold uppercase tracking-widest text-[10px]">Order Value</span>
                                    <span className="font-black text-slate-900 dark:text-white">{cartTotal.toFixed(2)} {cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}</span>
                                </div>
                                <div className="h-px w-full bg-orange-200 dark:bg-orange-800/20 mb-6" />
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter">Amount to Pay</span>
                                    <span className="font-black text-orange-600 text-2xl">{cartTotal.toFixed(2)} {cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <button onClick={() => setStep(1)} className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition translate-y-[-2px]">
                                    Modify Details
                                </button>
                                <button onClick={handlePlaceOrder} disabled={loading} className="w-full sm:w-auto btn-primary !px-12 !py-5 flex items-center justify-center gap-3">
                                    {loading ? 'Processing Order...' : `Confirm Order for ${cartTotal.toFixed(2)} ${cartItems.length > 0 && cartItems[0].currency ? cartItems[0].currency : 'ETB'}`}
                                    {!loading && <ChevronRight className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-16 text-center">
                            <div className="h-32 w-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Order Confirmed!</h2>
                            <p className="text-slate-500 font-medium text-lg max-w-md mx-auto mb-10">Your elite items have been successfully purchased and are now being prepared for shipping by the sellers.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => navigate('/')} className="btn-primary !py-4 shadow-xl">Continue Shopping</button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Checkout;
