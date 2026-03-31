# User Stories — Welle 4 "Berater Core"

**App:** Energieberater (Arbeitstitel)  
**Zeitraum:** KW14 — 06.–12. April 2026  
**Entwicklungszeit:** 16h  
**Status:** 🟡 Entwurf — ausstehend Review durch Product Owner (Erwin Moretz)

---

## Hauptprozess-Ziel

> Berater meldet sich an → legt Projekt an → füllt GEG-Begehungsformular aus → lädt Fotos hoch → sieht Projektübersicht im Dashboard ✅

---

## Rollen

| Kürzel | Rolle | Beschreibung |
|---|---|---|
| Berater | Energieberater | Freiberuflicher Energieberater, nutzt die App täglich |
| Besucher | Website-Besucher | Potenzieller Neukunde, sieht die Landingpage |

---

## US-W4-01 — Registrierung & Login

### User Story
> Als **Berater** möchte ich mich mit E-Mail und Passwort registrieren und anmelden,  
> damit ich sicher auf meine Projekte und Kundendaten zugreifen kann.

### Akzeptanzkriterien

- [ ] **AC-01.1** — Ein neuer Berater kann sich über ein Registrierungsformular mit E-Mail + Passwort registrieren.
- [ ] **AC-01.2** — Nach der Registrierung erhält der Berater eine Bestätigungs-E-Mail (Supabase Auth).
- [ ] **AC-01.3** — Ein registrierter Berater kann sich mit korrekten Zugangsdaten einloggen und wird auf das Dashboard weitergeleitet.
- [ ] **AC-01.4** — Bei falschen Zugangsdaten wird eine verständliche Fehlermeldung angezeigt (kein technischer Stack-Trace).
- [ ] **AC-01.5** — Ein eingeloggter Berater kann sich ausloggen. Die Session wird beendet und er wird auf die Login-Seite geleitet.
- [ ] **AC-01.6** — Geschützte Seiten (Dashboard, Formular) sind ohne Login nicht erreichbar — Redirect auf Login.
- [ ] **AC-01.7** — Das Passwort wird nicht im Klartext übertragen oder gespeichert (Supabase verwaltet Hashing).

---

## US-W4-02 — Projekt anlegen

### User Story
> Als **Berater** möchte ich ein neues Kundenprojekt anlegen,  
> damit ich alle Informationen zu einem Gebäude und Kunden strukturiert erfassen kann.

### Akzeptanzkriterien

- [ ] **AC-02.1** — Der Berater kann über einen "Neues Projekt"-Button ein Projekt anlegen.
- [ ] **AC-02.2** — Pflichtfelder beim Anlegen: Projektname, Kundenname, Adresse des Gebäudes, Gebäudetyp (Dropdown: Einfamilienhaus, Mehrfamilienhaus, Gewerbe), Baujahr.
- [ ] **AC-02.3** — Nach dem Anlegen erscheint das Projekt sofort in der Projektliste des Dashboards.
- [ ] **AC-02.4** — Jedes Projekt gehört ausschließlich dem Berater, der es angelegt hat (RLS: kein anderer Berater sieht fremde Projekte).
- [ ] **AC-02.5** — Fehlende Pflichtfelder werden vor dem Speichern validiert und mit einer Fehlermeldung markiert.
- [ ] **AC-02.6** — Ein angelegtes Projekt hat den Initialstatus "Neu".

---

## US-W4-03 — Berater-Dashboard

### User Story
> Als **Berater** möchte ich auf meinem Dashboard alle meine Projekte und deren Status sehen,  
> damit ich schnell einen Überblick über meinen aktuellen Workload habe.

### Akzeptanzkriterien

- [ ] **AC-03.1** — Das Dashboard zeigt alle Projekte des eingeloggten Beraters in einer Liste.
- [ ] **AC-03.2** — Jede Projektzeile zeigt: Projektname, Kundenname, Adresse, Gebäudetyp, Status (Neu / In Bearbeitung / Abgeschlossen).
- [ ] **AC-03.3** — Der Berater kann ein Projekt in der Liste anklicken und gelangt zur Projektdetailansicht.
- [ ] **AC-03.4** — Bei noch keinen Projekten wird ein leerer Zustand mit CTA "Erstes Projekt anlegen" angezeigt.
- [ ] **AC-03.5** — Das Dashboard ist auf dem Smartphone-Browser ohne horizontales Scrollen bedienbar (responsive).
- [ ] **AC-03.6** — Die Projektliste lädt in unter 3 Sekunden (bei < 100 Projekten).

---

## US-W4-04 — GEG-Begehungsformular

### User Story
> Als **Berater** möchte ich für ein Projekt ein strukturiertes GEG-Begehungsformular ausfüllen,  
> damit ich alle relevanten Gebäudedaten normgerecht und vollständig erfasse.

### Akzeptanzkriterien

- [ ] **AC-04.1** — Das Formular ist in vier Abschnitte gegliedert: **Gebäudehülle**, **Heizung**, **Fenster**, **Lüftung**.
- [ ] **AC-04.2** — **Gebäudehülle:** Felder für Außenwand (Material, U-Wert), Dach (Material, U-Wert), Kellerdecke (gedämmt ja/nein).
- [ ] **AC-04.3** — **Heizung:** Felder für Heizungstyp (Dropdown: Gas, Öl, Wärmepumpe, Fernwärme, Pellets, Sonstiges), Baujahr der Anlage, Warmwasserbereitung (integriert/separat).
- [ ] **AC-04.4** — **Fenster:** Felder für Verglasung (Einfach/Zweifach/Dreifach), Rahmenmaterial, geschätztes Baujahr.
- [ ] **AC-04.5** — **Lüftung:** Felder für Lüftungsanlage vorhanden (ja/nein), Typ (falls vorhanden: Abluftsystem, Zu-/Abluftsystem mit WRG).
- [ ] **AC-04.6** — Pflichtfelder sind markiert. Das Formular kann nicht ohne ausgefüllte Pflichtfelder gespeichert werden.
- [ ] **AC-04.7** — Der Berater kann das Formular zwischenspeichern (Entwurf) und später weiterbearbeiten.
- [ ] **AC-04.8** — Gespeicherte Formulardaten sind der Projektdetailansicht zugeordnet und jederzeit abrufbar.
- [ ] **AC-04.9** — Das Formular ist auf dem Smartphone-Browser vollständig bedienbar (Touch-optimiert, keine Hover-only-Elemente).
- [ ] **AC-04.10** — Nach dem finalen Speichern wechselt der Projektstatus auf "In Bearbeitung".

---

## US-W4-05 — Foto-Upload je Bauteil

### User Story
> Als **Berater** möchte ich bei der Begehung Fotos direkt dem jeweiligen Bauteil zuordnen,  
> damit ich die Befundlage visuell dokumentieren kann.

### Akzeptanzkriterien

- [ ] **AC-05.1** — An jedem Formularabschnitt (Gebäudehülle, Heizung, Fenster, Lüftung) gibt es eine Upload-Schaltfläche für Fotos.
- [ ] **AC-05.2** — Der Berater kann auf dem Smartphone-Browser direkt die Gerätekamera öffnen oder ein Foto aus der Galerie wählen.
- [ ] **AC-05.3** — Erlaubte Dateiformate: JPG, PNG, HEIC. Maximale Dateigröße: 10 MB pro Bild.
- [ ] **AC-05.4** — Hochgeladene Fotos werden in Supabase Storage gespeichert und dem jeweiligen Bauteil + Projekt zugeordnet.
- [ ] **AC-05.5** — Hochgeladene Fotos werden als Thumbnails in der Formularansicht angezeigt.
- [ ] **AC-05.6** — Der Berater kann ein hochgeladenes Foto löschen.
- [ ] **AC-05.7** — Fotos eines Projekts sind nur für den Berater sichtbar, dem das Projekt gehört (RLS + Supabase Storage Policies).
- [ ] **AC-05.8** — Bei ungültigem Dateiformat oder überschrittener Dateigröße wird eine verständliche Fehlermeldung angezeigt.

---

## US-W4-06 — Landingpage (DE & EN)

### User Story
> Als **Besucher** möchte ich eine professionelle Landingpage der App auf Deutsch und Englisch sehen,  
> damit ich den Nutzen der App schnell verstehe und Kontakt aufnehmen kann.

### Akzeptanzkriterien

- [ ] **AC-06.1** — Die Landingpage ist unter der Root-URL `/` erreichbar und standardmäßig auf Deutsch.
- [ ] **AC-06.2** — Der Besucher kann per Sprachumschalter zwischen Deutsch (`/`) und Englisch (`/en`) wechseln.
- [ ] **AC-06.3** — Die Landingpage enthält: Hero-Bereich mit Headline + Subheadline + CTA-Button, Features-Bereich (mind. 3 Hauptfunktionen), Footer mit Impressum-Link und Datenschutz-Link.
- [ ] **AC-06.4** — Der CTA-Button führt zur Login-/Registrierungsseite.
- [ ] **AC-06.5** — Die Landingpage ist vollständig responsive (Mobile, Tablet, Desktop).
- [ ] **AC-06.6** — Alle textuellen Inhalte sind in DE und EN vollständig übersetzt — kein englischer Text auf der deutschen Version und umgekehrt.
- [ ] **AC-06.7** — Die Seite erreicht einen Lighthouse Performance Score von mind. 80 (Desktop) bei Vercel-Deployment.

---

## US-W4-07 — Deployment & Livesystem-Test

### User Story
> Als **Berater** möchte ich die App auf einem öffentlich zugänglichen Livesystem nutzen,  
> damit ich sie auch unterwegs beim Kunden verwenden kann.

### Akzeptanzkriterien

- [ ] **AC-07.1** — Die App ist auf Vercel deployed und über eine öffentliche URL erreichbar.
- [ ] **AC-07.2** — Der gesamte Hauptprozess (Registrieren → Login → Projekt anlegen → Formular ausfüllen → Foto hochladen → Dashboard) funktioniert im Livesystem fehlerfrei.
- [ ] **AC-07.3** — Umgebungsvariablen (Supabase URL, Anon Key) sind als Vercel-Environment-Variablen konfiguriert — nicht im Code.
- [ ] **AC-07.4** — Der Build schlägt nicht fehl. GitHub Actions CI/CD Pipeline ist grün.
- [ ] **AC-07.5** — Der Test des Hauptprozesses wurde erfolgreich auf einem echten Smartphone-Browser (iOS Safari oder Chrome Android) durchgeführt.

---

## US-W4-08 — Produkthandbuch Welle 4

### User Story
> Als **Berater** möchte ich ein Produkthandbuch für Welle 4 haben,  
> damit ich die App selbst erklären und neue Nutzer einführen kann.

### Akzeptanzkriterien

- [ ] **AC-08.1** — Das Produkthandbuch beschreibt alle Welle-4-Features auf mind. 1 Seite (A4).
- [ ] **AC-08.2** — Jeder Hauptschritt des Hauptprozesses ist mit Screenshot oder Beschreibung dokumentiert.
- [ ] **AC-08.3** — Das Handbuch ist auf Deutsch verfasst.

---

## Abnahme-Checkliste Welle 4

> Alle nachfolgenden Punkte müssen erfüllt sein, bevor Welle 4 als **abgeschlossen** gilt.

- [ ] Alle User Stories US-W4-01 bis US-W4-08 wurden vom Product Owner reviewed und freigegeben.
- [ ] Alle Akzeptanzkriterien wurden im Livesystem getestet und als ✅ abgehakt.
- [ ] Kein offener Bug mit Schweregrad "Hoch" oder "Kritisch".
- [ ] App ist auf Vercel deployed und öffentlich erreichbar.
- [ ] Hauptprozess auf echtem Smartphone erfolgreich getestet.
- [ ] Produkthandbuch Welle 4 ist erstellt.

---

*Erstellt: März 2026 | KI-generiert, Review ausstehend: Erwin Moretz*
