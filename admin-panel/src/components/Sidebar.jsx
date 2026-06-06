import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { logout } = useContext(AdminContext);

    const menuItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/products', icon: <ShoppingBag size={20} />, label: 'Products' },
        { path: '/chats', icon: <MessageSquare size={20} />, label: 'Chats' },
        { path: '/reports', icon: <BarChart3 size={20} />, label: 'Analytics' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <aside className="w-72 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col h-screen sticky top-0 transition-all duration-300">
            <div className="p-8 flex items-center gap-3">
                <div className="h-10 w-10 min-w-10 overflow-hidden rounded-xl shadow-lg shadow-orange-500/20 border border-[var(--border-color)]">
                    <img src="/astu-gebeya.jpg" alt="Astu Gebeya Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">ASTU</h1>
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Admin Central</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all
                            ${isActive
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-1'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'}
                        `}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-[var(--border-color)]">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
