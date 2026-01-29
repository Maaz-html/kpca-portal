'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  FileText,
  Clock,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    activeClients: 0,
    openProposals: 0,
    ongoingAssignments: 0,
    overdueInvoices: 0,
    recentProposals: [] as any[],
    recentAssignments: [] as any[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch base counts
        const [clients, proposals, assignments] = await Promise.all([
          api.get('/clients'),
          api.get('/proposals'),
          api.get('/assignments')
        ]);

        let billingStats = { outstanding: 0 };
        // Role-restricted reporting
        if (role === 'PARTNER' || role === 'DIRECTOR') {
          try {
            billingStats = await api.get('/reports/billing');
          } catch (e) {
            console.warn('Could not fetch billing report:', e);
          }
        }

        setData({
          activeClients: clients.length,
          openProposals: proposals.filter((p: any) => p.status === 'Issued' || p.status === 'Draft').length,
          ongoingAssignments: assignments.filter((a: any) => a.status === 'Ongoing').length,
          overdueInvoices: 0, // Simplified for now
          recentProposals: proposals.slice(0, 5),
          recentAssignments: assignments.slice(0, 5)
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  const stats = [
    { name: 'Active Clients', value: data.activeClients.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Open Proposals', value: data.openProposals.toString(), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Ongoing Assignments', value: data.ongoingAssignments.toString(), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Overdue Invoices', value: data.overdueInvoices.toString(), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Firm Overview</h1>
        <p className="text-slate-500">Summary of key performance indicators for KPCA.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                  <dd className="text-lg font-bold text-slate-900 tracking-tight">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Proposals</h2>
          <div className="space-y-4">
            {data.recentProposals.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No recent proposals.</p>
            ) : (
              data.recentProposals.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-50 font-sans">
                  <div>
                    <p className="font-semibold text-slate-800 tracking-tight">{p.client_code}</p>
                    <p className="text-xs text-slate-500">Service: {p.service_line || 'General'} • Issued {p.issued_date}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${p.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {p.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ongoing Assignments</h2>
          <div className="space-y-4">
            {data.recentAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No ongoing assignments.</p>
            ) : (
              data.recentAssignments.map((a, i) => (
                <div key={i} className="flex items-center space-x-4 py-1">
                  <div className="p-2 rounded bg-slate-50/50">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 tracking-tight text-sm">{a.title}</p>
                    <p className="text-[11px] text-slate-500 uppercase font-medium">#{a.assignment_code} • Start: {a.start_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
