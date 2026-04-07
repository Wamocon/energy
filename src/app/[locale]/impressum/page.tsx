import { Link } from '@/i18n/navigation';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-zinc-900">Saniatlas</Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">← Zurück</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Impressum</h1>

        <div className="space-y-6 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">WAMOCON GmbH</h2>
            <p>
              Mergenthalerallee 79–81<br />
              65760 Eschborn<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">Kontakt</h2>
            <p>
              Telefon: +49 6196 5838311<br />
              E-Mail: info@wamocon.com
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">Vertretungsberechtigter Geschäftsführer</h2>
            <p>Dipl.-Ing. Waleri Moretz</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">Registereintrag</h2>
            <p>
              Sitz der Gesellschaft: Eschborn<br />
              Handelsregister: Eschborn HRB 123666<br />
              Umsatzsteuer-Identifikationsnummer: DE344930486
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">Angaben zum Angebot</h2>
            <p>
              Saniatlas ist eine webbasierte Software-as-a-Service-Plattform für die digitale
              Gebäudeerfassung und Energieberatung. Das Angebot richtet sich primär an Unternehmen
              und gewerbliche Nutzer (Energieberater).
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="mx-auto max-w-3xl px-6 text-center text-xs text-zinc-400">
          <Link href="/datenschutz" className="hover:text-zinc-600">Datenschutzerklärung</Link>
          {' · '}
          <Link href="/impressum" className="hover:text-zinc-600">Impressum</Link>
        </div>
      </footer>
    </div>
  );
}
