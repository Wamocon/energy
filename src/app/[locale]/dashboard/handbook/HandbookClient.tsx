'use client';

import { useState, useMemo } from 'react';
import { Search, FileDown } from 'lucide-react';

export type HandbookSection = {
  id: string;
  title: string;
  icon: string;
  content: string[];
  steps?: string[];
};

type Props = {
  sections: HandbookSection[];
};

export function HandbookClient({ sections }: Props) {
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

  function handlePdfDownload() {
    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Produkthandbuch – Saniatlas</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #18181b; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitle { font-size: 0.875rem; color: #71717a; margin-bottom: 2rem; }
    .section { border: 1px solid #e4e4e7; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; break-inside: avoid; }
    h2 { font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; }
    p { font-size: 0.875rem; color: #52525b; margin: 0.2rem 0; line-height: 1.5; }
    ol { margin: 0.5rem 0 0 1.25rem; padding: 0; }
    li { font-size: 0.875rem; color: #52525b; margin: 0.25rem 0; line-height: 1.5; }
    @media print { body { padding: 0.5rem; } }
  </style>
</head>
<body>
  <h1>Produkthandbuch – Saniatlas</h1>
  <p class="subtitle">Anleitung und Hilfe für alle Funktionen der Saniatlas-App.</p>
  ${sections
    .map(
      (s) => `<div class="section">
    <h2>${s.icon} ${s.title}</h2>
    ${s.content.map((c) => `<p>${c}</p>`).join('\n    ')}
    ${s.steps ? `<ol>${s.steps.map((st) => `<li>${st}</li>`).join('')}</ol>` : ''}
  </div>`,
    )
    .join('\n  ')}
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 300);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Handbuch durchsuchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={handlePdfDownload}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          <FileDown size={15} />
          Als PDF herunterladen
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Keine Einträge für &bdquo;{query}&rdquo; gefunden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-900">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-1.5">
                {section.content.map((line, i) => (
                  <p key={i} className="text-sm text-zinc-600">
                    {line}
                  </p>
                ))}
              </div>
              {section.steps && section.steps.length > 0 && (
                <ol className="mt-3 space-y-1.5 pl-5">
                  {section.steps.map((step, i) => (
                    <li key={i} className="list-decimal text-sm text-zinc-600">
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
