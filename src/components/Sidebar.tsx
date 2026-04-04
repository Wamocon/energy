'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  BookOpen,
  LogOut,
  Zap,
  UserCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    label: 'Projekte',
    href: '/dashboard',
    icon: <FolderOpen size={18} />,
    exact: true,
  },
  {
    label: 'Neues Projekt',
    href: '/dashboard/projects/new',
    icon: <Plus size={18} />,
  },
  {
    label: 'Handbuch',
    href: '/dashboard/handbook',
    icon: <BookOpen size={18} />,
  },
];

type Props = {
  userEmail: string | null;
  locale: string;
};

export function Sidebar({ userEmail, locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact?: boolean) {
    const localePath = `/${locale}${href}`;
    if (exact) return pathname === localePath;
    return pathname.startsWith(localePath);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-zinc-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-zinc-900">Energieberater</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span className={active ? 'text-orange-500' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-200 p-3">
        <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
          <UserCircle size={18} className="shrink-0 text-zinc-400" />
          <span className="truncate text-xs text-zinc-500">{userEmail ?? '—'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <LogOut size={18} className="text-zinc-400" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
