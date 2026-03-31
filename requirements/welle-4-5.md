# Anforderungsdokument — App "Energieberater"

**Erstellt:** März 2026 | **Autor:** Erwin Moretz | **Version:** 1.0  
**Wellen:** Welle 4 & Welle 5 | **Gesamt-Entwicklungszeit:** 32h (2 × 16h)

---

## 1. Projektübersicht

**Wie heißt das Projekt / die App?**
Energieberater *(Arbeitstitel)*

**Beschreiben Sie Ihr Projekt in 2–3 Sätzen.**
Die App unterstützt freiberufliche Energieberater bei der digitalen Abbildung ihres gesamten Beratungsprozesses — von der Vor-Ort-Gebäudeerfassung über die Förderprüfung bis zur Kommunikation mit dem Kunden. Kunden erhalten einen eigenen Portalzugang, um Projektstatus und Dokumente einzusehen. Langfristiges Ziel ist eine End-to-End-Plattform, die Digitalisierungslücken im deutschen Energieberatungsmarkt schließt.

**Wer ist die Zielgruppe?**
Freiberufliche Energieberater und kleine Energieberatungsbüros (B2B), primär in Deutschland.

**Welches Problem löst diese App?**
Bestehende Softwarelösungen decken nur Teilbereiche ab (Berechnungssoftware, iSFP-Erstellung). Es existiert keine End-to-End-Plattform, die den gesamten Prozess — Vor-Ort-Erfassung, Förder-Navigator, Kundenportal und Projektkommunikation — digital in einer Anwendung abbildet.

**Haben Sie eine bestehende App oder Website?**
Nein. Neuentwicklung auf Basis von Next.js 16 (bestehendes Repository vorhanden).

---

## 2. Funktionale Anforderungen

**Welche Hauptfunktionen brauchen Sie?**
Authentifizierung, Berater-Dashboard, GEG-Begehungsformular, Foto-Upload, Förder-Navigator, Kundenportal, Fristenkalender, Projektstatus-Kommunikation, Landingpage.

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

## 8. Welle 5 — "Navigator & Kundenportal"

**Zeitraum:** KW15 — 13.–19. April 2026 | **Entwicklungszeit:** 16h  
**Fokus:** Förder-Navigator, Kundenportal, Projektkommunikation, Landingpage-Erweiterung

**Hauptprozess (präsentierbar am Wellen-Ende):**
Berater erfasst Gebäudedaten → Förder-Navigator zeigt passende Programme → Berater sendet Ergebnis an Kunden → Kunde loggt sich ins Portal ein und sieht Projektstatus ✅

| # | Feature | Beschreibung | h |
|---|---|---|---|
| 1 | **Kundenportal** | Separater Kunden-Login, Projektstatus-Ansicht (read-only) | 4 |
| 2 | **Kunden-Dokumenten-Upload** | Upload von Energierechnungen und Bauplänen durch den Kunden | 1,5 |
| 3 | **Förder-Navigator** | Regelbasierte Prüfung: BAFA BEG EM, BAFA BEG WG, KfW BEG WG Kredit, iSFP-Bonus | 4 |
| 4 | **Fristenkalender** | Deadlines je Projekt, Dashboard-Alerts für Berater | 2,5 |
| 5 | **Projektstatus-Updates** | Berater → Kunde: In-App-Notification + E-Mail (via Resend) | 2,5 |
| 6 | **User Stories & Akzeptanzkriterien** | KI-generierte User Stories + ACs für Welle-5-Features, Review und Abnahme | 0,25 |
| 7 | **Testing lokal + live** | E2E-Durchlauf (Berater → Förder-Navigator → Kundenportal), Test im Livesystem | 0,75 |
| 8 | **Landingpage-Erweiterung** | Integration neuer Welle-5-Features in die bestehende Landingpage | 0,25 |
| 9 | **Produkthandbuch-Erweiterung** | Welle-5-Features im Produkthandbuch ergänzen | 0,25 |
| | | **Gesamt** | **16** |

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

---

## 12. Zeitplan

| Welle | Zeitraum | Entwicklungszeit | Hauptprozess-Ziel |
|---|---|---|---|
| **Welle 4** | KW14 — 06.–12. April 2026 | 16h | Berater anmelden → Projekt anlegen → GEG-Formular → Fotos hochladen → Dashboard ✅ |
| **Welle 5** | KW15 — 13.–19. April 2026 | 16h | Gebäudedaten → Förder-Navigator → Ergebnis an Kunden → Kundenportal Projektstatus ✅ |

**Hinweis zur Arbeitsplanung:** Die Entwicklungszeit ist innerhalb der jeweiligen Kalenderwoche flexibel einzuplanen. Hauptarbeitszeit ist primär abends (ab 17 Uhr) sowie bei Bedarf am Wochenende. Eine tagesgenaue Planung entfällt bewusst — Fortschritte werden feature-basiert getrackt.

---

## 13. Bewusst ausgeklammert — Backlog für zukünftige Wellen

| Feature | Beschreibung | Schätzung | Empfohlene Welle |
|---|---|---|---|
| **BAFA-Live-API** | Echtzeit-Abfrage der aktuellen Förderbedingungen direkt bei BAFA/KfW statt regelbasierter Logik | ~5h | Welle 6 |
| **iSFP-Generierung per KI** | Automatische Erstellung des individuellen Sanierungsfahrplans (iSFP) als PDF auf Basis der erfassten Gebäudedaten, KI-gestützt | ~8h | Welle 6 |
| **E-Rechnung (XRechnung)** | Digitale Rechnungserstellung im XRechnung-Format für öffentliche Auftraggeber | ~3h | Welle 6 |
| **Lead-Widget** | Einbettbares Kontaktformular für die Berater-Website — generiert direkt Leads in der App | ~4h | Welle 7 |
| **Geo-Routing** | Entfernungsberechnung und Routenplanung zu Kundenobjekten (Google Maps / OpenStreetMap) | ~3h | Welle 7 |
| **Mandantenfähigkeit** | Mehrere Berater in einem geteilten Büro-Account — gemeinsame Projektbasis, rollenbasierte Zugriffsrechte | ~10h | Welle 7–8 |

---

### Vorschlag: Wellen-Kombinationen

| Welle | Thema | Enthaltene Features | Geschätzte Gesamtzeit |
|---|---|---|---|
| **Welle 6** | "Automatisierung & Dokumente" | BAFA-Live-API + iSFP-Generierung per KI + E-Rechnung | ~16h |
| **Welle 7** | "Wachstum & Akquise" | Lead-Widget + Geo-Routing + Mandantenfähigkeit Teil 1 (Einladungssystem) | ~14–16h |
| **Welle 8** | "Skalierung" | Mandantenfähigkeit Teil 2 (Rollen, Abrechnungen) + App-Store-Veröffentlichung als PWA + Performance-Optimierung | ~14–16h |

> **Empfehlung:** Welle 6 hat den höchsten Mehrwert für den Berater-Alltag (automatischer iSFP spart ~2h manuelle Arbeit pro Beratung) und ist ein starkes Differenzierungsmerkmal gegenüber dem Wettbewerb laut Marktanalyse.

---

## 14. KI-Funktionalitäten — Parallelentwicklung

> Diese Funktionen sind **nicht Teil von Welle 4 oder 5** und werden nicht im 16h-Budget berücksichtigt. Sie eignen sich für ein paralleles Entwicklerteam und können in späteren Wellen integriert werden.

### 14.1 KI für den Berater (parallel zu Welle 4)

| Funktion | Nutzen für den Berater | Schätzung | Integrierbar ab |
|---|---|---|---|
| **Smarte Formularvorschläge** | KI schlägt Feldwerte im GEG-Formular vor (basierend auf Gebäudetyp + Baujahr) — reduziert Eingabefehler und Erfassungszeit | ~1h | Welle 5 |
| **GEG-Assistent (Chatbot im Formular)** | Kontextueller Chat-Assistent erklärt Fachbegriffe direkt im Formular ("Was ist das Hüllflächenverhältnis?") — weniger Nachschlagen, schnellere Begehung | ~1,5h | Welle 5 |
| **Foto-Analyse via Vision-API** | Automatische Erkennung von Baumängeln aus Vor-Ort-Fotos (z.B. OpenAI Vision) — Berater erhält direkt Hinweise auf relevante Schwachstellen | ~2h | Welle 6 |
| **OCR für Dokumente** | Energierechnungen und Baupläne automatisch auslesen und Felder vorausfüllen — eliminiert manuelle Dateneingabe | ~3h | Welle 6 |

**Empfehlung:** *Formularvorschläge* + *GEG-Assistent* (~2,5h gesamt) haben den höchsten ROI pro Aufwandsstunde und lassen sich nahtlos in das bereits geplante GEG-Formular integrieren.

---

### 14.2 KI für den Kunden (parallel zu Welle 5)

| Funktion | Nutzen für den Kunden | Schätzung | Integrierbar ab |
|---|---|---|---|
| **Förder-Erklärung in Einfachsprache** | KI übersetzt den technischen Förder-Navigator-Output in verständliches Deutsch für Laien — höhere Kundenzufriedenheit und weniger Rückfragen an den Berater | ~1h | Welle 5 |
| **Automatische Projektzusammenfassung** | KI generiert einen lesbaren Statusbericht für den Kunden aus den Berater-Eingaben — spart dem Berater manuelle Berichtsarbeit | ~1,5h | Welle 5 |
| **Kunden-Chatbot** | Beantwortet Standardfragen zum Projektstatus auf Basis der Projektdaten ("Wann erhalte ich meinen Bericht?") — entlastet den Berater von Routinekommunikation | ~2h | Welle 6 |
| **Renovierungs-Roadmap** | KI erstellt eine priorisierte Maßnahmenliste basierend auf Gebäudedaten und Kundenbudget — zentraler USP der App gegenüber dem Wettbewerb | ~2h | Welle 6 |

**Empfehlung:** *Förder-Erklärung in Einfachsprache* + *Automatische Projektzusammenfassung* (~2,5h gesamt) nutzen die in Welle 5 bereits vorhandenen Daten optimal und sind direkt integrierbar.

---

### 14.3 Technische Basis für alle KI-Funktionen

| Aspekt | Entscheidung |
|---|---|
| **KI-Provider** | OpenAI API (GPT-4o / GPT-4o-mini je nach Kostenanforderung) |
| **Integration** | Server-Side API-Route in Next.js (kein API-Key im Frontend) |
| **Datenschutz** | Keine personenbezogenen Daten an OpenAI — nur strukturierte Gebäudedaten und anonymisierte Projektinfos |
| **Kosten** | GPT-4o-mini: ~0,15 USD / 1M Input-Token — bei < 100 Nutzern vernachlässigbar |
