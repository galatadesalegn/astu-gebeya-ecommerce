import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Search,
    Filter,
    MoreHorizontal,
    User as UserIcon,
    Mail,
    Shield,
    Trash2,
    CheckCircle2,
    XCircle,
    UserCheck,
    AlertOctagon,
    Ban,
    Edit3,
    ShieldAlert,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const { admin } = useContext(AdminContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', role: '' });

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(data.users || []);
        } catch (error) {
            console.error("Users fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [admin.token]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Update failed");
        }
    };

    const handleToggleVerify = async (userId) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${userId}/verify`, {}, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(users.map(u => u._id === userId ? data : u));
        } catch (error) {
            alert("Verification update failed");
        }
    };

    const handleToggleSuspend = async (userId) => {
        if (!window.confirm("Are you sure you want to change this user's suspension status?")) return;
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(users.map(u => u._id === userId ? data : u));
        } catch (error) {
            alert("Suspension update failed");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("CRITICAL: Delete this user permanently? This action cannot be undone.")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${selectedUser._id}`, editData, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            setUsers(users.map(u => u._id === selectedUser._id ? data : u));
            setEditMode(false);
            setSelectedUser(null);
        } catch (error) {
            alert("Edit failed");
        }
    };

    const filteredUsers = users
        .filter(user =>
            ((user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'All' || user.role === roleFilter)
        )
        .sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-b-2"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">User Command</h2>
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Oversee directory, permissions, and status</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Buyer">Buyers</option>
                        <option value="Seller">Sellers</option>
                        <option value="Admin">Admins</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-50 transition-all group"
                        title="Sort Date"
                    >
                        <ArrowUpDown size={20} className={sortOrder === 'oldest' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="admin-card overflow-x-auto shadow-2xl shadow-gray-200/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
                            <th className="px-8 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">User Identity</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Role Authority</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Registry Date</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Security Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className={`hover:bg-[var(--bg-main)]/40 transition-all group ${user.isSuspended ? 'bg-red-50/10' : ''}`}>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`h-14 w-14 rounded-[20px] flex items-center justify-center border-2 transition-all duration-500
                                            ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                user.role === 'Seller' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                                            group-hover:scale-110 group-hover:rotate-3
                                        `}>
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-[var(--text-main)] uppercase tracking-tight text-sm leading-none flex items-center gap-2">
                                                {user.name}
                                                {user.isVerified && <UserCheck size={14} className="text-emerald-500" />}
                                                {user.isSuspended && <ShieldAlert size={14} className="text-red-500" />}
                                            </p>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
                                                <Mail size={10} />
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-none focus:ring-4 focus:ring-orange-500/10 outline-none cursor-pointer transition-all
                                                ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'Seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                                            `}
                                        >
                                            <option value="Buyer">Buyer</option>
                                            <option value="Seller">Seller</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <Calendar size={14} className="opacity-50" />
                                        <span className="text-[11px] font-bold">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleToggleVerify(user._id)}
                                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit transition-all
                                                ${user.isVerified
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-transparent hover:bg-emerald-50 hover:text-emerald-500'}
                                            `}
                                        >
                                            <CheckCircle2 size={12} />
                                            {user.isVerified ? 'Verified Account' : 'Mark Verified'}
                                        </button>
                                        {user.role === 'Seller' && !user.isVerified && (
                                            <span className="text-[8px] font-bold text-orange-500 animate-pulse uppercase tracking-widest ml-1">Requires Review</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 outline-none">
                                        <button
                                            onClick={() => { setSelectedUser(user); setEditData({ name: user.name, email: user.email, role: user.role }); setEditMode(true); }}
                                            className="p-3 bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                                            title="Edit Profile"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleSuspend(user._id)}
                                            className={`p-3 rounded-xl transition-all
                                                ${user.isSuspended
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500'}
                                            `}
                                            title={user.isSuspended ? "Unsuspend Account" : "Suspend Account"}
                                        >
                                            <AlertOctagon size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-3 bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-black hover:text-white rounded-xl transition-all"
                                            title="Permanently Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="h-20 w-20 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-[var(--text-main)] uppercase">No operatives found</h3>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Edit Modal Overlay */}
            <AnimatePresence>
                {editMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[var(--bg-card)] rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setEditMode(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter leading-none">Modify Profile</h3>
                                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-2">Adjusting system permissions for {selectedUser?.name}</p>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">User Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[var(--bg-main)] border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">System Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-[var(--bg-main)] border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Access Level</label>
                                    <select
                                        className="w-full bg-[var(--bg-main)] border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                                        value={editData.role}
                                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    >
                                        <option value="Buyer">Buyer</option>
                                        <option value="Seller">Seller</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 mt-4"
                                >
                                    Push Update to Database
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Users;
