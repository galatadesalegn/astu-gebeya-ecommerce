import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { admin } = useContext(AdminContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get(`/api/admin/stats`);
                setStats(data);
            } catch (error) {
                console.error("Stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [admin.token]);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'Revenue',
                data: [3000, 4500, 4200, 6800, 7200, 8500],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.05)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { display: false },
            x: { grid: { display: false } }
        }
    };

    if (loading) return <div>Loading...</div>;

    const cards = [
        { label: 'Total Revenue', value: `$${stats?.revenue?.toLocaleString()}`, icon: <DollarSign />, color: 'bg-emerald-50 text-emerald-600', trend: '+12.5%' },
        { label: 'Active Users', value: stats?.users, icon: <Users />, color: 'bg-blue-50 text-blue-600', trend: '+5.2%' },
        { label: 'Total Products', value: stats?.products, icon: <ShoppingBag />, color: 'bg-orange-50 text-orange-600', trend: '+24.1%' },
        { label: 'Completed Orders', value: stats?.orders, icon: <TrendingUp />, color: 'bg-purple-50 text-purple-600', trend: '+8.4%' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Command Center</h2>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Analytical insights for {new Date().toLocaleDateString()}</p>
                </div>
                <button className="btn-primary">
                    Generate Monthly Report
                    <ArrowUpRight size={18} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="admin-card p-8 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className={`${card.color} p-4 rounded-2xl`}>
                                {card.icon}
                            </div>
                            <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                {card.trend}
                                <ArrowUpRight size={12} className="ml-1" />
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{card.label}</p>
                            <h3 className="text-3xl font-black text-[var(--text-main)] mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 admin-card p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Revenue Stream</h3>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Real-time performance metrics</p>
                        </div>
                        <select className="bg-[var(--bg-main)] border-none rounded-xl text-xs font-black uppercase tracking-widest px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Current Year</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-card p-8">
                    <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight mb-6">Recent Sales</h3>
                    <div className="space-y-6">
                        {stats?.recentOrders?.map((order, i) => (
                            <div key={i} className="flex items-center justify-between pb-6 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-[var(--bg-section-alt)] flex items-center justify-center font-black text-[10px]">
                                        {order.user?.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-main)] uppercase truncate max-w-[100px]">{order.user?.name}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-[var(--text-main)]">${order.totalPrice}</p>
                                    <p className="text-[9px] font-black uppercase text-emerald-500">Paid</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
