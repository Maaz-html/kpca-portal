'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    CreditCard,
    Calendar,
    FileText,
    IndianRupee,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Invoice } from '@/types';

const NewReceiptPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        invoice_no: '',
        amount_received: 0,
        tds_amount: 0,
        receipt_date: new Date().toISOString().split('T')[0],
        mode: 'NEFT'
    });

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await api.get('/invoices');
                // Only show uncollected (simplified: just list all issued invoices)
                setInvoices(data.filter((i: Invoice) => i.status !== 'Paid'));
            } catch (err) {
                console.error('Error fetching invoices:', err);
            }
        };
        fetchInvoices();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'invoice_no' && value !== '') {
            const selectedInv = invoices.find(inv => inv.invoice_no === value);
            if (selectedInv) {
                setFormData(prev => ({
                    ...prev,
                    invoice_no: value,
                    amount_received: selectedInv.amount_with_tax
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: (name === 'amount_received' || name === 'tds_amount') ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.post('/receipts', formData);
            router.push('/billing');
            router.refresh();
        } catch (err: any) {
            console.error('Error recording receipt:', err);
            setError(err.message || 'Failed to record receipt. Please check the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/billing"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Record Receipt</h1>
                        <p className="text-slate-500 text-sm">Capture payment details for an issued invoice.</p>
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
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h2 className="font-bold text-slate-800">Invoice Selection</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Select Invoice <span className="text-rose-500">*</span></label>
                            <select
                                name="invoice_no"
                                required
                                value={formData.invoice_no}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white font-medium"
                            >
                                <option value="">Select an Invoice</option>
                                {invoices.map(inv => (
                                    <option key={inv.invoice_no} value={inv.invoice_no}>
                                        {inv.invoice_no} - {inv.assignment_code} ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inv.amount_with_tax)})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <CreditCard className="h-5 w-5 text-emerald-500" />
                        <h2 className="font-bold text-slate-800">Payment Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Amount Received (Net of TDS)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="amount_received"
                                    required
                                    value={formData.amount_received}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">TDS Amount (if any)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="tds_amount"
                                    value={formData.tds_amount}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Receipt Date</label>
                            <input
                                type="date"
                                name="receipt_date"
                                value={formData.receipt_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Payment Mode</label>
                            <select
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white font-medium"
                            >
                                <option value="NEFT">NEFT / RTGS</option>
                                <option value="Cheque">Cheque</option>
                                <option value="UPI">UPI</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link
                        href="/billing"
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
                                Recording...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Record Payment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewReceiptPage;
