'use client';

import { useState, useTransition } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { updateProjectStatus } from './actions';
import { useToast } from '@/components/Toast';
import type { ProjectStatus } from '@/lib/db/types';

const STATUS_OPTIONS: { value: ProjectStatus; label: string; colour: string }[] = [
  { value: 'new', label: 'Neu', colour: 'bg-blue-50 text-blue-700' },
  { value: 'in_progress', label: 'In Bearbeitung', colour: 'bg-amber-50 text-amber-700' },
  { value: 'completed', label: 'Abgeschlossen', colour: 'bg-green-50 text-green-700' },
];

type Props = {
  projectId: string;
  currentStatus: ProjectStatus;
};

export function StatusDropdown({ projectId, currentStatus }: Props) {
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const current = STATUS_OPTIONS.find((o) => o.value === status)!;

  function handleSelect(newStatus: ProjectStatus) {
    if (newStatus === status) { setOpen(false); return; }
    setOpen(false);

    if (newStatus === 'completed') {
      if (!window.confirm('Projekt wirklich auf „Abgeschlossen" setzen?')) return;
    }

    startTransition(async () => {
      setStatus(newStatus);
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.error) {
        setStatus(status); // revert
        showToast(result.error, 'error');
      } else {
        showToast('Status gespeichert.');
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-opacity ${current.colour} ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
      >
        {current.label}
        <ChevronDown size={13} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${opt.colour}`}>{opt.label}</span>
                {opt.value === status && <Check size={14} className="text-orange-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
