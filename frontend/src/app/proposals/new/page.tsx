'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    FileText,
    TrendingUp,
    Briefcase,
    Calendar,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Client } from '@/types';

const NewProposalPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        client_code: '',
        service_line: '',
        scope_summary: '',
        estimated_fees: 0,
        issued_date: new Date().toISOString().split('T')[0],
        status: 'Draft'
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await api.get('/clients');
                setClients(data);
            } catch (err) {
                console.error('Error fetching clients:', err);
            }
        };
        fetchClients();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estimated_fees' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.post('/proposals', formData);
            router.push('/proposals');
            router.refresh();
        } catch (err: any) {
            console.error('Error creating proposal:', err);
            setError(err.message || 'Failed to create proposal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/proposals"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create New Proposal</h1>
                        <p className="text-slate-500 text-sm">Issue a new service proposal to a client.</p>
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
                        <Briefcase className="h-5 w-5 text-blue-500" />
                        <h2 className="font-bold text-slate-800">Proposal Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                Client <span className="text-rose-500">*</span>
                            </label>
                            <select
                                name="client_code"
                                required
                                value={formData.client_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white font-medium"
                            >
                                <option value="">Select a Client</option>
                                {clients.map(client => (
                                    <option key={client.client_code} value={client.client_code}>
                                        {client.client_name} ({client.client_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Service Line</label>
                            <select
                                name="service_line"
                                value={formData.service_line}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white font-medium"
                            >
                                <option value="">Select Service Line</option>
                                <option value="Audit">Audit</option>
                                <option value="Tax">Tax</option>
                                <option value="Advisory">Advisory</option>
                                <option value="Secretarial">Secretarial</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Scope Summary</label>
                            <textarea
                                name="scope_summary"
                                rows={4}
                                value={formData.scope_summary}
                                onChange={handleChange}
                                placeholder="Summary of the proposed services..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Estimated Fees (INR)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    name="estimated_fees"
                                    value={formData.estimated_fees}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Issued Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    name="issued_date"
                                    value={formData.issued_date}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link
                        href="/proposals"
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
                                Issuing...
                            </>
                        ) : (
                            <>
                                <FileText className="mr-2 h-4 w-4" />
                                Issue Proposal
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProposalPage;
