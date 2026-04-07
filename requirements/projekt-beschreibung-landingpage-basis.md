# Energieberater App — Projektbeschreibung
**Erstellt:** 07. April 2026  
**Zweck:** Basis für Landingpage, Investoren-Pitch, Onboarding neuer Entwickler  
**Status:** Welle 4 abgeschlossen · Welle 5 in Planung

---

## Kurzbeschreibung (Hero-Text-Basis)

> **Energieberatung. Digital. Effizient.**
>
> Die Energieberater-App ist das digitale Werkzeug für freiberufliche Energieberater und KMU — von der ersten Projekt-Anlage bis zur vollständigen Gebäudebegehung. Vor Ort. Am Smartphone. DSGVO-konform.

---

## Das Problem, das wir lösen

Energieberater verbringen heute **3–6 Stunden pro Projekt** mit manueller Nacharbeit:

- Gebäudedaten auf Papier oder PDF-Formular erfassen
- Fotos auf dem Handy, nicht dem Projekt zugeordnet
- Förderprogramme (BAFA/KfW) manuell recherchieren
- Ergebnisse nochmals in Word/Excel abtippen für den Bericht
- Kundenkommunikation per E-Mail, Unterlagen über Dropbox verteilt

Der Berater ist kein Schreibtischarbeiter —  
**er steht im Keller, in der Heizungsanlage, auf dem Dachboden.**  
Seine App muss seinen Werkzeug-Koffer ersetzen, nicht einen Büroplatz.

---

## Zielgruppe

| Segment | Beschreibung |
|---|---|
| **Primär** | Freiberufliche Energieberater (EEE-zertifiziert, BAFA-Liste) |
| **Sekundär** | Kleine Energieberatungsbüros (2–10 Personen) |
| **Marktgröße** | ~14.000 zugelassene Energieeffizienz-Experten (BAFA-Liste, Stand 2025) |
| **Endkunden** | Immobilieneigentümer, ~80% älter als 40 Jahre, kaufen oder sanieren Wohngebäude |

**Wichtig aus dem Berater-Feedback (April 2026):**  
Die Endkunden sind größtenteils analog. Das Portal richtet sich an den **Berater**, nicht an den Endkunden. Kein Self-Service, kein KI-Chatbot nach außen — der persönliche Kontakt ist der Kernwert des Beraters.

---

## Technologie-Stack

| Ebene | Technologie |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Backend / Datenbank | Supabase (PostgreSQL, Row-Level Security, Supabase Auth, Supabase Storage) |
| Deployment | Vercel (CI/CD via GitHub Actions) |
| PWA | manifest.json, installierbar auf iOS Safari + Chrome Android |
| Internationalisierung | next-intl (Deutsch + Englisch) |

**Sicherheit:**
- Supabase Auth (Passwort-Hashing, sichere Sessions, E-Mail-Bestätigung)
- Row-Level Security: jeder Berater sieht nur seine eigenen Projekte und Fotos
- DSGVO-konform, EU-Server

---

## Aktueller Entwicklungsstand — Welle 4 (abgeschlossen April 2026)

### Was heute funktioniert

#### Authentifizierung & Konto
- Registrierung mit E-Mail + Passwort, E-Mail-Bestätigung via Supabase
- Login, Logout, Passwort-Reset per E-Mail
- Berater-Profil: Name, Firma, Telefon, EEE-Zertifikat-Nummer (BAFA-Listennummer)

#### Projektverwaltung
- Projekt anlegen mit Gebäudetyp (visueller Selektor), Kundendaten, Adresse
- Telefonnummer des Kunden + geplantes Begehungsdatum speicherbar
- Projektstatus-Workflow: **Neu → In Bearbeitung → Abgeschlossen**
  - Auto-Übergang zu "In Bearbeitung" beim ersten Formular-Speichern
  - Manuell über klickbaren Status-Badge änderbar (mit Bestätigungsdialog)
- Suchfeld + Status-Filter-Chips im Dashboard (Alle / Neu / In Bearbeitung / Abgeschlossen)

#### GEG-Begehungsformular
- 6-abschnittiges Formular (Akkordeon-Struktur): Gebäudedaten, Gebäudehülle, Heizung & Warmwasser, Fenster & Verglasung, Lüftung, Notizen
- Alle relevanten Felder nach GEG-Anforderungen
- Inline-Foto-Upload je Formularabschnitt (Kamera oder Galerie direkt am Abschnitt)
- Sticky Speichern-Button (Smartphone: fixiert am unteren Bildschirmrand)

#### Foto-Dokumentation
- Fotos je Bauteil-Kategorie: Fassade, Dach, Keller, Heizung, Fenster, Sonstiges
- Thumbnail-Vorschau, Löschen (touch-optimiert, kein Hover nötig)
- Supabase Storage, RLS-geschützt

#### UX / Design
- Light Mode only, orange Akzentfarbe (#f97316)
- Responsive für Desktop (Sidebar-Navigation) und Smartphone (untere Navigationsleiste)
- Breadcrumbs, Toast-Benachrichtigungen, Skeleton-Loading-States
- PWA: installierbar auf Homescreen (iOS und Android)

#### Landingpage & Rechtliches
- Zweisprachige Landingpage (DE/EN): Hero, Features, Footer
- Impressum (WAMOCON GmbH)
- Datenschutzerklärung (DSGVO-konform)

#### Produkthandbuch
- 11 Abschnitte: alle Features beschrieben mit Schritt-für-Schritt-Anleitungen
- Volltextsuche im Handbuch
- PDF-Export via Browser-Druck

---

## Architektur — Datenbankschema (vereinfacht)

```
profiles         — Berater-Profil (Name, Firma, Telefon, EEE-Zertifikat)
  └── projects   — Projektverwaltung (Kundendaten, Adresse, Status, Termine)
        ├── buildings        — GEG-Gebäudedaten (alle Begehungsfelder)
        └── project_photos   — Fotos (Supabase Storage, kategoriebezogen)
```

**Row-Level Security** auf allen Tabellen: `berater_id = auth.uid()`

---

## Nächste Entwicklungswellen (Roadmap)

### Welle 5 — Kernprodukt vervollständigen (Q2 2026)

> Ziel: Aus dem Erfassungstool ein vollständiges Beratungstool machen.

| Feature | Beschreibung | Priorität |
|---|---|---|
| **Maßnahmenliste** | Sanierungsfahrplan je Projekt: Maßnahmen mit Typ, Beschreibung, Priorität, Kostenschätzung, Fördersatz | Hoch |
| **Förder-Schnellcheck** | Regelbasierte Auswertung: Baujahr + Heizungstyp + Dämmstand → BAFA BEG EM/WG, KfW 261, iSFP-Bonus | Hoch |
| **Dokumenten-Upload** | Ablage von Kundendokumenten pro Projekt (Grundrisse, alter Energieausweis, Heizungsrechnung) | Mittel |
| **PDF-Report** | Beratungsbericht als PDF: Berater-Logo, Kundendaten, Gebäudedaten, Fotos, Maßnahmen | Hoch |
| **GEG-Pflichtfeld-Validierung** | Vollständigkeitsanzeige pro Abschnitt (Ampel), Warnung bei unvollständigen Pflichtfeldern nach GEG §79 | Mittel |

---

### Welle 6 — Professionalität & Integration (Q3 2026)

> Ziel: Wettbewerbsfähigkeit gegenüber etablierten Fachsoftware-Tools.

| Feature | Beschreibung | Priorität |
|---|---|---|
| **Fristen-Reminder** | BAFA/KfW-Antragsfrist je Projekt, Ampel-Anzeige im Dashboard | Hoch |
| **Offline / Auto-Save** | Lokaler Zwischenspeicher (localStorage) bei Netzausfall während Begehung | Hoch |
| **Begehungsdatum (Nacherfassung)** | Nachbegehungs-Funktion: zweite Erfassung mit Vergleich vor/nach Sanierung | Mittel |
| **Mehrsprachige Ausgabe** | Status- und Enum-Werte in DE/EN in PDF-Export korrekt übersetzt | Niedrig |

---

### Welle 7 — Skalierung (Q4 2026 / Q1 2027)

> Ziel: Mehrbenutzer-Betrieb, Team-Features, externe Schnittstellen.

| Feature | Beschreibung |
|---|---|
| **Team-Accounts** | Mehrere Berater unter einer Organisation, Projekte übertragbar |
| **Kundenportal (Berater-seitig)** | Schreibgeschützter Link für Berater-Präsentation beim Kundengespräch (keine Endkunden-Selbstbedienung) |
| **BAFA-Datenexport** | Strukturierter Export für iBAND-Einreichungstool (XML/JSON) |
| **API-Integration** | Schnittstelle zu Fachsoftware (ETU, IDA ICE, Hottgenroth) |

---

## Wettbewerb & Positionierung

| Wettbewerber | Stärken | Unsere Differenzierung |
|---|---|---|
| Nvision/Vincent-Portal | Vollständig, etabliert | Zu wartungsintensiv, fehleranfällig, hohe Einstiegskosten |
| Papier/PDF auf Tablet | Vertraut, offline | Kein Cloud-Sync, keine Foto-Zuordnung, manuelle Nacharbeit |
| Excel-Eigenbauten | Flexibel | Kein Mobile, kein Foto-Upload, kein Workflow |
| **Energieberater-App** | Mobile-first, einfach, günstig | Fokus auf Vor-Ort-Effizienz, kein Schnickschnack, GEG-konform out-of-the-box |

**Unser Alleinstellungsmerkmal:**  
Die einzige App, die den Energieberater bei der Vor-Ort-Begehung vollständig begleitet — vom ersten Klick bis zum exportierbaren Bericht — ohne Fachsoftware-Komplexität und ohne das Portalprojekt-Risiko einer Nvision-Eigenentwicklung.

---

## Angaben für die Landingpage

### Hero-Varianten

**Variante A — Problem-fokussiert:**
> "Schluss mit PDF auf dem Tablet. Gebäudedaten erfassen, Fotos zuordnen, Fördercheck — alles in einer App."

**Variante B — Nutzen-fokussiert:**
> "2 Stunden weniger Nacharbeit pro Projekt. Die Energieberater-App digitalisiert Ihre Vor-Ort-Begehung."

**Variante C — Positionierung:**
> "Energieberatung. Digital. Effizient. Das GEG-Begehungsformular für Ihren Arbeitsalltag — mobil, DSGVO-konform, sofort einsatzbereit."

### 3 Feature-Boxen (aktueller Stand)

1. **Vor-Ort-Erfassung**  
   GEG-konformes Akkordeon-Formular für alle 6 Abschnitte — Gebäudehülle, Heizung, Fenster, Lüftung. Direkt am Gebäude ausfüllbar, Fotos je Bauteil, autom. Cloud-Speicherung.

2. **Projektverwaltung**  
   Dashboard mit allen Projekten, Status-Workflow (Neu → In Bearbeitung → Abgeschlossen), Suche und Filter. Auf dem Smartphone wie eine native App nutzbar (PWA).

3. **DSGVO & Sicherheit**  
   Jeder Berater sieht nur seine eigenen Daten (Row-Level Security). EU-Server, Passwort-geschützt, Impressum und Datenschutzerklärung inklusive.

### Features Welle 5 (für "Coming soon"-Sektion)

- **Förder-Navigator** — Regelbasierte BAFA/KfW-Prüfung auf Basis Ihrer Gebäudedaten
- **Maßnahmenplan** — Sanierungsfahrplan mit Kostenschätzung und Förderhöhen
- **PDF-Bericht** — Professioneller Beratungsbericht mit einem Klick exportieren

### Zahlen & Fakten (Stand April 2026)

- ~14.000 zugelassene Energieeffizienz-Experten in Deutschland (BAFA-Liste)
- Ø 3–6 Stunden manuelle Nacharbeit pro Projekt (Berater-Feedback)
- GEG §79: Mindestanforderungen an die Datenaufnahme für iSFP
- BAFA BEG EM: bis zu 70% Förderung für Einzelmaßnahmen
- KfW 261 BEG WG: bis zu 45% für Effizienzhaus-Sanierungen

---

## Kontakt & Betreiber

**WAMOCON GmbH**  
Mergenthalerallee 79–81 · 65760 Eschborn  
Telefon: +49 6196 5838311 · E-Mail: info@wamocon.com  
Geschäftsführer: Dipl.-Ing. Waleri Moretz  
HRB Eschborn 123666 · USt-ID: DE344930486
