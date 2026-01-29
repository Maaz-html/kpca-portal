'use client';

import React, { useEffect, useState } from 'react';
import {
    Activity,
    Search,
    Filter,
    Clock,
    User,
    Tag,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';

interface AuditLog {
    id: number;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: string;
    created_at: string;
}

const AuditLogsPage = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const data = await api.get('/audit-logs');
                setLogs(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching audit logs:', err);
                setError(err.message || 'Failed to load audit logs.');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        switch (action.toUpperCase()) {
            case 'CREATE': return 'bg-emerald-100 text-emerald-700';
            case 'UPDATE': return 'bg-blue-100 text-blue-700';
            case 'DELETE': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                <p className="text-slate-500">Track all system activities and data modifications.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-500 text-sm">Loading activity logs...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center px-6">
                        <AlertCircle className="h-10 w-10 text-rose-500 mb-4" />
                        <p className="text-rose-600 font-medium mb-2">{error}</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                        <Activity className="h-12 w-12 mb-2 opacity-20" />
                        <p>No activity logs found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {log.details || `${log.action} action on ${log.entity_type}`}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5 line-clamp-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span className="font-medium text-slate-700 uppercase tracking-tight truncate max-w-[120px]">
                                                        {log.user_id}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Tag className="h-3.5 w-3.5" />
                                                    <span className="capitalize">{log.entity_type}: {log.entity_id}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{new Date(log.created_at).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogsPage;
