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
      'Die App ist vollständig responsiv und als Progressive Web App (PWA) auf dem Smartphone installierbar — inklusive Offline-fähigem Icon auf dem Homescreen.',
    ],
  },
  {
    id: 'registration',
    icon: '🔐',
    title: '1. Registrierung & Login',
    content: [
      'Neues Konto über die Landingpage anlegen (E-Mail + Passwort). Nach der Registrierung wird ein Bestätigungslink per E-Mail zugesendet.',
      'Nach Bestätigung der E-Mail kann die Anmeldung über die Login-Seite erfolgen. Das Dashboard ist nur für angemeldete Berater zugänglich.',
      'Bei vergessenem Passwort steht auf der Login-Seite der Link „Passwort vergessen" zur Verfügung — ein Reset-Link wird per E-Mail zugesendet.',
    ],
    steps: [
      'Landingpage öffnen und auf „Jetzt kostenlos starten" klicken.',
      'E-Mail-Adresse und Passwort (mind. 6 Zeichen) eingeben.',
      'Bestätigungslink in der E-Mail anklicken.',
      'Mit denselben Zugangsdaten auf der Login-Seite anmelden.',
    ],
  },
  {
    id: 'profile',
    icon: '👤',
    title: '2. Berater-Profil einrichten',
    content: [
      'Im Berater-Profil können Name, Firma, Telefonnummer und EEE-Zertifikat-Nummer (BAFA-Listennummer) hinterlegt werden.',
      'Diese Angaben sind die Grundlage für spätere Beratungsberichte und offizielle Dokumente. Es empfiehlt sich, das Profil direkt nach der ersten Anmeldung auszufüllen.',
      'Das Profil ist über die Seitenleiste (Desktop) oder die untere Navigation (Smartphone) unter „Profil" erreichbar.',
    ],
    steps: [
      'In der Seitenleiste auf „Profil" klicken.',
      'Vollständigen Namen und Firma eingeben.',
      'Telefonnummer und BAFA-Listennummer (EEE-Zertifikat) eintragen.',
      'Auf „Profil speichern" klicken — Bestätigung erscheint als Toast oben rechts.',
    ],
  },
  {
    id: 'projects',
    icon: '📁',
    title: '3. Projekt anlegen',
    content: [
      'Jede Gebäudebegehung wird als eigenes Projekt angelegt. Ein Projekt enthält Kundenname, E-Mail, Telefonnummer, Adresse, Gebäudetyp und optionalen Begehungstermin.',
      'Nur der anlegende Berater kann sein Projekt sehen (Row-Level Security). Der Projektstatus beginnt automatisch auf „Neu".',
    ],
    steps: [
      'Im Dashboard auf „+ Neues Projekt" klicken.',
      'Gebäudetyp auswählen (Einfamilienhaus, Zweifamilienhaus, Mehrfamilienhaus, Nicht-Wohngebäude).',
      'Pflichtfelder ausfüllen: Kundenname, Straße, Stadt, Postleitzahl.',
      'Optional: Telefonnummer des Kunden und geplantes Begehungsdatum angeben.',
      'Auf „Projekt erstellen" klicken — das Projekt erscheint sofort in der Liste.',
    ],
  },
  {
    id: 'dashboard',
    icon: '🗂️',
    title: '4. Berater-Dashboard',
    content: [
      'Das Dashboard zeigt alle eigenen Projekte in einer Übersichtstabelle (Desktop) bzw. als Kacheln (Smartphone): Name, Kundenname, Adresse und aktueller Status.',
      'Die Projektliste kann per Suchfeld nach Kundenname oder Adresse durchsucht werden. Die Status-Filter-Chips (Alle / Neu / In Bearbeitung / Abgeschlossen) blenden gezielt nur bestimmte Projekte ein.',
      'Per Klick auf ein Projekt gelangt man in die Projektdetailansicht.',
    ],
    steps: [
      'Dashboard öffnen — alle Projekte werden automatisch geladen.',
      'Suchfeld oben nutzen, um nach Name oder Adresse zu filtern.',
      'Filter-Chip „Neu" oder „In Bearbeitung" anklicken, um den Status zu filtern.',
      'Auf ein Projekt klicken, um in die Detailansicht zu wechseln.',
    ],
  },
  {
    id: 'status',
    icon: '🔄',
    title: '5. Projektstatus verwalten',
    content: [
      'Jedes Projekt durchläuft drei Status-Stufen: Neu → In Bearbeitung → Abgeschlossen.',
      'Der Status „In Bearbeitung" wird automatisch gesetzt, sobald das Begehungsformular zum ersten Mal gespeichert wird.',
      'Der Status kann in der Projektdetailansicht manuell über den orangenen Status-Badge geändert werden. Beim Setzen auf „Abgeschlossen" erscheint eine Bestätigungsabfrage.',
      'Der aktuelle Status ist immer gut sichtbar im Projektdetail und in der Projektliste angezeigt.',
    ],
    steps: [
      'Projekt öffnen — Status wird oben rechts als farbiger Badge angezeigt.',
      'Auf den Badge klicken — ein Dropdown mit allen Status-Optionen öffnet sich.',
      'Neuen Status auswählen.',
      'Bei „Abgeschlossen": Bestätigungsdialog bestätigen.',
    ],
  },
  {
    id: 'inspection',
    icon: '📋',
    title: '6. GEG-Begehungsformular',
    content: [
      'Das Begehungsformular ist in 6 Abschnitte gegliedert: Gebäudedaten, Gebäudehülle, Heizung & Warmwasser, Fenster & Verglasung, Lüftung sowie Notizen.',
      'Die Abschnitte sind als aufklappbare Akkordeons aufgebaut — immer nur ein Abschnitt ist geöffnet. Das reduziert das Scrollen auf dem Smartphone erheblich.',
      'Nach dem ersten Speichern des Formulars wird der Projektstatus automatisch auf „In Bearbeitung" gesetzt.',
      'Das Formular kann jederzeit zwischengespeichert werden. Bei erneutem Öffnen sind alle bisherigen Eingaben vorhanden.',
    ],
    steps: [
      'Im Projekt auf „Begehung starten" (bzw. „Begehung bearbeiten") klicken.',
      'Abschnitt aufklappen und ausfüllen — dann nächsten Abschnitt öffnen.',
      'Fotos direkt in jedem Abschnitt hochladen (Kamera oder Galerie).',
      'Auf „Begehung speichern" klicken (Desktop: oben rechts, Smartphone: fixierter Button am unteren Rand).',
    ],
  },
  {
    id: 'photos',
    icon: '📷',
    title: '7. Foto-Dokumentation',
    content: [
      'Fotos können direkt im Begehungsformular je Abschnitt hochgeladen werden: Fassade, Dach und Keller im Abschnitt Gebäudehülle; Heizung im Heizungsabschnitt usw.',
      'Alternativ gibt es eine dedizierte Foto-Seite pro Projekt, auf der alle Fotos nach Kategorie verwaltet werden.',
      'Zum Löschen eines Fotos auf den roten „×"-Button im Thumbnail klicken (immer sichtbar — kein Hovern nötig, für Touch-Bedienung optimiert).',
      'Unterstützte Formate: JPG, PNG, HEIC, WebP — max. 10 MB pro Datei.',
    ],
    steps: [
      'Im Begehungsformular zum gewünschten Abschnitt scrollen.',
      'Auf „+ Foto" klicken — Kamera oder Galerie öffnet sich auf dem Smartphone.',
      'Foto aufnehmen oder aus der Galerie wählen — Upload startet automatisch.',
      'Das Foto erscheint als Thumbnail. Zum Löschen den „×"-Button anklicken.',
    ],
  },
  {
    id: 'mobile',
    icon: '📱',
    title: '8. Mobile Nutzung & Installation',
    content: [
      'Die App ist vollständig für Smartphone-Nutzung optimiert. Auf dem Smartphone wird eine untere Navigationsleiste mit den wichtigsten Bereichen (Dashboard, Neues Projekt, Handbuch, Profil) angezeigt.',
      'Die App kann auf dem Homescreen des Smartphones installiert werden (Progressive Web App / PWA): In Safari auf „Teilen → Zum Home-Bildschirm" tippen, in Chrome auf „App installieren".',
      'Nach der Installation startet die App im Vollbild ohne Browser-Adressleiste und kann wie eine native App genutzt werden.',
      'Hinweis: Für die Datenspeicherung ist eine Internetverbindung erforderlich.',
    ],
    steps: [
      'Safari (iOS): Auf „Teilen" (□↑) tippen → „Zum Home-Bildschirm" wählen → „Hinzufügen".',
      'Chrome (Android): Menü (⋮) öffnen → „App installieren" wählen → Bestätigen.',
      'Das Energieberater-Icon erscheint auf dem Homescreen.',
      'App vom Homescreen starten — sie öffnet direkt das Dashboard.',
    ],
  },
  {
    id: 'landing',
    icon: '🌐',
    title: '9. Landingpage (DE & EN)',
    content: [
      'Die App verfügt über eine zweisprachige Landingpage (Deutsch / Englisch) mit Hero-Bereich, drei Feature-Boxen, Impressum und Datenschutzerklärung.',
      'Die Sprache kann über den Sprachumschalter in der Navigation gewechselt werden. Die Standard-URL leitet auf die deutsche Fassung weiter.',
    ],
  },
  {
    id: 'security',
    icon: '🔒',
    title: '10. Sicherheit & Datenschutz',
    content: [
      'Alle Authentifizierung läuft über Supabase Auth (Passwort-Hashing, sichere Sessions). Geschützte Seiten sind nur nach Login zugänglich, unautorisierte Zugriffe werden auf die Login-Seite umgeleitet.',
      'Row-Level Security (RLS) stellt sicher, dass jeder Berater ausschließlich seine eigenen Projekte und Fotos sehen und bearbeiten kann — auch auf Datenbankebene.',
      'Die App ist DSGVO-konform. Alle Daten werden auf EU-Servern gespeichert (Supabase EU-Region). Details in der Datenschutzerklärung.',
    ],
  },
  {
    id: 'support',
    icon: '🆘',
    title: '11. Häufige Fragen & Troubleshooting',
    content: [
      'Problem: Login funktioniert nicht → Bestätigungs-E-Mail prüfen. Falls kein Zugang: „Passwort vergessen" auf der Login-Seite nutzen.',
      'Problem: Foto lässt sich nicht hochladen → Datei darf max. 10 MB groß sein. Nur JPG, PNG, HEIC und WebP werden unterstützt.',
      'Problem: Änderungen gehen verloren → Immer auf „Begehung speichern" klicken, bevor die Seite gewechselt wird. Die App speichert nicht automatisch.',
      'Problem: Projektstatus springt nicht auf „In Bearbeitung" → Das Begehungsformular muss mindestens einmal vollständig gespeichert werden.',
      'Problem: Status lässt sich nicht ändern → Sicherstellen, dass man der Besitzer des Projekts ist. Fremde Projekte sind nicht sichtbar und nicht editierbar.',
      'Weitere Unterstützung: info@wamocon.com',
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

