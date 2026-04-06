'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { LayoutDashboard, Plus, BookOpen } from 'lucide-react';

type Props = {
  locale: string;
};

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
  { label: 'Neues Projekt', href: '/dashboard/projects/new', icon: <Plus size={20} /> },
  { label: 'Handbuch', href: '/dashboard/handbook', icon: <BookOpen size={20} /> },
];

export function BottomNav({ locale }: Props) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    const localePath = `/${locale}${href}`;
    if (exact) return pathname === localePath;
    return pathname.startsWith(localePath);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white md:hidden"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                active ? 'text-orange-600' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span className={active ? 'text-orange-500' : 'text-zinc-400'}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
