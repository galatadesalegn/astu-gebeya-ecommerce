import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Intelligence</h2>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Sales reports and platform analytics</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-orange-500 transition-all">
                        <Calendar size={18} />
                        Select Date
                    </button>
                    <button className="btn-primary">
                        <Download size={18} />
                        Export Data
                    </button>
                </div>
            </div>

            <div className="admin-card p-20 flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-6 border border-orange-100">
                    <BarChart3 size={32} />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Advanced Analytics Portal</h3>
                <p className="max-w-md text-[var(--text-muted)] font-medium text-sm mt-4">This section is being populated with real-time sales and performance data from your marketplace nodes.</p>
            </div>
        </motion.div>
    );
};

export default Reports;
