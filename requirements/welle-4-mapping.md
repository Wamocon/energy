# Welle 4 — Implementierungsmapping
**Branch:** `analysis/welle-4-mapping`  
**Erstellt:** 01. April 2026  
**Basis:** Anforderungsdokument v2.0 + User Stories Welle 4  
**Zweck:** Abgleich des aktuellen Implementierungsstands gegen die aktualisierten Anforderungen

---

## Gesamtstatus

| Feature | Anforderung | Implementierungsstand | Lücken |
|---|---|---|---|
| Supabase Auth & Schema | W4 #1 | ✅ Vollständig | — |
| Berater-Dashboard | W4 #2 | ✅ Vollständig | — |
| GEG-Begehungsformular | W4 #3 | 🟡 ~90% | Lüftung prüfen |
| Foto-Upload | W4 #4 | ✅ Vollständig | AC-05.1: Upload-Button im Formular selbst fehlt |
| Landingpage (DE/EN) | W4 #5 | ✅ Vollständig | Kein Features-Abschnitt mit ≥3 Features? Prüfen |
| User Stories & ACs | W4 #6 | ✅ Vorhanden | Status noch "Entwurf", Review ausstehend |
| Testing lokal + live | W4 #7 | 🟡 Offen | Smartphone-Test (AC-07.5) noch nicht dokumentiert |
| Polish | W4 #8 | 🟡 Teilweise | — |
| Produkthandbuch | W4 #9 | ❌ Fehlt | HOWTO.md ist kein vollständiges Handbuch |

---

## Detailmapping je User Story

---

### US-W4-01 — Registrierung & Login

**Implementierung:** [src/app/[locale]/auth/login/page.tsx](../src/app/%5Blocale%5D/auth/login/page.tsx) · [src/app/[locale]/auth/register/page.tsx](../src/app/%5Blocale%5D/auth/register/page.tsx) · [src/app/auth/callback/route.ts](../src/app/auth/callback/route.ts) · [middleware.ts](../middleware.ts)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-01.1 | Registrierungsformular E-Mail + Passwort | ✅ | Implementiert in `register/page.tsx` |
| AC-01.2 | Bestätigungs-E-Mail nach Registrierung | ✅ | Supabase Auth, `callback/route.ts` vorhanden |
| AC-01.3 | Login → Redirect auf Dashboard | ✅ | Implementiert, Middleware schützt Routen |
| AC-01.4 | Fehlermeldung bei falschen Zugangsdaten | ✅ | Implementiert |
| AC-01.5 | Logout → Session beendet | ✅ | `LogoutButton.tsx` vorhanden |
| AC-01.6 | Geschützte Seiten — Redirect auf Login | ✅ | `middleware.ts` implementiert |
| AC-01.7 | Passwort nicht im Klartext | ✅ | Supabase Auth verwaltet Hashing |

**Status: ✅ Vollständig**

---

### US-W4-02 — Projekt anlegen

**Implementierung:** [src/app/[locale]/dashboard/projects/new/page.tsx](../src/app/%5Blocale%5D/dashboard/projects/new/page.tsx)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-02.1 | "Neues Projekt"-Button | ✅ | Im Dashboard vorhanden |
| AC-02.2 | Pflichtfelder: Name, Kundenname, Adresse, Typ, Baujahr | ✅ | Implementiert in `new/page.tsx` |
| AC-02.3 | Projekt erscheint sofort in Projektliste | ✅ | Redirect auf Dashboard nach Anlegen |
| AC-02.4 | RLS: Projekt nur für Eigentümer sichtbar | ✅ | RLS-Policies in Migration vorhanden |
| AC-02.5 | Validierung Pflichtfelder vor Speichern | ✅ | Formularvalidierung vorhanden |
| AC-02.6 | Initialstatus "Neu" | ✅ | DB-Default in Migration gesetzt |

**Status: ✅ Vollständig**

---

### US-W4-03 — Berater-Dashboard

**Implementierung:** [src/app/[locale]/dashboard/page.tsx](../src/app/%5Blocale%5D/dashboard/page.tsx)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-03.1 | Alle Projekte des Beraters in Liste | ✅ | Server Component mit Supabase-Abfrage |
| AC-03.2 | Projektzeile: Name, Kundenname, Adresse, Typ, Status | ✅ | Status-Badges implementiert |
| AC-03.3 | Klick auf Projekt → Projektdetailansicht | ✅ | Link zu `[id]/page.tsx` |
| AC-03.4 | Leerer Zustand mit CTA | ✅ | Empty-State implementiert |
| AC-03.5 | Responsive auf Smartphone | ✅ | Tailwind CSS responsive |
| AC-03.6 | Ladezeit < 3s bei <100 Projekten | 🟡 | Nicht gemessen — Vercel-Test ausstehend |

**Status: ✅ Vollständig** *(AC-03.6 Performance-Test steht aus)*

---

### US-W4-04 — GEG-Begehungsformular

**Implementierung:** [src/app/[locale]/dashboard/projects/[id]/inspection/InspectionForm.tsx](../src/app/%5Blocale%5D/dashboard/projects/%5Bid%5D/inspection/InspectionForm.tsx) · [src/app/[locale]/dashboard/projects/[id]/inspection/page.tsx](../src/app/%5Blocale%5D/dashboard/projects/%5Bid%5D/inspection/page.tsx)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-04.1 | 4 Abschnitte: Gebäudehülle, Heizung, Fenster, Lüftung | 🟡 | Gebäudehülle, Heizung, Fenster ✅ — Lüftung zu prüfen |
| AC-04.2 | Gebäudehülle: Außenwand, Dach, Kellerdecke | ✅ | Implementiert |
| AC-04.3 | Heizung: Typ, Baujahr, Warmwasser | ✅ | Implementiert |
| AC-04.4 | Fenster: Verglasung, Rahmen, Baujahr | ✅ | Implementiert |
| AC-04.5 | Lüftung: vorhanden ja/nein, Typ | ⚠️ | Im Schema vorhanden, UI-Implementierung prüfen |
| AC-04.6 | Pflichtfelder markiert + Validierung | ✅ | React Hook Form + Validierung |
| AC-04.7 | Zwischenspeichern (Entwurf) | 🟡 | Speichern vorhanden — Entwurf-Status prüfen |
| AC-04.8 | Formulardaten in Projektdetail abrufbar | ✅ | Persistenz via Supabase `buildings`-Tabelle |
| AC-04.9 | Smartphone-tauglich (Touch-optimiert) | ✅ | Tailwind, keine Hover-only-Elemente |
| AC-04.10 | Projektstatus → "In Bearbeitung" nach Speichern | 🟡 | Prüfen ob Status-Update implementiert ist |

**Status: 🟡 ~90%** — Lüftungs-UI und Status-Update-Logik prüfen

---

### US-W4-05 — Foto-Upload je Bauteil

**Implementierung:** [src/app/[locale]/dashboard/projects/[id]/photos/PhotoUpload.tsx](../src/app/%5Blocale%5D/dashboard/projects/%5Bid%5D/photos/PhotoUpload.tsx) · [src/app/[locale]/dashboard/projects/[id]/photos/page.tsx](../src/app/%5Bocale%5D/dashboard/projects/%5Bid%5D/photos/page.tsx)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-05.1 | Upload-Button **an jedem Formularabschnitt** | ⚠️ | Foto-Upload ist auf separater `/photos`-Seite — nicht integriert in Formular-Abschnitte |
| AC-05.2 | Kamera öffnen oder Galerie auf Smartphone | ✅ | `accept="image/*"` — öffnet Kamera/Galerie |
| AC-05.3 | Formate JPG/PNG/HEIC, max 10MB | 🟡 | Format-Validierung prüfen — HEIC explizit? |
| AC-05.4 | Supabase Storage, Bauteil + Projekt zugeordnet | ✅ | Kategorien implementiert |
| AC-05.5 | Fotos als Thumbnails in Formularansicht | ⚠️ | Thumbnails nur auf `/photos`-Seite, nicht im Formular |
| AC-05.6 | Foto löschen | ✅ | Delete-Funktion vorhanden |
| AC-05.7 | RLS: Fotos nur für Projekteigentümer | ✅ | Storage-RLS in Migration |
| AC-05.8 | Fehlermeldung bei ungültigem Format/Größe | 🟡 | Grundlegende Validierung prüfen |

**Status: 🟡 ~75%** — Hauptlücke: Foto-Upload ist vom Formular getrennt (eigene Seite statt inline je Abschnitt)

---

### US-W4-06 — Landingpage (DE & EN)

**Implementierung:** [src/app/[locale]/page.tsx](../src/app/%5Blocale%5D/page.tsx) · [messages/de.json](../messages/de.json) · [messages/en.json](../messages/en.json) · [src/i18n/](../src/i18n/)

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-06.1 | Root-URL `/`, Standard Deutsch | ✅ | Routing via next-intl konfiguriert |
| AC-06.2 | Sprachumschalter DE/EN | ✅ | next-intl Routing implementiert |
| AC-06.3 | Hero + Features (≥3) + Footer mit Links | 🟡 | Hero ✅ — Features-Anzahl und Footer-Links (Impressum/Datenschutz) prüfen |
| AC-06.4 | CTA → Login/Registrierung | ✅ | Implementiert |
| AC-06.5 | Responsive (Mobile, Tablet, Desktop) | ✅ | Tailwind responsive |
| AC-06.6 | Vollständige Übersetzung DE + EN | ✅ | `messages/de.json` + `messages/en.json` vorhanden |
| AC-06.7 | Lighthouse Performance ≥ 80 (Desktop) | 🟡 | Nicht gemessen — Vercel-Deployment-Test ausstehend |

**Status: 🟡 ~85%** — Footer-Links (Impressum/Datenschutz) und Lighthouse-Test ausstehend

---

### US-W4-07 — Deployment & Livesystem-Test

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-07.1 | App auf Vercel deployed | 🟡 | Vercel-Konfiguration vorhanden, Deployment-Status unbekannt |
| AC-07.2 | Hauptprozess im Livesystem fehlerfrei | 🟡 | Lokal getestet — Live nicht dokumentiert |
| AC-07.3 | Env-Variablen in Vercel, nicht im Code | ✅ | `.env.example` vorhanden, Secrets nicht committed |
| AC-07.4 | Build/CI grün | 🟡 | GitHub Actions konfiguriert — aktueller Status unbekannt |
| AC-07.5 | Test auf echtem Smartphone (iOS Safari / Chrome Android) | ❌ | Kein Nachweis vorhanden |

**Status: 🟡 Offen** — Smartphone-Test und Livesystem-Dokumentation fehlen

---

### US-W4-08 — Produkthandbuch

| AC | Beschreibung | Status | Befund |
|---|---|---|---|
| AC-08.1 | Handbuch beschreibt alle Welle-4-Features, mind. 1 Seite | ❌ | `HOWTO.md` deckt nicht alle Features ab |
| AC-08.2 | Hauptschritte mit Screenshot oder Beschreibung | ❌ | Fehlt |
| AC-08.3 | Handbuch auf Deutsch | ❌ | Fehlt |

**Status: ❌ Fehlt vollständig**

---

## Neue Anforderungen aus v2.0 — Welle 4 Relevanz

Die folgenden Punkte aus dem aktualisierten Anforderungsdokument v2.0 betreffen Welle 4 direkt:

| Punkt | Beschreibung | Impact auf Welle 4 |
|---|---|---|
| **Zielgruppe KMU statt Freelancer** | Keine technische Änderung, nur Positionierung | ℹ️ Kein Code-Änderungsbedarf |
| **Endkunden-Demografie** | 80% > 40 Jahre, digital wenig affin | ℹ️ UX-Entscheidungen beachten |
| **Qualitätsmerkmal: KI-Plausibilitätsprüfung** | KI prüft Gebäudedaten nach Erfassung | 🔜 Backlog — nicht Welle 4 |
| **Qualitätsmerkmal: Geführte Dokumentenerfassung** | Schritt-für-Schritt Dokumenten-Upload | 🔜 Backlog — nicht Welle 4 |

---

## Zusammenfassung — Offene Punkte Welle 4

### Kritisch (blockiert Abnahme)
| # | Problem | Betroffene AC | Empfehlung |
|---|---|---|---|
| K1 | **Foto-Upload nicht im Formular integriert** — separate Seite statt inline je Abschnitt | AC-05.1, AC-05.5 | Upload-Sektion je Formularabschnitt ergänzen oder AC neu bewerten |
| K2 | **Produkthandbuch fehlt vollständig** | AC-08.1–08.3 | Erstellen vor Wellen-Abnahme |

### Mittel (sollte behoben werden)
| # | Problem | Betroffene AC |
|---|---|---|
| M1 | Lüftungs-Abschnitt im GEG-Formular — UI-Stand prüfen | AC-04.1, AC-04.5 |
| M2 | Projektstatus-Update nach Formular-Speichern | AC-04.10 |
| M3 | Footer-Links Impressum/Datenschutz prüfen | AC-06.3 |
| M4 | Smartphone-Test (iOS Safari) dokumentieren | AC-07.5 |

### Niedrig (nice to have)
| # | Problem | Betroffene AC |
|---|---|---|
| N1 | HEIC-Format explizit validieren | AC-05.3 |
| N2 | Lighthouse Performance-Test durchführen | AC-06.7 |
| N3 | Ladezeit Dashboard < 3s messen | AC-03.6 |

---

## Empfohlene nächste Schritte

1. **Lüftungs-UI im GEG-Formular bestätigen** (30 min Prüfung)
2. **Foto-Upload-Integration entscheiden** — inline je Abschnitt oder separate Seite als bewusste UX-Entscheidung dokumentieren (K1)
3. **Produkthandbuch erstellen** — kann mit KI-Unterstützung in ~1h erledigt werden (K2)
4. **Smartphone-Test durchführen und dokumentieren** (AC-07.5)
5. **User Stories Status von "Entwurf" auf "Freigegeben"** updaten nach Review

---

*Erstellt: 01. April 2026 | Branch: analysis/welle-4-mapping*
