'use client';

import { useState, useMemo } from 'react';

export type HandbookSection = {
  id: string;
  title: string;
  icon: string;
  content: string[];
  steps?: string[];
};

type Props = {
  sections: HandbookSection[];
  markdownContent: string;
};

export function HandbookClient({ sections, markdownContent }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.some((c) => c.toLowerCase().includes(q)) ||
        s.steps?.some((step) => step.toLowerCase().includes(q)),
    );
  }, [sections, query]);

  function handleDownload() {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Energieberater-Handbuch.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          <input
            type="search"
            placeholder="Handbuch durchsuchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          ⬇️ Als Markdown herunterladen
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Keine Einträge für „{query}&rdquo; gefunden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-1.5">
                {section.content.map((line, i) => (
                  <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                    {line}
                  </p>
                ))}
              </div>
              {section.steps && section.steps.length > 0 && (
                <ol className="mt-3 space-y-1.5 pl-5">
                  {section.steps.map((step, i) => (
                    <li key={i} className="list-decimal text-sm text-zinc-600 dark:text-zinc-400">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
