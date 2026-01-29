'use client';

import React, { useEffect, useState } from 'react';
import {
    Briefcase,
    Search,
    Download,
    Filter,
    Plus,
    MoreVertical,
    Loader2,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { Assignment } from '@/types';
import Link from 'next/link';

const AssignmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const data = await api.get('/assignments');
                setAssignments(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching assignments:', err);
                setError(err.message || 'Failed to load assignments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            await api.downloadExport('assignments');
        } catch (err: any) {
            console.error('Export failed:', err);
            alert('Failed to export assignments. Please try again.');
        } finally {
            setLoadingExport(false);
        }
    };

    const filteredAssignments = assignments.filter(asg =>
        asg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asg.assignment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asg.client_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            case 'Ongoing': return 'bg-blue-100 text-blue-700';
            case 'Planned': return 'bg-slate-100 text-slate-700';
            case 'On Hold': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
                    <p className="text-slate-500">Manage ongoing engagements and resource allocation.</p>
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
                        href="/assignments/new"
                        className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Assignment
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search assignments, clients, or codes..."
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
                            <p className="text-slate-500 text-sm">Loading assignments...</p>
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
                    ) : filteredAssignments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Briefcase className="h-12 w-12 text-slate-200 mb-4" />
                            <p className="text-slate-500 text-sm">No assignments found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Title & Client</th>
                                    <th className="px-6 py-4">Service Line</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAssignments.map((asg) => (
                                    <tr key={asg.assignment_code} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{asg.assignment_code}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{asg.title}</p>
                                                <p className="text-xs text-slate-500">{asg.client_code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">
                                                {asg.service_line || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-xs text-slate-500 gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{asg.start_date || 'TBD'}</span>
                                                </div>
                                                {asg.end_date && (
                                                    <div className="flex items-center gap-1 text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        <span>to {asg.end_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[11px] font-medium ${getStatusStyle(asg.status)}`}>
                                                {asg.status}
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

export default AssignmentsPage;
