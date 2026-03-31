# User Stories — Welle 5 "Navigator & Kundenportal"

**App:** Energieberater (Arbeitstitel)  
**Zeitraum:** KW15 — 13.–19. April 2026  
**Entwicklungszeit:** 16h  
**Status:** 🟡 Entwurf — ausstehend Review durch Product Owner (Erwin Moretz)

---

## Hauptprozess-Ziel

> Berater erfasst Gebäudedaten → Förder-Navigator zeigt passende Programme → Berater sendet Ergebnis an Kunden → Kunde loggt sich ins Portal ein und sieht Projektstatus ✅

---

## Rollen

| Kürzel | Rolle | Beschreibung |
|---|---|---|
| Berater | Energieberater | Freiberuflicher Energieberater, nutzt die App täglich |
| Kunde | Endkunde / Hausbesitzer | Auftraggeber des Beraters, nutzt das Kundenportal |
| Besucher | Website-Besucher | Potenzieller Neukunde, sieht die Landingpage |

---

## US-W5-01 — Kunden-Login & Portal-Zugang

### User Story
> Als **Kunde** möchte ich mich mit einem eigenen Login (E-Mail + Passwort) in das Kundenportal einloggen,  
> damit ich sicher auf die Informationen zu meinem Projekt zugreifen kann.

### Akzeptanzkriterien

- [ ] **AC-01.1** — Der Berater kann für einen Kunden ein Konto anlegen (Einladung per E-Mail via Supabase Auth).
- [ ] **AC-01.2** — Der Kunde erhält eine Einladungs-E-Mail mit einem sicheren Link zur Passwort-Vergabe.
- [ ] **AC-01.3** — Nach der Passwort-Vergabe kann sich der Kunde mit E-Mail + Passwort einloggen.
- [ ] **AC-01.4** — Nach dem Login wird der Kunde direkt auf sein Projektportal weitergeleitet — nicht auf das Berater-Dashboard.
- [ ] **AC-01.5** — Kunden können ausschließlich ihre eigenen Projekte sehen (RLS-Policy: Kunde sieht nur Projekte mit seiner `kunden_id`).
- [ ] **AC-01.6** — Berater-Seiten (Dashboard, GEG-Formular) sind für Kunden nicht erreichbar — Redirect auf das Kundenportal.
- [ ] **AC-01.7** — Bei falschen Zugangsdaten erscheint eine verständliche Fehlermeldung.

---

## US-W5-02 — Projektstatus im Kundenportal

### User Story
> Als **Kunde** möchte ich im Portal den aktuellen Status meines Projekts und alle relevanten Informationen sehen,  
> damit ich jederzeit informiert bin, ohne den Berater direkt anrufen zu müssen.

### Akzeptanzkriterien

- [ ] **AC-02.1** — Der Kunde sieht eine Projektübersichtsseite mit: Projektname, Adresse des Gebäudes, aktueller Status (z.B. "Erfassung abgeschlossen", "Förderprüfung läuft", "Bericht erstellt").
- [ ] **AC-02.2** — Alle Statusänderungen, die der Berater gesetzt hat, werden chronologisch als Timeline angezeigt.
- [ ] **AC-02.3** — Das Kundenportal ist read-only — der Kunde kann keine Projektdaten bearbeiten.
- [ ] **AC-02.4** — Die Ansicht ist auf dem Smartphone-Browser vollständig bedienbar (responsive).
- [ ] **AC-02.5** — Wenn noch kein Status gesetzt wurde, wird ein sinnvoller Platzhalter angezeigt ("Ihr Berater arbeitet an Ihrem Projekt").

---

## US-W5-03 — Kunden-Dokumenten-Upload

### User Story
> Als **Kunde** möchte ich Dokumente (Energierechnungen, Baupläne) direkt im Portal hochladen,  
> damit der Berater alle relevanten Unterlagen zentral an einem Ort findet.

### Akzeptanzkriterien

- [ ] **AC-03.1** — Der Kunde kann im Portal Dateien per Klick oder Drag & Drop hochladen.
- [ ] **AC-03.2** — Erlaubte Formate: PDF, JPG, PNG — max. 10 MB pro Datei.
- [ ] **AC-03.3** — Hochgeladene Dokumente werden in Supabase Storage gespeichert und sind für den Berater im Projekt einsehbar.
- [ ] **AC-03.4** — Einem anderen Kunden sind die Dokumente nicht zugänglich (RLS-Policy).
- [ ] **AC-03.5** — Der Kunde sieht eine Liste seiner hochgeladenen Dokumente mit Name und Upload-Datum.
- [ ] **AC-03.6** — Bei einem unerlaubten Dateiformat oder Überschreitung der Dateigröße erscheint eine verständliche Fehlermeldung.

---

## US-W5-04 — Förder-Navigator

### User Story
> Als **Berater** möchte ich nach der Gebäudeerfassung automatisch sehen, welche Förderprogramme für das Projekt in Frage kommen,  
> damit ich dem Kunden schnell und sicher eine Förderempfehlung geben kann.

### Akzeptanzkriterien

- [ ] **AC-04.1** — Der Berater kann den Förder-Navigator aus einem abgeschlossenen Projekt starten.
- [ ] **AC-04.2** — Der Navigator prüft auf Basis der GEG-Begehungsdaten regelbasiert folgende Programme:
  - BAFA BEG EM (Einzelmaßnahmen)
  - BAFA BEG WG (Wohngebäude-Sanierung zum Effizienzhaus)
  - KfW BEG WG Kredit
  - iSFP-Bonus (+5 % auf BEG EM bei vorhandenem Sanierungsfahrplan)
- [ ] **AC-04.3** — Die Ergebnisseite zeigt für jedes Programm: ✅ förderfähig / ❌ nicht förderfähig / ⚠️ prüfen — mit kurzer Begründung.
- [ ] **AC-04.4** — Das Regelwerk ist als konfigurierbare Datei (nicht hardcoded) angelegt, damit Änderungen an Förderbedingungen schnell eingepflegt werden können.
- [ ] **AC-04.5** — Der Berater kann das Ergebnis als PDF exportieren oder direkt an den Kunden senden.
- [ ] **AC-04.6** — Das Ergebnis des Förder-Navigators wird im Projekt gespeichert und ist jederzeit wieder abrufbar.
- [ ] **AC-04.7** — Wenn Pflichtdaten für die Prüfung fehlen, erhält der Berater einen Hinweis, welche Felder im GEG-Formular noch ausgefüllt werden müssen.

---

## US-W5-05 — Fristenkalender

### User Story
> Als **Berater** möchte ich für jedes Projekt Deadlines & Fristen erfassen und im Dashboard als Alerts sehen,  
> damit ich keine wichtigen Termine (z.B. Antragsfristen bei BAFA/KfW) verpasse.

### Akzeptanzkriterien

- [ ] **AC-05.1** — Der Berater kann in einem Projekt beliebig viele Fristen anlegen mit: Titel, Datum, Beschreibung (optional), Typ (BAFA, KfW, Sonstiges).
- [ ] **AC-05.2** — Im Dashboard erscheint ein Fristen-Alert-Bereich, der Fristen der nächsten 14 Tage hervorhebt.
- [ ] **AC-05.3** — Abgelaufene Fristen werden visuell als "überfällig" markiert.
- [ ] **AC-05.4** — Fristen können als erledigt markiert und aus dem Alert-Bereich entfernt werden.
- [ ] **AC-05.5** — Der Berater kann Fristen bearbeiten und löschen.
- [ ] **AC-05.6** — Die Fristenübersicht ist projekt-übergreifend im Dashboard abrufbar (alle Fristen aller aktiven Projekte auf einen Blick).

---

## US-W5-06 — Projektstatus-Updates (Berater → Kunde)

### User Story
> Als **Berater** möchte ich dem Kunden Projektstatus-Updates schicken,  
> damit der Kunde immer informiert ist und ich weniger Rückfragen per Telefon bekomme.

### Akzeptanzkriterien

- [ ] **AC-06.1** — Der Berater kann aus einem Projekt heraus eine Statusnachricht verfassen und absenden.
- [ ] **AC-06.2** — Die Nachricht erscheint sofort als neuer Eintrag in der Projekt-Timeline im Kundenportal (In-App).
- [ ] **AC-06.3** — Gleichzeitig erhält der Kunde eine E-Mail-Benachrichtigung über das neue Update (via Resend).
- [ ] **AC-06.4** — Die E-Mail enthält: App-Name, Projektname, Statusnachricht, Link zum Kundenportal.
- [ ] **AC-06.5** — Der Berater kann vordefinierte Status-Vorlagen auswählen (z.B. "Vor-Ort-Termin vereinbart", "Förderantrag vorbereitet", "Bericht fertiggestellt") oder einen freien Text verfassen.
- [ ] **AC-06.6** — Alle gesendeten Updates sind im Projekt für den Berater protokolliert (mit Zeitstempel).

---

## US-W5-07 — E-Mail-Benachrichtigung via Resend

### User Story
> Als **System** soll jede relevante Benachrichtigung zuverlässig per E-Mail zugestellt werden,  
> damit Berater und Kunden keine wichtigen Ereignisse verpassen.

### Akzeptanzkriterien

- [ ] **AC-07.1** — E-Mails werden über Resend versendet (kein SMTP-Direktversand).
- [ ] **AC-07.2** — Die From-Adresse ist eine verifizierte Domain (nicht `noreply@supabase.io`).
- [ ] **AC-07.3** — E-Mail-Templates sind zweisprachig (DE/EN) entsprechend der App-Spracheinstellung des Empfängers.
- [ ] **AC-07.4** — E-Mails enthalten keinen Spam-anfälligen Inhalt und bestehen den Resend-Deliverability-Check.
- [ ] **AC-07.5** — Bei fehlgeschlagenem Versand wird ein Fehler geloggt (kein stiller Fail).

---

## US-W5-08 — Landingpage-Erweiterung (Welle-5-Features)

### User Story
> Als **Besucher** der Landingpage möchte ich erfahren, welche neuen Funktionen die App bietet (Kundenportal, Förder-Navigator),  
> damit ich die volle Bandbreite der App verstehe und mich zur Kontaktaufnahme entscheide.

### Akzeptanzkriterien

- [ ] **AC-08.1** — Die Landingpage (DE + EN) wird um einen Feature-Abschnitt für Kundenportal und Förder-Navigator ergänzt.
- [ ] **AC-08.2** — Die Erweiterungen fügen sich nahtlos in das bestehende Design von Welle 4 ein.
- [ ] **AC-08.3** — Alle neuen Texte sind korrekt übersetzt (DE + EN).
- [ ] **AC-08.4** — Lighthouse Score bleibt ≥ 90 für Performance und Accessibility.

---

## US-W5-09 — Testing lokal + live

### User Story
> Als **Entwickler** möchte ich den gesamten Welle-5-Hauptprozess lokal und im Livesystem testen,  
> damit sichergestellt ist, dass die App in Produktion fehlerfrei funktioniert.

### Akzeptanzkriterien

- [ ] **AC-09.1** — Der vollständige Hauptprozess wird lokal einmal komplett durchgespielt: Berater → Förder-Navigator → Ergebnis senden → Kunden-Login → Portalansicht.
- [ ] **AC-09.2** — Das Deployment auf Vercel schlägt nicht fehl (Build + Umgebungsvariablen korrekt konfiguriert).
- [ ] **AC-09.3** — Der Hauptprozess wird im Livesystem (Vercel Production) vollständig und fehlerfrei durchgespielt.
- [ ] **AC-09.4** — E-Mail-Versand via Resend funktioniert im Livesystem (Test-E-Mail wird empfangen).
- [ ] **AC-09.5** — Alle RLS-Policies werden im Livesystem getestet: Kunde kann keine fremden Projekte sehen, Berater-Seiten sind für Kunden gesperrt.

---

## US-W5-10 — Produkthandbuch-Erweiterung

### User Story
> Als **Product Owner** möchte ich das Produkthandbuch mit den Welle-5-Features aktualisieren,  
> damit neue Nutzer die App und alle Features korrekt verstehen und bedienen können.

### Akzeptanzkriterien

- [ ] **AC-10.1** — Das Produkthandbuch wird um folgende Abschnitte ergänzt: Kundenportal, Kunden-Dokumenten-Upload, Förder-Navigator, Fristenkalender, Projektstatus-Updates.
- [ ] **AC-10.2** — Jeder neue Abschnitt enthält: Kurzbeschreibung der Funktion, Schritt-für-Schritt-Anleitung, Hinweise auf Besonderheiten.
- [ ] **AC-10.3** — Das Produkthandbuch ist sowohl auf Deutsch als auch auf Englisch verfügbar.

---

## Abnahme-Checkliste Welle 5

**Alle Punkte müssen abgehakt sein, bevor Welle 5 als abgeschlossen gilt.**

### Funktional
- [ ] Kunden-Login funktioniert — Kunde sieht ausschließlich eigene Projekte
- [ ] Projektstatus im Portal wird korrekt angezeigt (Timeline, read-only)
- [ ] Kunden-Dokumenten-Upload funktioniert (PDF, JPG, PNG, max. 10 MB)
- [ ] Förder-Navigator prüft korrekt alle 4 Programme (BAFA BEG EM, BAFA BEG WG, KfW, iSFP-Bonus)
- [ ] Fristenkalender: Anlegen, bearbeiten, löschen, als erledigt markieren
- [ ] Dashboard-Alerts zeigen Fristen der nächsten 14 Tage
- [ ] Projektstatus-Update: Berater sendet → Kunde sieht es im Portal
- [ ] E-Mail-Benachrichtigung via Resend wird empfangen

### Sicherheit
- [ ] RLS-Policies getestet: Kunden können keine fremden Projekte, Dokumente oder Updates sehen
- [ ] Berater-Bereich ist für Kunden-Accounts vollständig gesperrt
- [ ] Alle Dokumente in Supabase Storage sind durch RLS geschützt

### Qualität
- [ ] Landingpage um Welle-5-Features erweitert (DE + EN)
- [ ] Lighthouse Score ≥ 90 (Performance + Accessibility)
- [ ] Hauptprozess im Livesystem fehlerfrei durchgespielt
- [ ] Produkthandbuch aktualisiert

### Abnahme
- [ ] Product Owner (Erwin Moretz) hat alle User Stories gegen ACs geprüft
- [ ] Alle ACs als ✅ bestätigt
- [ ] **Welle 5 freigegeben** ✅
