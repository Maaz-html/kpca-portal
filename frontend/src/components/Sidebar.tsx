'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Briefcase,
    Receipt,
    Settings,
    LogOut,
    ChevronRight,
    Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
    const pathname = usePathname();
    const { role } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Clients', icon: Users, href: '/clients' },
        { name: 'Proposals', icon: FileText, href: '/proposals' },
        { name: 'Assignments', icon: Briefcase, href: '/assignments' },
        { name: 'Billing', icon: Receipt, href: '/billing' },
    ];

    if (role === 'PARTNER' || role === 'DIRECTOR') {
        menuItems.push({ name: 'Audit Logs', icon: Activity, href: '/audit-logs' });
        menuItems.push({ name: 'User Management', icon: Settings, href: '/users' });
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                <span className="text-xl font-bold text-white tracking-widest font-tight">KPCA <span className="text-blue-500">PORTAL</span></span>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-6">
                <nav className="flex-1 space-y-1 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-[1.02]'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                                {item.name}
                                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="flex-shrink-0 w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
