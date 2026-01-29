'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    X,
    Building2,
    Users,
    Tag,
    Globe,
    User,
    Mail,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const NewClientPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        client_name: '',
        client_code: '',
        group_name: '',
        industry: '',
        primary_contact_name: '',
        primary_contact_email: '',
        status: 'Active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.post('/clients', formData);
            router.push('/clients');
            router.refresh();
        } catch (err: any) {
            console.error('Error creating client:', err);
            setError(err.message || 'Failed to create client. Please check the data and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/clients"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Add New Client</h1>
                        <p className="text-slate-500 text-sm">Create a new client record in the portal.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <Building2 className="h-5 w-5 text-blue-500" />
                        <h2 className="font-bold text-slate-800">Company Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                Client Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                required
                                value={formData.client_name}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Client Code</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    name="client_code"
                                    value={formData.client_code}
                                    onChange={handleChange}
                                    placeholder="e.g. ACME001"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                Industry
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                                >
                                    <option value="">Select Industry</option>
                                    <option value="Energy">Energy</option>
                                    <option value="IT Services">IT Services</option>
                                    <option value="Banking">Banking</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Group Name</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    name="group_name"
                                    value={formData.group_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Group"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <User className="h-5 w-5 text-emerald-500" />
                        <h2 className="font-bold text-slate-800">Primary Contact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact Name</label>
                            <input
                                type="text"
                                name="primary_contact_name"
                                value={formData.primary_contact_name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    name="primary_contact_email"
                                    value={formData.primary_contact_email}
                                    onChange={handleChange}
                                    placeholder="e.g. john@acme.com"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link
                        href="/clients"
                        className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Client
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewClientPage;
