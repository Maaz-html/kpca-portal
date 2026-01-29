'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    Briefcase,
    Calendar,
    Users,
    Tag,
    Loader2,
    FileText,
    Calculator
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Client, Proposal } from '@/types';

const NewAssignmentPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        assignment_code: '',
        client_code: '',
        proposal_id: '',
        title: '',
        service_line: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        contracted_fee: 0,
        status: 'Planned',
        // Placeholders for team - usually UUIDs
        partner_lead: null,
        director: null,
        manager: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsData, proposalsData] = await Promise.all([
                    api.get('/clients'),
                    api.get('/proposals')
                ]);
                setClients(clientsData);
                setProposals(proposalsData.filter((p: Proposal) => p.status === 'Accepted'));
            } catch (err) {
                console.error('Error fetching dependency data:', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'proposal_id' && value !== '') {
            const selectedProposal = proposals.find(p => p.proposal_id === parseInt(value));
            if (selectedProposal) {
                setFormData(prev => ({
                    ...prev,
                    proposal_id: value,
                    client_code: selectedProposal.client_code,
                    service_line: selectedProposal.service_line || '',
                    contracted_fee: selectedProposal.estimated_fees,
                    title: `${selectedProposal.service_line || 'Service'} for ${selectedProposal.client_code}`
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'contracted_fee' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            // Prepare payload
            const payload = {
                ...formData,
                proposal_id: formData.proposal_id ? parseInt(formData.proposal_id) : null,
                end_date: formData.end_date || null
            };

            await api.post('/assignments', payload);
            router.push('/assignments');
            router.refresh();
        } catch (err: any) {
            console.error('Error creating assignment:', err);
            setError(err.message || 'Failed to create assignment. Please check the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/assignments"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Assignment</h1>
                        <p className="text-slate-500 text-sm">Convert a proposal to an active engagement.</p>
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
                        <Tag className="h-5 w-5 text-blue-500" />
                        <h2 className="font-bold text-slate-800">Source & Identification</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Link to Accepted Proposal</label>
                            <select
                                name="proposal_id"
                                value={formData.proposal_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                            >
                                <option value="">Select a Proposal (Optional)</option>
                                {proposals.map(p => (
                                    <option key={p.proposal_id} value={p.proposal_id}>
                                        #{p.proposal_id} - {p.client_code} ({p.service_line})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                Assignment Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="assignment_code"
                                required
                                placeholder="e.g. ASG-2024-001"
                                value={formData.assignment_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Assignment Title <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="e.g. Statutory Audit FY 2023-24"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <Calculator className="h-5 w-5 text-emerald-500" />
                        <h2 className="font-bold text-slate-800">Engagement Scope & Fees</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Client Code</label>
                            <input
                                type="text"
                                name="client_code"
                                readOnly={formData.proposal_id !== ''}
                                value={formData.client_code}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${formData.proposal_id ? 'bg-slate-50' : 'bg-white'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Service Line</label>
                            <select
                                name="service_line"
                                value={formData.service_line}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white"
                            >
                                <option value="">Select Service Line</option>
                                <option value="Audit">Audit</option>
                                <option value="Tax">Tax</option>
                                <option value="Advisory">Advisory</option>
                                <option value="Secretarial">Secretarial</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contracted Fee (INR)</label>
                            <input
                                type="number"
                                name="contracted_fee"
                                value={formData.contracted_fee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Current Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white"
                            >
                                <option value="Planned">Planned</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                        <Calendar className="h-5 w-5 text-amber-500" />
                        <h2 className="font-bold text-slate-800">Timeline</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Target End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link
                        href="/assignments"
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
                                Creating...
                            </>
                        ) : (
                            <>
                                <Briefcase className="mr-2 h-4 w-4" />
                                Create Assignment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewAssignmentPage;
