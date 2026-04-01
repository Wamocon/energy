# Anforderungsdokument — App "Energieberater"

**Erstellt:** März 2026 | **Aktualisiert:** 01. April 2026  
**Autor:** Erwin Moretz | **Version:** 2.0  
**Wellen:** Welle 4 & Welle 5 | **Gesamt-Entwicklungszeit:** 32h (2 × 16h)

> **Änderungshistorie v2.0:** Zielgruppe geschärft (Berater-Feedback + Waleri-Review), Welle 5 neu priorisiert (kein Kundenportal-Login), Marktgröße und Wettbewerbsanalyse ergänzt, Qualitätsmerkmal "KI-geprüfte Erfassung" + "Geführte Dokumentenerfassung" aufgenommen.

---

## 1. Projektübersicht

**Wie heißt das Projekt / die App?**
Energieberater *(Arbeitstitel)*

**Beschreiben Sie Ihr Projekt in 2–3 Sätzen.**
Die App unterstützt kleine und mittelständische Energieberatungsbüros sowie qualifizierte Fachbetriebe bei der digitalen Abbildung ihres gesamten Beratungsprozesses — von der mobilen Vor-Ort-Gebäudeerfassung über die Förderprüfung bis zur Kundenkommunikation. Sie schließt die Lücke zwischen reiner Berechnungssoftware (Hottgenroth, IBO, ETU) und einem vollständigen Prozessmanagement-Werkzeug. Langfristiges Ziel ist die erste End-to-End-Plattform im deutschen Energieberatungsmarkt.

**Wer ist die Zielgruppe?**
Kleine und mittelständische Energieberatungsbüros (GbR, GmbH) sowie qualifizierte Fachbetriebe (Architekten, Ingenieurbüros, Handwerksbetriebe mit Energieberatungszulassung), primär in Deutschland. Marktgröße: **22.800+ registrierte Energie-Effizienz-Experten** (dena EEE-Liste, Stand März 2026) — ein klar definierter, regulierter B2B-Markt mit nachgewiesenem Wachstum durch GEG und BEG-Förderung.

**Endkunden-Demografie (Zielgruppe der Berater):**
Die Endkunden der Energieberater sind zu ~80% Hausbesitzer über 40 Jahre (Gebäude aus den 70er–90er Jahren, jetzt in der Sanierungsphase für die Rente). Diese Gruppe ist digital wenig affin, bevorzugt persönlichen Kontakt (Telefon, vor Ort) und lehnt Self-Service-Portale sowie KI-Assistenten ab. Investitionsvolumen: 50.000–100.000 € je Sanierungsmaßnahme. Nur ~20% der Endkunden sind unter 40 und digital affin.

> **Konsequenz für die App:** Digitale Features müssen primär den **Berater** entlasten — kein Zwang zu digitalem Self-Service für Endkunden.

**Welches Problem löst diese App?**
Bestehende Softwarelösungen decken nur Teilbereiche ab — und das aus einem strukturellen Grund: Berechnungssoftware (Hottgenroth, IBO, ETU — Marktführer seit den 1990ern) ist auf normkonforme Physik-Engines optimiert, desktop-basiert, hochkomplex und nicht für den mobilen Außendienst geeignet. Prozessmanagement (CRM, mobiles Erfassungsformular, Kundenkommunikation, Förder-Navigator) wurde nie Teil dieser Tools, weil es eine völlig andere Produktkategorie ist. Diese Lücke — zwischen Berechnung und Prozess — ist die Marktchance: Es existiert keine End-to-End-Plattform, die mobile Vor-Ort-Erfassung, Förderprüfung und Projektkommunikation in einer modernen Webanwendung verbindet.

**Qualitätsmerkmal & Differenzierung:**
Die App differenziert sich durch zwei Alleinstellungsmerkmale, die kein bestehender Wettbewerber bietet:

1. **KI-geprüfte Gebäudeerfassung** — Nach der Vor-Ort-Erfassung prüft eine KI die eingetragenen Gebäudedaten automatisch auf Vollständigkeit, Plausibilität und GEG-Konformität. Widersprüche (z.B. Baujahr 1975 + Wärmepumpe als Bestandsheizung) und fehlende Pflichtfelder werden vor Abschluss markiert. Ergebnis: Fehler werden vor der Berechnung gefunden — nicht danach.

2. **Geführte Dokumentenerfassung** — Kunden wissen oft nicht, welche Unterlagen für BAFA/KfW benötigt werden, und sind mit dem Einreichen überfordert (Scannen, Dateiformat, Benennung). Die App löst das: Der Berater legt pro Projekt eine förderungsspezifische Dokumenten-Checkliste an. Der Kunde erhält einen einfachen Link mit Schritt-für-Schritt-Anleitung und Fortschrittsanzeige (*"3 von 5 Unterlagen eingereicht"*). Eine KI prüft, ob das hochgeladene Dokument dem erwarteten Typ entspricht. Der Berater sieht auf einen Blick, was noch fehlt — kein WhatsApp-Chaos mehr.

**Haben Sie eine bestehende App oder Website?**
Nein. Neuentwicklung auf Basis von Next.js 16 (bestehendes Repository vorhanden).

---

## 2. Funktionale Anforderungen

**Welche Hauptfunktionen brauchen Sie?**
Authentifizierung, Berater-Dashboard, GEG-Begehungsformular, Foto-Upload, Förder-Navigator, Fristenkalender, Projektstatus-Kommunikation per E-Mail, Digitales Kundenformular, Landingpage.

**Beschreiben Sie die wichtigste Funktion im Detail.**
Die **Vor-Ort-Erfassung** (GEG-Begehungsformular) ist der Kern von Welle 4: Ein strukturiertes Formular erfasst alle relevanten Gebäudedaten nach GEG-Standard (Gebäudehülle, Heizung, Fenster, Lüftung) — mobil im Browser bedienbar, inklusive Foto-Upload je Bauteil. Der **Förder-Navigator** (Welle 5) prüft regelbasiert die Förderfähigkeit für BAFA BEG EM, BAFA BEG WG, KfW BEG WG Kredit und iSFP-Bonus.

**Soll die App offline funktionieren?**
Nein. Die App ist rein browserbasiert (Desktop & Smartphone) — kein Offline-Betrieb, kein PWA-Anforderung.

---

## 3. Design & UX

**Gibt es Websites oder Apps, deren Design Ihnen gefällt?**
Noch nicht festgelegt.

**Bevorzugter Design-Stil.**
Modern / Minimal.

**Soll es einen Dunkelmodus unterstützen?**
Optional (nicht in Welle 4 oder 5 eingeplant).

---

## 4. Technische Anforderungen

**Auf welchen Plattformen soll die App laufen?**
Web — Desktop-Browser und Smartphone-Browser (kein nativer App-Store).

**Erwartete Benutzeranzahl.**
Weniger als 100 (Berater + zugehörige Kunden).

**Datenschutzanforderungen?**
DSGVO-konform. Daten werden in der EU gespeichert (Supabase EU-Region).

**Tech-Stack.**

| Ebene | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage, RLS) |
| E-Mail | Resend |
| Deployment | Vercel (via GitHub Actions) |
| Versionierung | GitHub — Repository: Wamocon/energy |

---

## 5. Zeitplan & Budget

**Wann brauchen Sie die App fertig?**
Welle 4: KW14 (06.–12. April 2026) | Welle 5: KW15 (13.–19. April 2026)

**Haben Sie ein Budget eingeplant?**
Unter 5.000 €.

**Was ist Ihnen wichtiger?**
Kosteneffizienz.

---

## 6. Zusätzliche Informationen

**Bevorzugter Kommunikationskanal?**
E-Mail.

**Entwicklungsanteil durch KI-Agenten?**
Ja — die Implementierung erfolgt hauptsächlich durch KI-Agenten (GitHub Copilot). Der Product Owner (Erwin Moretz) reviewed und passt an. User Stories und Akzeptanzkriterien werden ebenfalls KI-generiert und anschließend menschlich freigegeben. Sie gelten als verbindliche Abnahmekriterien.

---

## 7. Welle 4 — "Berater Core"

**Zeitraum:** KW14 — 06.–12. April 2026 | **Entwicklungszeit:** 16h  
**Fokus:** Fundament, Vor-Ort-Erfassung, Landingpage

**Hauptprozess (präsentierbar am Wellen-Ende):**
Berater meldet sich an → legt Projekt an → füllt GEG-Begehungsformular aus → lädt Fotos hoch → sieht Projektübersicht im Dashboard ✅

| # | Feature | Beschreibung | h |
|---|---|---|---|
| 1 | **Supabase Setup** | Auth (E-Mail/Passwort) + DB-Schema: Projekte, Gebäude, Begehungen | 2 |
| 2 | **Berater-Dashboard** | Projektliste, Projektstatus-Übersicht, neues Projekt anlegen | 2 |
| 3 | **GEG-Begehungsformular** | Strukturiertes Formular: Gebäudehülle, Heizung, Fenster, Lüftung | 5 |
| 4 | **Foto-Upload** | Upload je Bauteil (Supabase Storage), mobile-tauglich im Browser | 1,5 |
| 5 | **Landingpage** | Zweisprachige Landingpage (DE/EN): Hero, Features, CTA, Footer | 2 |
| 6 | **User Stories & Akzeptanzkriterien** | KI-generierte User Stories + ACs, menschliches Review, als Abnahmekriterium festhalten | 0,5 |
| 7 | **Testing lokal + live** | Lokaler E2E-Durchlauf, Deployment auf Vercel, Test im Livesystem | 1,5 |
| 8 | **Hauptprozess-Polish** | Bug-Fixing nach Tests, Präsentationsqualität sicherstellen | 1 |
| 9 | **Domain + Produkthandbuch** | Domain sichern/registrieren, Produkthandbuch Welle 4 anlegen | 0,5 |
| | | **Gesamt** | **16** |

---

## 8. Welle 5 — "Navigator & Kommunikation"

**Zeitraum:** KW15 — 13.–19. April 2026 | **Entwicklungszeit:** 16h  
**Fokus:** Förder-Navigator, Digitales Kundenformular, Projektkommunikation, Landingpage-Erweiterung

**Hauptprozess (präsentierbar am Wellen-Ende):**
Berater schickt Kunden Formular-Link → Kunde füllt Stammdaten/Gebäudedaten aus → Daten fließen ins Projekt → Förder-Navigator zeigt passende Programme → Berater sendet Status-E-Mail an Kunden ✅

> **Scope-Entscheidung:** Kundenportal mit Login entfernt — 80% der Endkunden sind über 40 und digital wenig affin. Ersetzt durch digitales Kundenformular (kein Login nötig) und E-Mail-Benachrichtigung. Geführte Dokumentenerfassung und KI-Prüfung sind im Backlog als nächste Ausbaustufe geplant.

| # | Feature | Beschreibung | h |
|---|---|---|---|
| 1 | **Digitales Kundenformular** | Webbasiertes Stammdaten- und Gebäudedaten-Formular — Berater schickt Kunden einen Link, Kunde füllt aus, Daten fließen direkt ins Projekt (kein Kunden-Login erforderlich) | 3 |
| 2 | **Förder-Navigator** | Regelbasierte Prüfung: BAFA BEG EM, BAFA BEG WG, KfW BEG WG Kredit, iSFP-Bonus | 4 |
| 3 | **Fristenkalender** | Deadlines je Projekt, Dashboard-Alerts für Berater | 2,5 |
| 4 | **Projektstatus-Updates** | Berater → Kunde: E-Mail-Benachrichtigung (via Resend) — kein Kunden-Login, kein Portal | 2 |
| 5 | **PDF-Download-Bereich (Website)** | Downloadbereich auf Landingpage: standardisierte Formulare (Energieausweis-Datenblatt, Kundenformular als PDF) zum Download | 1 |
| 6 | **User Stories & Akzeptanzkriterien** | KI-generierte User Stories + ACs für Welle-5-Features, Review und Abnahme | 0,25 |
| 7 | **Testing lokal + live** | E2E-Durchlauf (Berater → Kundenformular → Förder-Navigator → Status-E-Mail), Test im Livesystem | 1,5 |
| 8 | **Landingpage-Erweiterung** | Integration neuer Welle-5-Features + PDF-Downloads in die bestehende Landingpage | 1 |
| 9 | **Produkthandbuch-Erweiterung** | Welle-5-Features im Produkthandbuch ergänzen | 0,25 |
| | | **Gesamt** | **~15,5** |

---

## 9. Förder-Navigator — Regelwerk Welle 5

| Programm | Typ | Basis-Bedingung |
|---|---|---|
| **BAFA BEG EM** | Zuschuss Einzelmaßnahme | Maßnahme an Gebäudehülle, Heizung oder Lüftung |
| **BAFA BEG WG** | Zuschuss Wohngebäude | Sanierung zum Effizienzhaus (EH 40–85) |
| **KfW BEG WG Kredit** | Kredit Wohngebäude | Sanierung zum Effizienzhaus + Bestätigung Energie-Effizienz-Experte |
| **iSFP-Bonus** | Bonus-Zuschuss | Individueller Sanierungsfahrplan vorhanden (+5 % auf BEG EM) |

---

## 10. Abnahmeprozess — User Stories

Für jede Welle werden User Stories mit Akzeptanzkriterien als verbindliches Abnahmekriterium erstellt.

1. **KI-Generierung** — User Stories im Format `Als [Rolle] möchte ich [Funktion], damit [Nutzen]` mit messbaren Akzeptanzkriterien werden KI-generiert.
2. **Menschliches Review** — Product Owner (Erwin Moretz) prüft und korrigiert jede User Story.
3. **Freigabe** — Freigegebene User Stories gelten als Abnahmekriterium für die Welle.
4. **Abnahme** — Nach dem Livesystem-Test wird jede User Story gegen die ACs geprüft. Erst bei vollständiger Abnahme gilt die Welle als abgeschlossen.

> Separate Dateien: `requirements/user-stories-welle-4.md` und `requirements/user-stories-welle-5.md`

---

## 11. Risiken & Herausforderungen

| # | Risiko | Wahrscheinlichkeit | Auswirkung | Gegenmaßnahme |
|---|---|---|---|---|
| R1 | **GEG-Formular-Komplexität** — Mehr Felder/Validierungen als geschätzt | Mittel | Hoch | Scope auf Pflichtfelder begrenzen, optionale Felder in spätere Welle verschieben |
| R2 | **Supabase RLS** — Row-Level-Security für Berater + Kunden ist fehleranfällig | Mittel | Hoch | RLS-Policies früh testen, Berater- und Kunden-Rollen klar trennen |
| R3 | **Foto-Upload iOS Safari** — File-Input auf iPhone/Safari verhält sich abweichend | Mittel | Mittel | Frühzeitig auf echtem iPhone testen (nicht nur Browser-DevTools) |
| R4 | **Förder-Regelwerk-Aktualität** — BAFA/KfW-Konditionen können sich kurzfristig ändern | Niedrig | Mittel | Regelwerk als konfigurierbare Datei anlegen, nicht hardcoded |
| R5 | **KI-generierter Code Review-Overhead** — Agentencode braucht mehr Korrekturen als erwartet | Mittel | Mittel | Pro Feature direkt nach Generierung reviewen, nicht am Ende der Woche |
| R6 | **Scope Creep** — Nachträgliche Feature-Wünsche sprengen 16h-Budget | Mittel | Hoch | Strict: Jede Änderung > 30 min Aufwand kommt in den Backlog der nächsten Welle |
| R7 | **E-Mail-Zustellung (Resend)** — DNS-Konfiguration/Verifizierung dauert länger als erwartet | Niedrig | Niedrig | Resend-Account vor KW15 anlegen und Domain verifizieren |
| R8 | **Vercel-Deployment-Fehler** — Build schlägt im CI/CD fehl durch fehlende Env-Variablen | Niedrig | Mittel | `.env.example` aktuell halten, Vercel-Environment direkt beim Setup konfigurieren |
| R9 | **Kundenformular-Akzeptanz** — Endkunden (>40 Jahre) füllen das Online-Formular nicht aus und schicken stattdessen unstrukturierte E-Mails/Bilder | Hoch | Mittel | Formular so einfach wie möglich halten (max. 10 Felder), Fallback: PDF-Download zum Ausdrucken und per Post/Scan einreichen |

---

## 12. Zeitplan

| Welle | Zeitraum | Entwicklungszeit | Hauptprozess-Ziel |
|---|---|---|---|
| **Welle 4** | KW14 — 06.–12. April 2026 | 16h | Berater anmelden → Projekt anlegen → GEG-Formular → Fotos hochladen → Dashboard ✅ |
| **Welle 5** | KW15 — 13.–19. April 2026 | 16h | Kundenformular → Daten ins Projekt → Förder-Navigator → Status-E-Mail an Kunden ✅ |

**Hinweis zur Arbeitsplanung:** Die Entwicklungszeit ist innerhalb der jeweiligen Kalenderwoche flexibel einzuplanen. Hauptarbeitszeit ist primär abends (ab 17 Uhr) sowie bei Bedarf am Wochenende. Eine tagesgenaue Planung entfällt bewusst — Fortschritte werden feature-basiert getrackt.

---

## 13. Bewusst ausgeklammert — Backlog

| Feature | Beschreibung | Schätzung |
|---|---|---|
| **KI-Plausibilitätsprüfung Gebäudeerfassung** | KI prüft nach Vor-Ort-Erfassung automatisch auf Vollständigkeit, Plausibilität und GEG-Konformität — markiert Widersprüche und fehlende Pflichtfelder vor Formularabschluss | ~4h |
| **Geführte Dokumentenerfassung** | Berater legt förderungsspezifische Dokumenten-Checkliste an → Kunde erhält Link mit Schritt-für-Schritt-Anleitung → KI prüft ob hochgeladenes Dokument dem erwarteten Typ entspricht → Fortschrittsanzeige für Berater und Kunden | ~6h |
| **Digitales Energieausweis-Datenblatt** | Online-Formular für Verbrauchs-/Bedarfsausweis-Datenerfassung durch Kunden (basierend auf bestehendem Adobe-Pro-PDF von Praczka & Pinneger) | ~2h |
| **Baubegleitung-Checklisten** | Digitale Abhaklisten je Projektphase (Baubegleitung) — Berater hakt Schritte ab, Fortschritt sichtbar im Dashboard | ~3h |
| **Kundenportal mit Login** | Separater Kunden-Login, Projektstatus-Ansicht (read-only) — verschoben wegen Zielgruppen-Einschränkung (80% der Kunden > 40 Jahre, digital wenig affin) | ~5,5h |
| **BAFA-Live-API** | Echtzeit-Abfrage der aktuellen Förderbedingungen direkt bei BAFA/KfW statt regelbasierter Logik | ~5h |
| **iSFP-Generierung per KI** | Automatische Erstellung des individuellen Sanierungsfahrplans (iSFP) als PDF auf Basis der erfassten Gebäudedaten | ~8h |
| **E-Rechnung (XRechnung)** | Digitale Rechnungserstellung im XRechnung-Format für öffentliche Auftraggeber | ~3h |
| **Lead-Widget** | Einbettbares Kontaktformular für die Berater-Website — generiert direkt Leads in der App | ~4h |
| **Geo-Routing** | Entfernungsberechnung und Routenplanung zu Kundenobjekten (Google Maps / OpenStreetMap) | ~3h |
| **Mandantenfähigkeit** | Mehrere Berater in einem geteilten Büro-Account — gemeinsame Projektbasis, rollenbasierte Zugriffsrechte | ~10h |
