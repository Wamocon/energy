import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HandbookClient } from './HandbookClient';
import type { HandbookSection } from './HandbookClient';

const SECTIONS: HandbookSection[] = [
  {
    id: 'overview',
    icon: '📖',
    title: 'Übersicht — Was kann die App?',
    content: [
      'Die Energieberater-App ist eine digitale Lösung für Energieberater (KMU), um Gebäudebegehungen vor Ort zu erfassen, Fotos zu dokumentieren und Projekte zu verwalten.',
      'Alle Daten werden sicher in einer DSGVO-konformen Cloud-Umgebung (Supabase) gespeichert. Nur der zuständige Berater kann seine eigenen Projekte einsehen.',
    ],
  },
  {
    id: 'registration',
    icon: '🔐',
    title: '1. Registrierung & Login',
    content: [
      'Neues Konto über die Landingpage anlegen (E-Mail + Passwort). Nach der Registrierung wird ein Bestätigungslink per E-Mail zugesendet.',
      'Nach Bestätigung der E-Mail kann die Anmeldung über die Login-Seite erfolgen. Das Dashboard ist nur für angemeldete Berater zugänglich.',
    ],
    steps: [
      'Landingpage öffnen und auf „Jetzt kostenlos starten" klicken.',
      'E-Mail-Adresse und Passwort (mind. 8 Zeichen) eingeben.',
      'Bestätigungslink in der E-Mail anklicken.',
      'Mit denselben Zugangsdaten auf der Login-Seite anmelden.',
    ],
  },
  {
    id: 'projects',
    icon: '📁',
    title: '2. Projekt anlegen',
    content: [
      'Jede Gebäudebegehung wird als eigenes Projekt angelegt. Ein Projekt enthält Kundenname, Adresse, Gebäudetyp und Baujahr.',
      'Nur der anlegende Berater kann sein Projekt sehen (Row-Level Security). Der Projektstatus beginnt automatisch auf „Neu".',
    ],
    steps: [
      'Im Dashboard auf „+ Neues Projekt" klicken.',
      'Pflichtfelder ausfüllen: Kundenname, Straße, Stadt, Postleitzahl.',
      'Auf „Projekt erstellen" klicken — das Projekt erscheint sofort in der Liste.',
    ],
  },
  {
    id: 'dashboard',
    icon: '🗂️',
    title: '3. Berater-Dashboard',
    content: [
      'Das Dashboard zeigt alle eigenen Projekte in einer Übersichtstabelle: Name, Kundenname, Adresse, Typ und aktueller Status.',
      'Per Klick auf ein Projekt gelangt man in die Projektdetailansicht. Über den Header-Button kann der Status des Projekts geändert werden.',
    ],
  },
  {
    id: 'inspection',
    icon: '📋',
    title: '4. GEG-Begehungsformular',
    content: [
      'Das Begehungsformular ist in 6 Abschnitte gegliedert: Gebäudedaten, Gebäudehülle, Heizung & Warmwasser, Fenster & Verglasung, Lüftung sowie Notizen.',
      'Alle relevanten GEG-Pflichtfelder sind enthalten. Das Formular kann als Entwurf gespeichert und später weiterbearbeitet werden.',
      'Nach dem Speichern wird der Projektstatus automatisch auf „In Bearbeitung" gesetzt.',
    ],
    steps: [
      'Im Projekt auf „Begehung starten" (bzw. „Begehung bearbeiten") klicken.',
      'Alle Abschnitte von oben nach unten ausfüllen.',
      'Fotos direkt in jedem Abschnitt hochladen (Kamera oder Galerie).',
      'Auf „Begehung speichern" klicken — Daten werden in der Cloud gespeichert.',
    ],
  },
  {
    id: 'photos',
    icon: '📷',
    title: '5. Foto-Dokumentation',
    content: [
      'Fotos können direkt im Begehungsformular je Abschnitt hinzugefügt werden: Fassade, Dach und Keller im Abschnitt Gebäudehülle; Heizung im Heizungsabschnitt; Fenster im Fensterabschnitt; Lüftung im Lüftungsabschnitt.',
      'Alternativ steht auch eine dedizierte Foto-Seite pro Projekt zur Verfügung, auf der alle Fotos kategorisiert angezeigt und verwaltet werden können.',
      'Unterstützte Formate: JPG, PNG, HEIC, WebP — max. 10 MB pro Datei.',
      'Fotos sind sicher in Supabase Storage gespeichert und nur für den Projekteigentümer zugänglich (RLS).',
    ],
    steps: [
      'Im Begehungsformular zum gewünschten Abschnitt scrollen.',
      'Auf „+ Foto" klicken — Kamera oder Galerie öffnet sich auf dem Smartphone.',
      'Foto aufnehmen oder aus der Galerie wählen — Upload startet automatisch.',
      'Das Foto erscheint als Thumbnail. Durch Hovern erscheint ein Löschen-Button (×).',
    ],
  },
  {
    id: 'landing',
    icon: '🌐',
    title: '6. Landingpage (DE & EN)',
    content: [
      'Die App verfügt über eine zweisprachige Landingpage (Deutsch / Englisch) mit Hero-Bereich, drei Feature-Boxen und einem Footer mit Impressum und Datenschutz.',
      'Die Sprache kann über den Sprachumschalter in der Navigation gewechselt werden. Die Standard-URL leitet auf die deutsche Fassung weiter.',
    ],
  },
  {
    id: 'security',
    icon: '🔒',
    title: '7. Sicherheit & Datenschutz',
    content: [
      'Alle Authentifizierung läuft über Supabase Auth (Passwort-Hashing, sichere Sessions). Geschützte Seiten sind nur nach Login zugänglich, unautorisierte Zugriffe werden auf die Login-Seite umgeleitet.',
      'Row-Level Security (RLS) stellt sicher, dass jeder Berater ausschließlich seine eigenen Projekte und Fotos sehen und bearbeiten kann.',
      'Die App ist DSGVO-konform — alle Daten werden auf EU-Servern gespeichert.',
    ],
  },
  {
    id: 'support',
    icon: '🆘',
    title: '8. Häufige Fragen & Support',
    content: [
      'Problem: Login funktioniert nicht → Bitte Bestätigungs-E-Mail prüfen. Falls abgelaufen, erneut registrieren oder Support kontaktieren.',
      'Problem: Foto lässt sich nicht hochladen → Datei darf max. 10 MB groß sein. Nur JPG, PNG, HEIC und WebP werden unterstützt.',
      'Problem: Änderungen gehen verloren → Immer auf „Begehung speichern" klicken, bevor die Seite gewechselt wird.',
      'Weitere Unterstützung: Wenden Sie sich an Ihren Administrator oder IT-Ansprechpartner.',
    ],
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HandbookPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Produkthandbuch</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Anleitung und Hilfe für alle Funktionen der Energieberater-App.
        </p>
      </div>

      <HandbookClient sections={SECTIONS} />
    </div>
  );
}

