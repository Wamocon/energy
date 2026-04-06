import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/components/Toast';
import { Zap } from 'lucide-react';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-50">
        {/* Left Sidebar — desktop only */}
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar userEmail={user.email ?? null} locale={locale} />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile top bar */}
          <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 bg-white px-4 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-900">Energieberater</span>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 md:px-6 md:py-8 md:pb-8">
            {children}
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <BottomNav locale={locale} />
      </div>
    </ToastProvider>
  );
}
