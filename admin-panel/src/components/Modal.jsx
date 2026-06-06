import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle2, Info } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?", 
    type = "warning", // warning, success, info, danger
    confirmText = "Confirm",
    cancelText = "Cancel",
    isAlert = false
}) => {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'danger': return { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50', border: 'border-red-100', icon: <AlertTriangle className="w-6 h-6 text-red-500" /> };
            case 'success': return { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" /> };
            case 'info': return { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50', border: 'border-blue-100', icon: <Info className="w-6 h-6 text-blue-500" /> };
            default: return { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', border: 'border-orange-100', icon: <AlertTriangle className="w-6 h-6 text-orange-500" /> };
        }
    };

    const colors = getColors();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
                    >
                        <div className="p-10">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-14 w-14 ${colors.light} rounded-2xl flex items-center justify-center shadow-inner`}>
                                    {colors.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{title}</h3>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${colors.text}`}>{type} protocol</p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="ml-auto p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-slate-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Message */}
                            <p className="text-slate-500 font-jakarta font-medium leading-relaxed mb-10">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-4">
                                {!isAlert && (
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-6 py-4 bg-gray-50 text-slate-400 rounded-2xl text-xs font-jakarta font-black uppercase tracking-widest hover:bg-gray-100 hover:text-slate-600 transition-all active:scale-95"
                                    >
                                        {cancelText}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        if (isAlert) onClose();
                                    }}
                                    className={`flex-1 px-6 py-4 ${colors.bg} text-white rounded-2xl text-xs font-jakarta font-black uppercase tracking-widest hover:opacity-90 shadow-xl transition-all active:scale-95`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className={`h-2 w-full ${colors.bg} opacity-20`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;