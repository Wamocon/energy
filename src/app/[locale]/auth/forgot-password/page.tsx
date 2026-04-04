'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setErrorMsg('Fehler beim Senden. Bitte prüfen Sie die E-Mail-Adresse.');
      setState('error');
      return;
    }

    setState('sent');
  }

  if (state === 'sent') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">E-Mail gesendet</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Falls ein Konto mit <strong>{email}</strong> existiert, erhalten Sie in Kürze einen Link zum Zurücksetzen des Passworts.
          </p>
          <Link href="/auth/login" className="text-sm font-medium text-orange-500 hover:text-orange-600">
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Passwort zurücksetzen</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">E-Mail-Adresse</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {state === 'loading' ? 'Wird gesendet…' : 'Link senden'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/auth/login" className="font-medium text-orange-500 hover:text-orange-600">
            Zurück zur Anmeldung
          </Link>
        </p>
      </div>
    </div>
  );
}
