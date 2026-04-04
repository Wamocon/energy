import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center text-zinc-400 transition-colors hover:text-zinc-600"
        aria-label="Dashboard"
      >
        <Home size={14} />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-zinc-300" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-zinc-400 transition-colors hover:text-zinc-600"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-zinc-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
