'use client';

import React, { useEffect, useState } from 'react';
import {
    FileText,
    Search,
    Download,
    Filter,
    Plus,
    MoreVertical,
    Loader2,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { Proposal } from '@/types';
import Link from 'next/link';

const ProposalsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                setLoading(true);
                const data = await api.get('/proposals');
                setProposals(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching proposals:', err);
                setError(err.message || 'Failed to load proposals. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const handleExport = async () => {
            try {
                setLoadingExport(true);
                await api.downloadExport('proposals');
            } catch (err: any) {
                console.error('Export failed:', err);
                alert('Failed to export proposals. Please try again.');
            } finally {
                setLoadingExport(false);
            }
        };

        fetchProposals();
    }, []);

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            await api.downloadExport('proposals');
        } catch (err: any) {
            console.error('Export failed:', err);
            alert('Failed to export proposals. Please try again.');
        } finally {
            setLoadingExport(false);
        }
    };

    const filteredProposals = proposals.filter(proposal =>
        proposal.client_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.service_line?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.scope_summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-100 text-emerald-700';
            case 'Rejected': return 'bg-rose-100 text-rose-700';
            case 'Issued': return 'bg-blue-100 text-blue-700';
            case 'Draft': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
                    <p className="text-slate-500">Track and manage client service proposals.</p>
                </div>
                <div className="flex items-center gap-3">
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
                        {loadingExport ? 'Exporting...' : 'Export'}
                    </button>
                    <Link
                        href="/proposals/new"
                        className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Proposal
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by client or service line..."
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
                            <p className="text-slate-500 text-sm">Loading proposals...</p>
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
                    ) : filteredProposals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-500 text-sm">No proposals found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Service Line</th>
                                    <th className="px-6 py-4">Est. Fees</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProposals.map((proposal) => (
                                    <tr key={proposal.proposal_id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{proposal.proposal_id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{proposal.client_code}</td>
                                        <td className="px-6 py-4 text-slate-600">{proposal.service_line || '-'}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(proposal.estimated_fees)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {proposal.issued_date || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[11px] font-medium ${getStatusStyle(proposal.status)}`}>
                                                {proposal.status}
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
            </div>
        </div>
    );
};

export default ProposalsPage;
