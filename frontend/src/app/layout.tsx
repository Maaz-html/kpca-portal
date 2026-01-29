import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KPCA Portal | Enterprise SaaS",
  description: "Unified portal for KPCA Client Lifecycle Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
              <div className="p-8 page-fade-in">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
