import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'VoxAI — Your AI Language Companion',
  description: 'Break Language Barriers with AI. Chat, speak, translate, and understand the world in your own language.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 flex antialiased">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
