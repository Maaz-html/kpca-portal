'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Search,
    Download,
    Filter,
    Plus,
    MoreVertical,
    Loader2,
    Upload
} from 'lucide-react';
import { api } from '@/lib/api';
import { Client } from '@/types';
import Link from 'next/link';

const ClientsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const data = await api.get('/clients');
                setClients(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching clients:', err);
                setError(err.message || 'Failed to load clients. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            await api.downloadExport('clients');
        } catch (err: any) {
            console.error('Export failed:', err);
            alert('Failed to export clients. Please try again.');
        } finally {
            setLoadingExport(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoadingExport(true); // Using same loading state for simplicity or add loadingUpload
            await api.uploadFile('clients', file);
            alert('Clients uploaded successfully!');
            window.location.reload(); // Refresh to show new data
        } catch (err: any) {
            console.error('Upload failed:', err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setLoadingExport(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.client_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                    <p className="text-slate-500">Manage firm clients and their relationship partners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        id="bulk-upload"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleUpload}
                    />
                    <button
                        onClick={() => document.getElementById('bulk-upload')?.click()}
                        disabled={loadingExport}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Bulk Upload
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={loadingExport}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loadingExport ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                        ) : (
                            <Download className="mr-2 h-4 w-4" />
                        )}
                        {loadingExport ? 'Processing...' : 'Export'}
                    </button>
                    <Link
                        href="/clients/new"
                        className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                            <p className="text-slate-500 text-sm">Loading clients...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <p className="text-rose-600 font-medium mb-2">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Try refreshing the page
                            </button>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500 text-sm">No clients found matching your search.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Client Code</th>
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Group</th>
                                    <th className="px-6 py-4">Industry</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredClients.map((client) => (
                                    <tr key={client.id || client.client_code} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{client.client_code || 'PENDING'}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{client.client_name}</td>
                                        <td className="px-6 py-4 text-slate-600">{client.group_name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">
                                                {client.industry || 'Other'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[11px] font-medium ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && !error && filteredClients.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs text-slate-500">
                        <p>Showing {filteredClients.length} clients</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientsPage;
