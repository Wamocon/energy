'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  User, MapPin, Calendar, Phone, ClipboardList, Camera,
  ArrowRight, FileDown, Home, Flame, Wind, Square, StickyNote,
} from 'lucide-react';
import type { Building, Project, ProjectPhoto } from '@/lib/db/types';

// ─── Label helpers ────────────────────────────────────────────────────────────

const BUILDING_TYPE: Record<string, string> = {
  single_family: 'Einfamilienhaus',
  two_family: 'Zweifamilienhaus',
  multi_family: 'Mehrfamilienhaus',
  commercial: 'Gewerbe',
};

const HEATING_TYPE: Record<string, string> = {
  gas_boiler: 'Gasheizung',
  oil_boiler: 'Ölheizung',
  heat_pump: 'Wärmepumpe',
  district: 'Fernwärme',
  pellet: 'Pellets',
  other: 'Sonstige',
};

const FACADE_MATERIAL: Record<string, string> = {
  brick: 'Ziegel',
  sand_lime: 'Kalksandstein',
  concrete: 'Beton',
  wood: 'Holz',
  other: 'Sonstige',
};

const ROOF_TYPE: Record<string, string> = {
  flat: 'Flachdach',
  pitched: 'Satteldach',
  hipped: 'Walmdach',
  mono_pitched: 'Pultdach',
  other: 'Sonstige',
};

const WINDOW_TYPE: Record<string, string> = {
  single: 'Einfachverglasung',
  double: 'Zweifachverglasung',
  triple: 'Dreifachverglasung',
};

const VENTILATION_TYPE: Record<string, string> = {
  natural: 'Natürliche Lüftung',
  mechanical: 'Mechanische Lüftung',
  ventilation_system: 'Lüftungsanlage',
};

const FUEL_TYPE: Record<string, string> = {
  gas: 'Gas',
  oil: 'Öl',
  electricity: 'Strom',
  district: 'Fernwärme',
  biomass: 'Biomasse',
  other: 'Sonstige',
};

const HOT_WATER_TYPE: Record<string, string> = {
  central: 'Zentral',
  decentralized: 'Dezentral',
  heat_pump: 'Wärmepumpe',
  solar: 'Solar',
};

const PHOTO_CATEGORY_LABELS: Record<string, string> = {
  facade: 'Fassade',
  roof: 'Dach',
  basement: 'Keller',
  heating: 'Heizung',
  windows: 'Fenster',
  other: 'Sonstige',
};

function label(map: Record<string, string>, val: string | null | undefined): string {
  if (!val) return '—';
  return map[val] ?? val;
}

function bool(val: boolean | null | undefined): string {
  return val ? 'Ja' : 'Nein';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-100 py-2 text-sm">
      <span className="text-zinc-500">{name}</span>
      <span className="font-medium text-zinc-900">{value}</span>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="mb-2 mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 first:mt-0">
      {icon}
      {title}
    </h3>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  project: Project;
  building: Building | null;
  photos: ProjectPhoto[];
  projectId: string;
};

type Tab = 'overview' | 'inspection' | 'photos' | 'actions';

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectTabs({ project, building, photos, projectId }: Props) {
  const [active, setActive] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Übersicht' },
    { id: 'inspection', label: 'Begehung' },
    { id: 'photos', label: `Fotos${photos.length > 0 ? ` (${photos.length})` : ''}` },
    { id: 'actions', label: 'Aktionen' },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-4 flex overflow-x-auto border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === 'overview' && <OverviewTab project={project} />}
      {active === 'inspection' && <InspectionTab building={building} projectId={projectId} />}
      {active === 'photos' && <PhotosTab photos={photos} projectId={projectId} />}
      {active === 'actions' && <ActionsTab project={project} building={building} photos={photos} projectId={projectId} />}
    </div>
  );
}

// ─── Tab: Übersicht ───────────────────────────────────────────────────────────

function OverviewTab({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="mb-4 font-semibold text-zinc-900">Kundendaten</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <User size={15} className="mt-0.5 shrink-0 text-zinc-400" />
          <div>
            <dt className="text-zinc-500">Kunde</dt>
            <dd className="font-medium text-zinc-900">{project.customer_name}</dd>
          </div>
        </div>
        {project.customer_email && (
          <div className="flex items-start gap-3">
            <User size={15} className="mt-0.5 shrink-0 text-zinc-400" />
            <div>
              <dt className="text-zinc-500">E-Mail</dt>
              <dd className="text-zinc-900">{project.customer_email}</dd>
            </div>
          </div>
        )}
        {project.customer_phone && (
          <div className="flex items-start gap-3">
            <Phone size={15} className="mt-0.5 shrink-0 text-zinc-400" />
            <div>
              <dt className="text-zinc-500">Telefon</dt>
              <dd className="text-zinc-900">{project.customer_phone}</dd>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <MapPin size={15} className="mt-0.5 shrink-0 text-zinc-400" />
          <div>
            <dt className="text-zinc-500">Adresse</dt>
            <dd className="text-zinc-900">
              {project.address}, {project.postal_code} {project.city}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar size={15} className="mt-0.5 shrink-0 text-zinc-400" />
          <div>
            <dt className="text-zinc-500">Angelegt am</dt>
            <dd className="text-zinc-900">
              {new Date(project.created_at).toLocaleDateString('de-DE')}
            </dd>
          </div>
        </div>
        {project.appointment_date && (
          <div className="flex items-start gap-3">
            <Calendar size={15} className="mt-0.5 shrink-0 text-orange-400" />
            <div>
              <dt className="text-zinc-500">Begehungstermin</dt>
              <dd className="font-medium text-zinc-900">
                {new Date(project.appointment_date).toLocaleDateString('de-DE')}
              </dd>
            </div>
          </div>
        )}
        {project.customer_notes && (
          <div className="flex items-start gap-3">
            <StickyNote size={15} className="mt-0.5 shrink-0 text-zinc-400" />
            <div>
              <dt className="text-zinc-500">Notizen</dt>
              <dd className="text-zinc-900 whitespace-pre-wrap">{project.customer_notes}</dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}

// ─── Tab: Begehung ────────────────────────────────────────────────────────────

function InspectionTab({ building, projectId }: { building: Building | null; projectId: string }) {
  if (!building) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <ClipboardList size={32} className="mx-auto mb-3 text-zinc-300" />
        <p className="text-sm text-zinc-500">Noch keine Begehung erfasst.</p>
        <Link
          href={`/dashboard/projects/${projectId}/inspection`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Jetzt Begehung starten
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        {/* Gebäudedaten */}
        <SectionHeading icon={<Home size={14} />} title="Gebäudedaten" />
        {building.building_type && <Row name="Gebäudetyp" value={label(BUILDING_TYPE, building.building_type)} />}
        {building.year_built && <Row name="Baujahr" value={String(building.year_built)} />}
        {building.living_area && <Row name="Wohnfläche" value={`${building.living_area} m²`} />}
        {building.floors && <Row name="Stockwerke" value={String(building.floors)} />}
        <Row name="Keller vorhanden" value={bool(building.has_basement)} />

        {/* Gebäudehülle */}
        <SectionHeading icon={<Square size={14} />} title="Gebäudehülle" />
        {building.facade_material && <Row name="Fassadenmaterial" value={label(FACADE_MATERIAL, building.facade_material)} />}
        <Row name="Fassade gedämmt" value={bool(building.facade_insulated)} />
        {building.facade_insulation_thickness && (
          <Row name="Dämmstärke Fassade" value={`${building.facade_insulation_thickness} cm`} />
        )}
        {building.roof_type && <Row name="Dachtyp" value={label(ROOF_TYPE, building.roof_type)} />}
        <Row name="Dach gedämmt" value={bool(building.roof_insulated)} />
        <Row name="Kellerdecke gedämmt" value={bool(building.basement_ceiling_insulated)} />

        {/* Heizung */}
        <SectionHeading icon={<Flame size={14} />} title="Heizung & Warmwasser" />
        {building.heating_type && <Row name="Heizungstyp" value={label(HEATING_TYPE, building.heating_type)} />}
        {building.heating_year && <Row name="Baujahr Heizung" value={String(building.heating_year)} />}
        {building.heating_fuel && <Row name="Brennstoff" value={label(FUEL_TYPE, building.heating_fuel)} />}
        {building.hot_water_type && <Row name="Warmwassererzeugung" value={label(HOT_WATER_TYPE, building.hot_water_type)} />}
        <Row name="Solarthermie" value={bool(building.has_solar_thermal)} />

        {/* Fenster */}
        <SectionHeading icon={<Square size={14} />} title="Fenster" />
        {building.window_type && <Row name="Verglasung" value={label(WINDOW_TYPE, building.window_type)} />}
        {building.window_frame_material && <Row name="Rahmenmaterial" value={building.window_frame_material} />}
        {building.window_u_value && <Row name="U-Wert" value={`${building.window_u_value} W/(m²K)`} />}
        {building.window_g_value && <Row name="g-Wert" value={String(building.window_g_value)} />}

        {/* Lüftung */}
        <SectionHeading icon={<Wind size={14} />} title="Lüftung" />
        {building.ventilation_type && <Row name="Lüftungstyp" value={label(VENTILATION_TYPE, building.ventilation_type)} />}
        <Row name="Wärmerückgewinnung" value={bool(building.has_heat_recovery)} />

        {/* Notizen */}
        {building.notes && (
          <>
            <SectionHeading icon={<StickyNote size={14} />} title="Notizen" />
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">{building.notes}</p>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href={`/dashboard/projects/${projectId}/inspection`}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          <ClipboardList size={15} />
          Begehung bearbeiten
        </Link>
      </div>
    </div>
  );
}

// ─── Tab: Fotos ───────────────────────────────────────────────────────────────

function PhotosTab({ photos, projectId }: { photos: ProjectPhoto[]; projectId: string }) {
  const categories = ['facade', 'roof', 'basement', 'heating', 'windows', 'other'] as const;

  const countByCategory = categories.reduce<Record<string, number>>(
    (acc, cat) => ({ ...acc, [cat]: photos.filter((p) => p.category === cat).length }),
    {},
  );

  return (
    <div className="space-y-4">
      {photos.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <Camera size={32} className="mx-auto mb-3 text-zinc-300" />
          <p className="text-sm text-zinc-500">Noch keine Fotos hochgeladen.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Fotos nach Kategorie</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = countByCategory[cat] ?? 0;
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                >
                  <span className="text-sm text-zinc-700">{PHOTO_CATEGORY_LABELS[cat]}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      count > 0 ? 'bg-orange-100 text-orange-700' : 'bg-zinc-200 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          href={`/dashboard/projects/${projectId}/photos`}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          <Camera size={15} />
          Fotos verwalten
        </Link>
      </div>
    </div>
  );
}

// ─── Tab: Aktionen ────────────────────────────────────────────────────────────

function ActionsTab({
  project,
  building,
  photos,
  projectId,
}: {
  project: Project;
  building: Building | null;
  photos: ProjectPhoto[];
  projectId: string;
}) {
  const [pdfState, setPdfState] = useState<'idle' | 'generating'>('idle');

  async function handlePdfExport() {
    setPdfState('generating');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const margin = 18;
      const pageWidth = 210;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // ── Helper functions ──────────────────────────────────────────────────
      function addText(
        text: string,
        size: number,
        style: 'normal' | 'bold' = 'normal',
        color: [number, number, number] = [30, 30, 30],
      ) {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, margin, y);
        y += size * 0.5 + 2;
      }

      function addRow(name: string, value: string) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(name, margin, y);
        doc.setTextColor(30, 30, 30);
        doc.text(value || '—', margin + contentWidth * 0.55, y);
        y += 6;
        // separator line
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y - 1, margin + contentWidth, y - 1);
      }

      function sectionTitle(title: string) {
        y += 4;
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(title.toUpperCase(), margin + 2, y + 0.5);
        y += 8;
      }

      function checkPage(needed = 20) {
        if (y + needed > 277) {
          doc.addPage();
          y = margin;
        }
      }

      // ── Header ────────────────────────────────────────────────────────────
      doc.setFillColor(30, 58, 138); // brand blue
      doc.rect(0, 0, 210, 22, 'F');
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Saniatlas', margin, 13);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Begehungsprotokoll', margin + 48, 13);
      doc.setTextColor(180, 180, 220);
      doc.text(
        `Erstellt am ${new Date().toLocaleDateString('de-DE')}`,
        pageWidth - margin,
        13,
        { align: 'right' },
      );
      y = 32;

      // ── Project title ─────────────────────────────────────────────────────
      addText(project.customer_name, 16, 'bold');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${project.address}, ${project.postal_code} ${project.city}`, margin, y);
      y += 8;

      // ── Kundendaten ───────────────────────────────────────────────────────
      checkPage();
      sectionTitle('Kundendaten');
      addRow('Name', project.customer_name);
      if (project.customer_email) addRow('E-Mail', project.customer_email);
      if (project.customer_phone) addRow('Telefon', project.customer_phone);
      addRow('Adresse', `${project.address}, ${project.postal_code} ${project.city}`);
      if (project.appointment_date) {
        addRow('Begehungstermin', new Date(project.appointment_date).toLocaleDateString('de-DE'));
      }
      addRow('Projektstatus', project.status === 'new' ? 'Neu' : project.status === 'in_progress' ? 'In Bearbeitung' : 'Abgeschlossen');
      addRow('Angelegt am', new Date(project.created_at).toLocaleDateString('de-DE'));

      // ── Gebäudedaten ──────────────────────────────────────────────────────
      if (building) {
        checkPage();
        sectionTitle('Gebäudedaten');
        if (building.building_type) addRow('Gebäudetyp', label(BUILDING_TYPE, building.building_type));
        if (building.year_built) addRow('Baujahr', String(building.year_built));
        if (building.living_area) addRow('Wohnfläche', `${building.living_area} m²`);
        if (building.floors) addRow('Stockwerke', String(building.floors));
        addRow('Keller vorhanden', bool(building.has_basement));

        checkPage();
        sectionTitle('Gebäudehülle');
        if (building.facade_material) addRow('Fassadenmaterial', label(FACADE_MATERIAL, building.facade_material));
        addRow('Fassade gedämmt', bool(building.facade_insulated));
        if (building.facade_insulation_thickness) addRow('Dämmstärke Fassade', `${building.facade_insulation_thickness} cm`);
        if (building.roof_type) addRow('Dachtyp', label(ROOF_TYPE, building.roof_type));
        addRow('Dach gedämmt', bool(building.roof_insulated));
        addRow('Kellerdecke gedämmt', bool(building.basement_ceiling_insulated));

        checkPage();
        sectionTitle('Heizung & Warmwasser');
        if (building.heating_type) addRow('Heizungstyp', label(HEATING_TYPE, building.heating_type));
        if (building.heating_year) addRow('Baujahr Heizung', String(building.heating_year));
        if (building.heating_fuel) addRow('Brennstoff', label(FUEL_TYPE, building.heating_fuel));
        if (building.hot_water_type) addRow('Warmwassererzeugung', label(HOT_WATER_TYPE, building.hot_water_type));
        addRow('Solarthermie', bool(building.has_solar_thermal));

        checkPage();
        sectionTitle('Fenster');
        if (building.window_type) addRow('Verglasung', label(WINDOW_TYPE, building.window_type));
        if (building.window_frame_material) addRow('Rahmenmaterial', building.window_frame_material);
        if (building.window_u_value) addRow('U-Wert', `${building.window_u_value} W/(m²K)`);
        if (building.window_g_value) addRow('g-Wert', String(building.window_g_value));

        checkPage();
        sectionTitle('Lüftung');
        if (building.ventilation_type) addRow('Lüftungstyp', label(VENTILATION_TYPE, building.ventilation_type));
        addRow('Wärmerückgewinnung', bool(building.has_heat_recovery));

        if (building.notes) {
          checkPage(30);
          sectionTitle('Notizen');
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(building.notes, contentWidth);
          lines.forEach((line: string) => {
            checkPage(8);
            doc.text(line, margin, y);
            y += 5.5;
          });
        }
      }

      // ── Fotos summary ─────────────────────────────────────────────────────
      if (photos.length > 0) {
        checkPage();
        sectionTitle('Fotos');
        addRow('Gesamtzahl Fotos', String(photos.length));
        const categories = ['facade', 'roof', 'basement', 'heating', 'windows', 'other'] as const;
        categories.forEach((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          if (count > 0) addRow(PHOTO_CATEGORY_LABELS[cat], String(count));
        });
      }

      // ── Footer ────────────────────────────────────────────────────────────
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(160, 160, 160);
        doc.text(`Saniatlas · Seite ${i} von ${totalPages}`, margin, 290);
        doc.text(`saniatlas.de`, pageWidth - margin, 290, { align: 'right' });
      }

      const filename = `Saniatlas_${project.customer_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
    } finally {
      setPdfState('idle');
    }
  }

  return (
    <div className="space-y-3">
      {/* Begehung */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-zinc-900">Begehung</h2>
        <Link
          href={`/dashboard/projects/${projectId}/inspection`}
          className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          <span className="flex items-center gap-2.5">
            <ClipboardList size={16} className="text-zinc-400" />
            {building ? 'Begehung bearbeiten' : 'Begehung starten'}
          </span>
          <ArrowRight size={15} className="text-zinc-400" />
        </Link>
      </div>

      {/* Fotos */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-zinc-900">Fotos</h2>
        <Link
          href={`/dashboard/projects/${projectId}/photos`}
          className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          <span className="flex items-center gap-2.5">
            <Camera size={16} className="text-zinc-400" />
            Fotos verwalten
            {photos.length > 0 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                {photos.length}
              </span>
            )}
          </span>
          <ArrowRight size={15} className="text-zinc-400" />
        </Link>
      </div>

      {/* PDF Export */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-1 font-semibold text-zinc-900">PDF-Export</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Exportiert alle erfassten Begehungsdaten als strukturiertes PDF-Dokument.
          {!building && (
            <span className="block mt-1 text-amber-600">
              Hinweis: Noch keine Begehung erfasst — bitte zuerst das Begehungsformular ausfüllen.
            </span>
          )}
        </p>
        <button
          onClick={handlePdfExport}
          disabled={pdfState === 'generating'}
          className="flex items-center gap-2.5 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FileDown size={16} />
          {pdfState === 'generating' ? 'PDF wird erstellt…' : 'Begehungsprotokoll als PDF'}
        </button>
      </div>
    </div>
  );
}
