'use client';

import React, { useEffect, useState } from 'react';
import {
    Receipt,
    Search,
    Download,
    Filter,
    Plus,
    MoreVertical,
    Loader2,
    FileText,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { Invoice, Receipt as ReceiptType } from '@/types';
import Link from 'next/link';

const BillingPage = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [receipts, setReceipts] = useState<ReceiptType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'invoices' | 'receipts'>('invoices');
    const [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                setLoading(true);
                const [invoicesData, receiptsData] = await Promise.all([
                    api.get('/invoices'),
                    api.get('/receipts')
                ]);
                setInvoices(invoicesData);
                setReceipts(receiptsData);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching billing data:', err);
                setError(err.message || 'Failed to load billing data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            await api.downloadExport(activeTab);
        } catch (err: any) {
            console.error('Export failed:', err);
            alert(`Failed to export ${activeTab}. Please try again.`);
        } finally {
            setLoadingExport(false);
        }
    };

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount_with_tax, 0);
    const totalCollected = receipts.reduce((sum, rec) => sum + rec.amount_received, 0);
    const outstanding = totalInvoiced - totalCollected;

    const getInvoiceStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700';
            case 'Issued': return 'bg-blue-100 text-blue-700';
            case 'Overdue': return 'bg-rose-100 text-rose-700';
            case 'Cancelled': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Billing & Collections</h1>
                    <p className="text-slate-500">Manage invoices, track payments, and monitor AR aging.</p>
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
                        href="/billing/receipt/new"
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowDownLeft className="mr-2 h-4 w-4 text-emerald-500" />
                        Record Receipt
                    </Link>
                    <Link
                        href="/billing/invoice/new"
                        className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Invoice
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Invoiced</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalInvoiced)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Collected</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalCollected)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Outstanding AR</p>
                    <p className="text-2xl font-bold text-rose-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(outstanding)}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('receipts')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'receipts'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Receipts
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                            <p className="text-slate-500 text-sm">Loading billing records...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                            <AlertCircle className="h-10 w-10 text-rose-500 mb-4" />
                            <p className="text-rose-600 font-medium mb-2">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline text-sm">Refresh page</button>
                        </div>
                    ) : activeTab === 'invoices' ? (
                        <div className="overflow-x-auto">
                            {invoices.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 py-20 text-slate-400">
                                    <FileText className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No invoices found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Invoice #</th>
                                            <th className="px-6 py-4">Assignment</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Amount (Gross)</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {invoices.map((inv) => (
                                            <tr key={inv.invoice_no} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{inv.invoice_no}</td>
                                                <td className="px-6 py-4 text-slate-900 font-medium">{inv.assignment_code}</td>
                                                <td className="px-6 py-4 text-slate-500 text-xs">{inv.invoice_date}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inv.amount_with_tax)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[11px] font-medium ${getInvoiceStatusStyle(inv.status)}`}>
                                                        {inv.status}
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
                    ) : (
                        <div className="overflow-x-auto">
                            {receipts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <CreditCard className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No receipts found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Receipt ID</th>
                                            <th className="px-6 py-4">Invoice #</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Mode</th>
                                            <th className="px-6 py-4 text-right">Amount Received</th>
                                            <th className="px-6 py-4 text-right">TDS Ded.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {receipts.map((rec) => (
                                            <tr key={rec.receipt_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-500">#{rec.receipt_id}</td>
                                                <td className="px-6 py-4 text-blue-600 font-bold font-mono text-xs">{rec.invoice_no}</td>
                                                <td className="px-6 py-4 text-slate-500 text-xs">{rec.receipt_date}</td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-tighter">{rec.mode}</td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rec.amount_received)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-rose-500 text-xs">
                                                    -{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rec.tds_amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
