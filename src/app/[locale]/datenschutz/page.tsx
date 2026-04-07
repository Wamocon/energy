import { Link } from '@/i18n/navigation';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-zinc-900">Saniatlas</Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">← Zurück</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Datenschutzerklärung</h1>

        <div className="space-y-6 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">1. Verantwortlicher</h2>
            <p>
              WAMOCON GmbH<br />
              Mergenthalerallee 79–81<br />
              65760 Eschborn<br />
              Telefon: +49 6196 5838311<br />
              E-Mail: info@wamocon.com<br />
              Geschäftsführer: Dipl.-Ing. Waleri Moretz<br />
              Handelsregister: Eschborn HRB 123666 · USt-ID: DE344930486
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">2. Überblick über die Datenverarbeitung</h2>
            <p>
              Diese Datenschutzerklärung gilt für die Webanwendung &bdquo;Saniatlas&ldquo; (saniatlas.de).
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
              Bereitstellung einer funktionsfähigen Plattform sowie unserer Inhalte und Leistungen erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">3. Rechtsgrundlagen der Verarbeitung</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Einwilligung</strong> – Art. 6 Abs. 1 lit. a DSGVO</li>
              <li><strong>Vertragserfüllung</strong> – Art. 6 Abs. 1 lit. b DSGVO</li>
              <li><strong>Rechtliche Verpflichtung</strong> – Art. 6 Abs. 1 lit. c DSGVO</li>
              <li><strong>Berechtigtes Interesse</strong> – Art. 6 Abs. 1 lit. f DSGVO</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">4. Hosting und Infrastruktur</h2>
            <p>
              <strong>Vercel Inc.</strong> – Die Webanwendung wird über Vercel gehostet. Vercel verarbeitet
              technisch notwendige Verbindungsdaten (IP-Adresse, Zeitstempel, Browserinformationen).
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <p className="mt-3">
              <strong>Supabase Inc.</strong> – Für Datenbank, Authentifizierung und Dateispeicher nutzen
              wir Supabase. Verarbeitet werden Authentifizierungsdaten, Session-Informationen, Projektdaten
              sowie gespeicherte Medien. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">5. Erhobene Daten</h2>
            <p>Bei der Nutzung der Plattform werden folgende Datenkategorien verarbeitet:</p>
            <ul className="ml-4 mt-2 list-disc space-y-1">
              <li>Kontodaten: E-Mail-Adresse, verschlüsseltes Passwort</li>
              <li>Profildaten: Name, Firma, Telefon, Zertifikatnummer</li>
              <li>Projektdaten: Kundendaten, Gebäudedaten, Fotos</li>
              <li>Technische Daten: IP-Adresse, Browser, Session-Token</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-zinc-900">6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung
              der Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf Datenportabilität.
              Kontaktieren Sie uns unter info@wamocon.com.
            </p>
          </section>

          <p className="text-xs text-zinc-400">Stand: April 2026</p>
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
