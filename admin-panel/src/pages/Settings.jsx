import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Settings = () => {
    // Admin account state
    const [adminInfo, setAdminInfo] = useState({ email: '' });
    const [newEmail, setNewEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Staff management state
    const [staff, setStaff] = useState([]);
    const [inviteData, setInviteData] = useState({ name: '', email: '', password: '', adminRole: 'Viewer' });

    // Load admin info & staff list on mount
    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem('adminInfo')) || {};
        setAdminInfo({ email: admin.email || '' });
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/staff`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` },
            });
            setStaff(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load staff');
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/account/email`,
                { email: newEmail },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` } }
            );
            toast.success('Email updated');
            setAdminInfo((prev) => ({ ...prev, email: newEmail }));
            setNewEmail('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update email');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/account/password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` } }
            );
            toast.success('Password updated');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff`,
                inviteData,
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` } }
            );
            toast.success('Staff invited');
            setInviteData({ name: '', email: '', password: '', adminRole: 'Viewer' });
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to invite staff');
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff/${id}/role`,
                { adminRole: role },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` } }
            );
            toast.success('Role updated');
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleRemove = async (id) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff/${id}`,
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo')).token}` } }
            );
            toast.success('Staff removed');
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove staff');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <Toaster position="top-right" />
            {/* Configuration Cards */}
            <div>
                <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Configuration</h2>
                {/* Configuration settings are managed elsewhere */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {<div className="mt-6"><p>No configuration sections available.</p></div>}
                </div>
            </div>

            {/* Admin Account Management */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4">Admin Account Settings</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Email Change */}
                    <form onSubmit={handleEmailUpdate} className="space-y-4 p-6 bg-[var(--bg-section)] rounded-xl">
                        <h4 className="text-xl font-semibold">Change Email</h4>
                        <p>Current: <span className="font-medium">{adminInfo.email}</span></p>
                        <input
                            type="email"
                            placeholder="New email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="input w-full input-highlight"
                            required
                        />
                        <button type="submit" className="btn-primary w-full">Update Email</button>
                    </form>
                    {/* Password Change */}
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 p-6 bg-[var(--bg-section)] rounded-xl">
                        <h4 className="text-xl font-semibold">Change Password</h4>
                        <input
                            type="password"
                            placeholder="Old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="input w-full input-highlight"
                            required
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input w-full input-highlight"
                            required
                        />
                        <button type="submit" className="btn-primary w-full">Update Password</button>
                    </form>
                </div>
            </div>

            {/* Staff Management */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4">Staff Management</h3>
                {/* Invite Form */}
                <form onSubmit={handleInvite} className="grid md:grid-cols-4 gap-4 p-6 bg-[var(--bg-section)] rounded-xl mb-6">
                    <input
                        type="text"
                        placeholder="Name"
                        value={inviteData.name}
                        onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                        className="input"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                        className="input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={inviteData.password}
                        onChange={(e) => setInviteData({ ...inviteData, password: e.target.value })}
                        className="input"
                        required
                    />
                    <select
                        value={inviteData.adminRole}
                        onChange={(e) => setInviteData({ ...inviteData, adminRole: e.target.value })}
                        className="input"
                    >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Super Admin">Super Admin</option>
                    </select>
                    <button type="submit" className="btn-primary col-span-full">Invite Staff</button>
                </form>
                {/* Staff List */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[var(--bg-section)] rounded-xl">
                        <thead>
                            <tr className="bg-[var(--bg-main)]">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member._id} className="border-b border-[var(--border-color)]">
                                    <td className="px-4 py-2">{member.name}</td>
                                    <td className="px-4 py-2">{member.email}</td>
                                    <td className="px-4 py-2">
                                        {/* Role Badge */}
                                        <span className={`role-badge role-${member.adminRole.toLowerCase().replace(' ', '-')}`}>{member.adminRole}</span>
                                        {/* Role Selector */}
                                        <select
                                            value={member.adminRole}
                                            onChange={(e) => handleRoleChange(member._id, e.target.value)}
                                            className="input ml-2"
                                        >
                                            <option value="Viewer">Viewer</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2 text-center space-x-2">
                                        <button onClick={() => handleRemove(member._id)} className="btn-danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
