'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Lock,
    Mail,
    ChevronRight,
    Loader2,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-[440px] z-10 page-fade-in">
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 mb-6 group transition-transform hover:scale-110 duration-500">
                        <Zap className="h-8 w-8 text-white fill-white group-hover:animate-bounce" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight font-tight mb-2">
                        KPCA <span className="text-blue-500">PORTAL</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Enterprise Lifecycle Management</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="glass-card rounded-[32px] p-10 border border-white/10 relative overflow-hidden group">
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@kpca.com"
                                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 ml-1">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                <p className="text-rose-400 text-xs font-semibold">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Secure Access</span>
                                    <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Assurance */}
                <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500/60" />
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none">AES-256 Encrypted</span>
                    </div>
                    <div className="w-[1px] h-3 bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none">v1.2.0 Stable</span>
                    </div>
                </div>
            </div>

            {/* Subtle decorative grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
    );
};

export default LoginPage;
