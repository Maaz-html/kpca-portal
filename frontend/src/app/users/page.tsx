'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Shield,
    Mail,
    Edit2,
    Check,
    X,
    Loader2,
    AlertCircle,
    UserCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

const UserManagementPage = () => {
    const { role: currentUserRole } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [newRole, setNewRole] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await api.get('/users');
                setUsers(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching users:', err);
                setError(err.message || 'Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUserRole === 'PARTNER') {
            fetchUsers();
        } else {
            setError('Access Denied: Only Partners can manage users.');
            setLoading(false);
        }
    }, [currentUserRole]);

    const handleUpdateRole = async (userId: string) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingUserId(null);
        } catch (err: any) {
            alert('Failed to update role: ' + err.message);
        }
    };

    const roles = ['PARTNER', 'DIRECTOR', 'MANAGER'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 font-tight">User Management</h1>
                <p className="text-slate-500">Manage firm members and their access levels.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-500 text-sm">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <AlertCircle className="h-10 w-10 text-rose-500 mb-4" />
                        <p className="text-rose-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100 uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Current Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <UserCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 leading-tight">{user.full_name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingUserId === user.id ? (
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                className="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            >
                                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${user.role === 'PARTNER' ? 'bg-blue-100 text-blue-700' :
                                                    user.role === 'DIRECTOR' ? 'bg-indigo-100 text-indigo-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingUserId === user.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateRole(user.id)}
                                                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingUserId(null)}
                                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingUserId(user.id);
                                                    setNewRole(user.role);
                                                }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
