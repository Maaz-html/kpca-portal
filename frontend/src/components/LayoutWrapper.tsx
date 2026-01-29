'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
                <div className="p-8 page-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
