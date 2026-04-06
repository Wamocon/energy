'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { Plus, ArrowRight, Building2, Search } from 'lucide-react';
import type { Project, ProjectStatus } from '@/lib/db/types';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  new: 'Neu',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
};

const STATUS_COLOURS: Record<ProjectStatus, string> = {
  new: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
};

type FilterStatus = ProjectStatus | 'all';

type Props = {
  projects: Project[];
  newProjectLabel: string;
  noProjectsLabel: string;
  openLabel: string;
  locale: string;
};

export function ProjectList({ projects, newProjectLabel, noProjectsLabel, openLabel, locale }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const countByStatus = useMemo(() => {
    const counts: Record<FilterStatus, number> = { all: projects.length, new: 0, in_progress: 0, completed: 0 };
    for (const p of projects) counts[p.status as ProjectStatus]++;
    return counts;
  }, [projects]);

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: `Alle (${countByStatus.all})` },
    { value: 'new', label: `Neu (${countByStatus.new})` },
    { value: 'in_progress', label: `In Bearbeitung (${countByStatus.in_progress})` },
    { value: 'completed', label: `Abgeschlossen (${countByStatus.completed})` },
  ];

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-16 text-center">
        <Building2 size={40} className="mx-auto mb-4 text-zinc-300" />
        <p className="mb-1 font-medium text-zinc-900">Noch keine Projekte</p>
        <p className="mb-6 text-sm text-zinc-500">{noProjectsLabel}</p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Plus size={16} />
          {newProjectLabel}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Suchen nach Name, Ort, Adresse …"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center">
          <p className="text-sm text-zinc-500">Keine Projekte für diese Suche gefunden.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-zinc-200 bg-white sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Kunde</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Erstellt</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{project.customer_name}</td>
                    <td className="px-4 py-3 text-zinc-500">{project.address}, {project.city}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOURS[project.status as ProjectStatus]}`}>
                        {STATUS_LABELS[project.status as ProjectStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(project.created_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                      >
                        {openLabel} <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 hover:border-orange-200 hover:bg-orange-50 active:bg-orange-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-zinc-900">{project.customer_name}</p>
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{project.address}, {project.city}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOURS[project.status as ProjectStatus]}`}>
                      {STATUS_LABELS[project.status as ProjectStatus]}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(project.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} className="ml-3 shrink-0 text-zinc-400" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
