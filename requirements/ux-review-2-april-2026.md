# UX-Review 2 — April 2026

**Branch:** `design/ux-review-2`  
**Stand:** 04.04.2026  
**Basis:** Aktueller Implementierungsstand nach Welle 4 + UX-Redesign 1

---

## Ausgangslage

Die Anwendung verfügt nach dem ersten UX-Redesign über:
- Linke Sidebar-Navigation (nur Desktop, `md:flex hidden`)
- Breadcrumbs auf Unterseiten
- Light Mode, Orange als Akzentfarbe
- Lucide Icons durchgehend
- Workflow-Tracker auf der Projektdetailseite
- Inline-Foto-Upload je Formularabschnitt

---

## Kritische Befunde (vor den Vorschlägen)

| Schwere | Bereich | Problem |
|---|---|---|
| 🔴 KRITISCH | Mobile | Keine Navigation auf Mobilgeräten — Sidebar ist `hidden md:flex`, kein Fallback |
| 🔴 KRITISCH | Mobile | Dashboard-Tabelle bricht auf kleinen Screens ab |
| 🟠 HOCH | Workflow | Status „Abgeschlossen" kann nicht gesetzt werden — kein UI vorhanden |
| 🟠 HOCH | Navigation | „Dashboard" und „Projekte" zeigen auf dieselbe Route (`/dashboard`) — verwirrend |
| 🟡 MITTEL | Forms | Kein visuelles Feedback beim Speichern / Keine Auto-Save-Anzeige |
| 🟡 MITTEL | Fotos | Delete-Button nur per Hover erreichbar — auf Touch unmöglich |

---

## Verbesserungsvorschläge

---

### V1 — Mobile Bottom Navigation Bar

**Problem:** Die Sidebar ist auf Mobilgeräten vollständig ausgeblendet (`hidden md:flex`). Ein Nutzer auf dem Smartphone hat nach dem Login keine Navigationsmöglichkeit — er ist auf der Seite gefangen.

**Lösung:** Feste Bottom-Navigation am unteren Bildschirmrand auf Mobile (`md:hidden`), mit den 4 wichtigsten Zielen als Icon + Label.

```
┌─────────────────────────────────┐
│  [Dashboard] [Projekte] [+Neu]  │
│     🏠          📁       ➕      │
└─────────────────────────────────┘
```

| **Vorteile** | **Nachteile** |
|---|---|
| Behebt den kritischsten Mangel — App auf Mobile überhaupt nutzbar | Verliert ~56px Viewport-Höhe für Content |
| Native App-Feeling (entspricht iOS/Android-Patterns) | Kollisionsgefahr mit Browser-Navigationsleiste auf manchen Geräten |
| Daumen-freundlich — alle Ziele im unteren Bildschirmbereich erreichbar | 4 Punkte ist das Maximum ohne Overflow-Menü |
| Keine externe Library nötig | Muss mit `safe-area-inset-bottom` (Notch) umgehen |

**Aufwand:** Gering — neues `BottomNav.tsx` + Einbindung in `dashboard/layout.tsx`

---

### V2 — Projekt-Listenansicht: Karten statt Tabelle auf Mobile

**Problem:** Die Projektübersicht nutzt ein `<table>`-Element. Auf schmalen Screens werden zwar Adresse und Datum ausgeblendet (`hidden sm:table-cell`), aber das Tabellenformat selbst ist für Touch-Bedienung ungünstig: Zeilenhöhe zu klein, kein vollflächiger Tap-Bereich.

**Lösung:** Unterhalb von `sm:` wird die Tabelle durch eine vertikale Kartenliste ersetzt:

```
┌─────────────────────────────────┐
│ Erwin Moretz              [Neu] │
│ Mainzer Landstr. 393      →     │
│ Frankfurt · 04.04.26            │
└─────────────────────────────────┘
```

| **Vorteile** | **Nachteile** |
|---|---|
| Volle Zeilenbreite als Tap-Ziel | Mehr vertikaler Platz pro Eintrag |
| Zeigt alle Infos ohne Spalten-Ausblendung | Code-Komplexität steigt (zwei Darstellungsmodi) |
| Entspricht mobilen Apps (z. B. Xing, Salesforce Mobile) | Konsistenz Desktop↔Mobile sinkt |
| Status-Badge gut sichtbar als Chip | — |

**Aufwand:** Mittel — bestehendes `DashboardPage` erweitern mit responsive Kartenliste

---

### V3 — Workflow-Status änderbar machen (Abgeschlossen setzen)

**Problem:** Der Workflow-Tracker zeigt 4 Schritte. Für Schritt 4 „Abgeschlossen" fehlt jede Aktion — der Text lautet nur `Projekt auf „Abgeschlossen" setzen`, ohne Button oder Link.

**Lösung:** 
- Server Action `updateProjectStatus(id, 'completed')` in Projektdetail
- Wenn alle drei Vorschritte abgeschlossen sind: Aktions-Button „Projekt abschließen" in der Workflow-Box sichtbar machen
- Status-Badge in der Überschrift als Dropdown (Neu → In Bearbeitung → Abgeschlossen)

| **Vorteile** | **Nachteile** |
|---|---|
| Schließt den Workflow-Zyklus — Feature ist erst dann vollständig | Status-Übergänge müssen serverseitig validiert werden |
| Berater können erledigte Projekte filtern | Rückwärts-Status-Änderung (z. B. re-open) muss definiert werden |
| Entspricht dem in den User Stories beschriebenen Ablauf | Braucht Übersetzungsstrings für alle Status |

**Aufwand:** Mittel — Server Action + UI-Button auf Projektdetailseite

---

### V4 — Foto-Delete für Touch zugänglich machen

**Problem:** Der Lösch-Button auf Fotos (`×`) ist nur beim Hover sichtbar. Auf Touchscreens gibt es kein Hover — Fotos können nicht gelöscht werden.

**Lösung:** 
- Auf Touch-Geräten: Dauerhaft kleines X-Icon auf jedem Foto-Thumbnail
- Alternativ: Long-press → Auswahl-Modus mit Checkbox + Löschen-Aktion
- Einfachste Lösung: Button immer sichtbar, aber dezent (weißes X auf dunklem Kreis, unten rechts)

| **Vorteile** | **Nachteile** |
|---|---|
| Fotos auf Mobile löschbar — Basisfunktion | Visuell unruhiger als Hover-Ansatz |
| Einheitlich über Desktop + Mobile | Long-press-Muster komplex zu implementieren |
| UX-Pattern aus Google Photos / iOS | — |

**Aufwand:** Gering — `SectionPhotoUpload.tsx` und `PhotoUpload.tsx` anpassen

---

### V5 — Sticky Speichern-Button im Begehungsformular

**Problem:** Das Begehungsformular (`InspectionForm.tsx`) ist sehr lang (6 Abschnitte). Der Speichern-Button steht am Ende — auf Mobile muss der Berater bis ganz nach unten scrollen, um zu speichern. Bei unbeabsichtigtem Verlassen der Seite gehen alle Eingaben verloren.

**Lösung:**
- Sticky Footer-Bar nur auf Mobile (`md:hidden`): Zeigt `[Gespeichert ✓]` oder `[Speichern]` je nach Formularstatus
- Optional: Zweite Speichern-Schaltfläche am Anfang des Formulars auf Desktop

| **Vorteile** | **Nachteile** |
|---|---|
| Speichern immer erreichbar, egal wo man im Formular ist | Sticky-Element verbraucht Viewport-Höhe |
| Datenverlust wird stark reduziert | Zusammenspiel mit der Bottom Navigation (V1) muss koordiniert werden |
| Spart Zeit vor Ort beim Berater | Formular-State muss synchron mit Button-Status sein |
| Erhöht Confidence beim Ausfüllen | — |

**Aufwand:** Mittel — `InspectionForm.tsx` erweitern, Zustandsmanagement für Speicherstatus

---

### V6 — Toast-Benachrichtigungen für Feedback

**Problem:** Nach dem Speichern eines Formulars, nach dem Hochladen eines Fotos, oder nach Fehlern gibt es keine sichtbare Rückmeldung. Der Nutzer weiß nicht, ob die Aktion erfolgreich war.

**Lösung:** Leichtgewichtige Toast-Komponente (kein externes Package nötig — React Context + absolute Positionierung ausreichend):

```
┌ ✓ Begehung gespeichert ───────────── ×┐
└───────────────────────────────────────┘
```

| **Vorteile** | **Nachteile** |
|---|---|
| Klares Feedback bei allen Aktionen | Zu viele Toasts können nerven |
| Fehler werden sofort sichtbar | Muss zentral verwaltet werden (Context oder Zustand-Library) |
| Kein Seitenneuladen oder Modal nötig | Auto-Dismiss-Timing muss definiert werden |
| Bekanntes UX-Pattern (Material, iOS, Android) | — |

**Aufwand:** Mittel — Toast-Context + Provider + kleine Komponente, dann in allen Formularen einhängen

---

### V7 — PWA-Manifest für Home-Screen-Installation

**Problem:** Die App hat kein Web App Manifest. Berater, die die App regelmäßig auf dem Smartphone nutzen, können sie nicht wie eine native App installieren.

**Lösung:**
- `public/manifest.json` mit App-Name, Icons, Theme-Color Orange, Display-Mode Standalone
- `<link rel="manifest">` im Root-Layout
- `apple-touch-icon` für iOS
- Optional: Service Worker für Offline-Caching der statischen Assets

| **Vorteile** | **Nachteile** |
|---|---|
| App erscheint im Home-Screen ohne Browser-UI | Service Worker für Offline-Support erhöht Komplexität |
| Statusleiste in Orange (Brandfarbe) | Content (Projekte) bleibt online-abhängig ohne vollständiges Offline-First |
| Keine App-Store-Gebühren | iOS-Support für PWAs ist noch eingeschränkt (kein Push-Notification) |
| Professioneller Eindruck | Erfordert HTTPS in Produktion (Vercel liefert das mit) |

**Aufwand:** Gering — kein Code-Refactoring, nur neue statische Dateien + Metadaten

---

### V8 — Skeleton-Loading-States statt leerer Seiten

**Problem:** Die App nutzt Server Components — Seiten rendern vollständig bevor sie ausgeliefert werden. Die `loading.tsx` im Dashboard-Ordner existiert, zeigt aber wahrscheinlich nur einen leeren Zustand. Bei langsamer Verbindung (mobiles Netz, 4G) entsteht ein weißes Bild.

**Lösung:**
- Skeleton-Komponente: Animierte graue Platzhalter in der Form der echten UI-Elemente
- `dashboard/loading.tsx` mit Skeleton-Tabelle (3 Zeilen, animated pulse)
- `dashboard/projects/[id]/loading.tsx` mit Skeleton-Karten

| **Vorteile** | **Nachteile** |
|---|---|
| Nutzerperzeption der Ladezeit verbessert sich deutlich | Zusätzliche Komponenten und Dateien |
| Kein Sprung/Layout-Shift nach dem Laden | Skeleton muss ungefähr zum echten Layout passen |
| Entspricht dem aktuellen Stand der Technik (Next.js Streaming) | Pflegeaufwand wenn sich Layout ändert |

**Aufwand:** Gering bis Mittel — `loading.tsx`-Dateien und Skeleton-Komponente

---

### V9 — Projekt-Suche und Statusfilter im Dashboard

**Problem:** Wenn ein Berater viele Projekte hat, gibt es keine Möglichkeit, schnell ein bestimmtes zu finden. Die Liste ist chronologisch sortiert, ohne Suchfunktion oder Filter.

**Lösung:**
- Suchleiste über der Projektliste (Client Component, filtert lokal)
- Status-Filter-Chips: `[Alle] [Neu] [In Bearbeitung] [Abgeschlossen]`
- Auf Mobile: Suchleiste prominent oben, Filter als horizontale scrollbare Chips

| **Vorteile** | **Nachteile** |
|---|---|
| Stark erhöhte Produktivität bei vielen Projekten | Client Component benötigt `useState` → `"use client"` für den Wrapper |
| Filter-Chips zeigen Projektanzahl pro Status | Muss mit Server-Side-Pagination abgestimmt werden (bei großen Datenmengen) |
| Bekanntes Pattern (jede Listenseite in Business-Apps) | Lokale Suche funktioniert nur wenn alle Projekte geladen sind |

**Aufwand:** Mittel — Client-Wrapper-Komponente für Dashboard-Tabelle/-Karten

---

### V10 — Mobile Header / Hamburger-Menü (ergänzend zu V1)

**Problem:** Die Sidebar ist auf Desktop großartig. Auf Mobile fehlt aber auch der App-Name / die Orientierungslinie am oberen Rand. Der Nutzer sieht nur Content ohne Kontext.

**Lösung:** Top-Bar auf Mobile (`md:hidden`):
```
┌─────────────────────────────────┐
│ ⚡ Energieberater        ≡ Menü  │
└─────────────────────────────────┘
```
- Hamburger öffnet Drawer von links (slide-in) mit vollem Navigationsmenü
- Ergänzend oder als Alternative zu Bottom Navigation (V1)

| **Vorteile** | **Nachteile** |
|---|---|
| Entspricht klassischem Web-App-Muster | Hamburger-Menüs haben schlechtere Entdeckungsrate als Bottom Nav |
| App-Name immer sichtbar — bessere Orientierung | Drawer-Overlay erhöht Implementierungsaufwand |
| Mehr Platz für Navigation (nicht auf 4 Icons limitiert) | Hamburger + Bottom Nav gleichzeitig ist Muster-Dopplung |

**Aufwand:** Mittel — Drawer-Komponente + Toggle-Zustand (benötigt `"use client"`)

---

### V11 — Formular-Abschnitte im Begehungsformular klappbar machen

**Problem:** Das Begehungsformular rendert alle 6 Abschnitte gleichzeitig — auf Mobile ist das eine sehr lange Scroll-Strecke ohne Orientierung. Berater müssen oft nur einen Abschnitt ergänzen, müssen aber durch alle anderen scrollen.

**Lösung:** Accordion-Muster: Jeder Abschnitt hat eine Kopfzeile mit Status-Indikator (grüner Haken wenn ausgefüllt, graue Nummerierung wenn leer). Nur der aktive Abschnitt ist aufgeklappt.

```
┌ ✓ 1. Gebäudedaten ──────────────── ▼ ┐
└─────────────────────────────────────┘
┌ ○ 2. Gebäudehülle ──────────────── ▶ ┐
└─────────────────────────────────────┘
```

| **Vorteile** | **Nachteile** |
|---|---|
| Drastisch reduzierte Scroll-Strecke auf Mobile | Initial alle Abschnitte zu lesen (Überblick) wird schwerer |
| Fortschrittsanzeige pro Abschnitt direkt sichtbar | Animation-Overhead (CSS-Transition für Expand/Collapse) |
| Berater sieht auf einen Blick was noch fehlt | React-State für aktiven Abschnitt benötigt Client Component |
| Pattern aus GEG-Checklisten und Branchen-Apps bekannt | Muss Auto-Expand bei initialem Aufruf mit Daten lösen |

**Aufwand:** Mittel bis Hoch — Refactoring von `InspectionForm.tsx` in Accordion-Struktur

---

### V12 — Projektstatus-Badge klickbar + Rollen-Feedback

**Problem:** Der Status-Badge auf der Projektdetailseite (z. B. „Neu" in blau) sieht klickbar aus, ist es aber nicht. Berater haben keine Möglichkeit, den Status manuell zu ändern oder zurückzusetzen.

**Lösung:**
- Status-Badge wird zu einem Dropdown / Select-Menü
- Server Action für Status-Update
- Bestätigungs-Dialog vor dem Setzen auf „Abgeschlossen" (nicht rückgängig machbar ohne explizites Re-Open)

| **Vorteile** | **Nachteile** |
|---|---|
| Berater hat volle Kontrolle über Projektstatus | Falsch-Klicks möglich ohne Bestätigungsdialog |
| Ergänzt V3 (Workflow-Abschluss) um manuelle Kontrolle | Status-Logik muss definiert sein (welche Übergänge erlaubt?) |
| Spart einen separaten „Status ändern"-Button/Seite | Dropdown auf Mobile braucht ausreichend Tap-Fläche |

**Aufwand:** Mittel — Client Component für Status-Dropdown + Server Action

---

## Priorisierungsmatrix

| # | Vorschlag | Impact | Aufwand | Priorität |
|---|---|---|---|---|
| V1 | Mobile Bottom Navigation | 🔥 Kritisch | Gering | **P0** |
| V4 | Foto-Delete Touch | 🔥 Kritisch | Gering | **P0** |
| V3 | Workflow-Status setzbar | 🔴 Hoch | Mittel | **P1** |
| V2 | Projekt-Karten mobile | 🔴 Hoch | Mittel | **P1** |
| V5 | Sticky Speichern-Button | 🟠 Mittel | Mittel | **P2** |
| V6 | Toast-Notifications | 🟠 Mittel | Mittel | **P2** |
| V9 | Suche + Filter | 🟠 Mittel | Mittel | **P2** |
| V11 | Accordion-Formular | 🟡 Mittel | Hoch | **P3** |
| V7 | PWA-Manifest | 🟡 Mittel | Gering | **P3** |
| V8 | Skeleton-Loading | 🟡 Gering | Gering | **P3** |
| V10 | Mobile Hamburger-Menü | 🟡 Gering | Mittel | **P3** |
| V12 | Status-Badge klickbar | 🟡 Gering | Mittel | **P3** |

---

## Empfehlung für Welle 5

**Sofort umsetzen (P0, weil kritisch für Mobile-Nutzung):**
- V1 — Bottom Navigation
- V4 — Foto-Delete per Touch

**In Welle 5 umsetzen (P1/P2, höchster ROI):**
- V3 — Workflow abschließbar machen
- V2 — Projekt-Karten auf Mobile
- V6 — Toast-Notifications (Basis für alle anderen Feedback-UX)
- V5 — Sticky Speichern im Formular

**Nice-to-have (P3, nach Kernfunktionen):**
- V7 — PWA-Manifest (wenig Aufwand, großer Effekt für Stammnutzer)
- V8 — Skeleton Loading
- V9 — Suche + Filter (erst relevant ab ~20 Projekten)
