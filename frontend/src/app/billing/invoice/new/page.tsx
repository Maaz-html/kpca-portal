'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    FileText,
    Calendar,
    Briefcase,
    Percent,
    IndianRupee,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Assignment } from '@/types';

const NewInvoicePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        invoice_no: '',
        assignment_code: '',
        invoice_date: new Date().toISOString().split('T')[0],
        amount_before_tax: 0,
        gst_pct: 18.00,
        due_date: '',
        status: 'Issued'
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await api.get('/assignments');
                setAssignments(data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            }
        };
        fetchAssignments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'amount_before_tax' || name === 'gst_pct') ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const payload = {
                ...formData,
                due_date: formData.due_date || null
            };

            await api.post('/invoices', payload);
            router.push('/billing');
            router.refresh();
        } catch (err: any) {
            console.error('Error creating invoice:', err);
            setError(err.message || 'Failed to generate invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const amountWithTax = formData.amount_before_tax * (1 + formData.gst_pct / 100);

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
                        <h1 className="text-2xl font-bold text-slate-900">Generate Invoice</h1>
                        <p className="text-slate-500 text-sm">Create a new bill for an active assignment.</p>
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
                        <h2 className="font-bold text-slate-800">Assignment Selection</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Select Assignment <span className="text-rose-500">*</span></label>
                            <select
                                name="assignment_code"
                                required
                                value={formData.assignment_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white font-medium"
                            >
                                <option value="">Select an Assignment</option>
                                {assignments.map(asg => (
                                    <option key={asg.assignment_code} value={asg.assignment_code}>
                                        {asg.assignment_code} - {asg.title} ({asg.client_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <FileText className="h-5 w-5 text-emerald-500" />
                        <h2 className="font-bold text-slate-800">Invoice Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Invoice Number <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                name="invoice_no"
                                required
                                placeholder="e.g. INV/2024/001"
                                value={formData.invoice_no}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Invoice Date</label>
                            <input
                                type="date"
                                name="invoice_date"
                                value={formData.invoice_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Amount Before Tax (INR)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="amount_before_tax"
                                    value={formData.amount_before_tax}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">GST %</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="gst_pct"
                                    step="0.01"
                                    value={formData.gst_pct}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-center">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Gross Amount</p>
                            <p className="text-2xl font-black text-slate-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amountWithTax)}
                            </p>
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
                                Generating...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Invoice
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewInvoicePage;
