'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { SectionPhotoUpload } from './SectionPhotoUpload';
import { ChevronDown } from 'lucide-react';
import type { Building, PhotoCategory, ProjectPhoto } from '@/lib/db/types';

type SectionProps = {
  idx: number;
  openSection: number;
  onToggle: (idx: number) => void;
  icon: string;
  title: string;
  children: React.ReactNode;
};

function AccordionSection({ idx, openSection, onToggle, icon, title, children }: SectionProps) {
  const isOpen = openSection === idx;
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => onToggle(idx)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <span>{icon}</span>
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-zinc-100 px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

type FormData = {
  building_type: string;
  year_built: string;
  living_area: string;
  floors: string;
  has_basement: boolean;
  facade_material: string;
  facade_insulated: boolean;
  facade_insulation_thickness: string;
  roof_type: string;
  roof_insulated: boolean;
  basement_ceiling_insulated: boolean;
  heating_type: string;
  heating_year: string;
  heating_fuel: string;
  hot_water_type: string;
  has_solar_thermal: boolean;
  window_type: string;
  window_frame_material: string;
  window_g_value: string;
  window_u_value: string;
  ventilation_type: string;
  has_heat_recovery: boolean;
  notes: string;
};

function toNum(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function toInt(val: string): number | null {
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

type Props = {
  projectId: string;
  building: Building | null;
  userId: string;
  initialPhotos: ProjectPhoto[];
};

export function InspectionForm({ projectId, building, userId, initialPhotos }: Props) {
  const photosByCategory = ([
    'facade', 'roof', 'basement', 'heating', 'windows', 'other',
  ] as PhotoCategory[]).reduce<Record<PhotoCategory, ProjectPhoto[]>>(
    (acc, cat) => ({ ...acc, [cat]: initialPhotos.filter((p) => p.category === cat) }),
    {} as Record<PhotoCategory, ProjectPhoto[]>,
  );
  const t = useTranslations('inspection');
  const router = useRouter();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [openSection, setOpenSection] = useState<number>(0);

  function toggleSection(idx: number) {
    setOpenSection((prev) => (prev === idx ? -1 : idx));
  }

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      building_type: building?.building_type ?? '',
      year_built: building?.year_built?.toString() ?? '',
      living_area: building?.living_area?.toString() ?? '',
      floors: building?.floors?.toString() ?? '',
      has_basement: building?.has_basement ?? false,
      facade_material: building?.facade_material ?? '',
      facade_insulated: building?.facade_insulated ?? false,
      facade_insulation_thickness: building?.facade_insulation_thickness?.toString() ?? '',
      roof_type: building?.roof_type ?? '',
      roof_insulated: building?.roof_insulated ?? false,
      basement_ceiling_insulated: building?.basement_ceiling_insulated ?? false,
      heating_type: building?.heating_type ?? '',
      heating_year: building?.heating_year?.toString() ?? '',
      heating_fuel: building?.heating_fuel ?? '',
      hot_water_type: building?.hot_water_type ?? '',
      has_solar_thermal: building?.has_solar_thermal ?? false,
      window_type: building?.window_type ?? '',
      window_frame_material: building?.window_frame_material ?? '',
      window_g_value: building?.window_g_value?.toString() ?? '',
      window_u_value: building?.window_u_value?.toString() ?? '',
      ventilation_type: building?.ventilation_type ?? '',
      has_heat_recovery: building?.has_heat_recovery ?? false,
      notes: building?.notes ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    setSaveState('saving');
    const supabase = createClient();

    const payload = {
      project_id: projectId,
      building_type: data.building_type || null,
      year_built: toInt(data.year_built),
      living_area: toNum(data.living_area),
      floors: toInt(data.floors),
      has_basement: data.has_basement,
      facade_material: data.facade_material || null,
      facade_insulated: data.facade_insulated,
      facade_insulation_thickness: toInt(data.facade_insulation_thickness),
      roof_type: data.roof_type || null,
      roof_insulated: data.roof_insulated,
      basement_ceiling_insulated: data.basement_ceiling_insulated,
      heating_type: data.heating_type || null,
      heating_year: toInt(data.heating_year),
      heating_fuel: data.heating_fuel || null,
      hot_water_type: data.hot_water_type || null,
      has_solar_thermal: data.has_solar_thermal,
      window_type: data.window_type || null,
      window_frame_material: data.window_frame_material || null,
      window_g_value: toNum(data.window_g_value),
      window_u_value: toNum(data.window_u_value),
      ventilation_type: data.ventilation_type || null,
      has_heat_recovery: data.has_heat_recovery,
      notes: data.notes || null,
    };

    let error;
    if (building) {
      ({ error } = await supabase.from('buildings').update(payload).eq('id', building.id));
    } else {
      ({ error } = await supabase.from('buildings').insert(payload));
    }

    if (error) {
      setSaveState('error');
      return;
    }

    // AC-04.10: set status → 'in_progress' if project was still 'new'
    await supabase
      .from('projects')
      .update({ status: 'in_progress' })
      .eq('id', projectId)
      .eq('status', 'new');

    setSaveState('saved');
    router.push(`/dashboard/projects/${projectId}`);
    router.refresh();
  }

  const inputCls =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400';
  const selectCls = inputCls;
  const labelCls = 'mb-1.5 block text-sm font-medium text-zinc-700';
  const checkboxCls = 'h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-400';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* 1. Gebäudedaten */}
      <AccordionSection idx={0} openSection={openSection} onToggle={toggleSection} icon="🏠" title={t('sections.building')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>{t('building.type')}</label>
            <select {...register('building_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="single_family">{t('building.types.single_family')}</option>
              <option value="two_family">{t('building.types.two_family')}</option>
              <option value="multi_family">{t('building.types.multi_family')}</option>
              <option value="commercial">{t('building.types.commercial')}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('building.yearBuilt')}</label>
            <input type="number" placeholder="z.B. 1975" {...register('year_built')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t('building.livingArea')}</label>
            <input type="number" placeholder="z.B. 150" {...register('living_area')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t('building.floors')}</label>
            <input type="number" placeholder="z.B. 2" {...register('floors')} className={inputCls} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="has_basement" {...register('has_basement')} className={checkboxCls} />
            <label htmlFor="has_basement" className="text-sm text-zinc-700">{t('building.basement')}</label>
          </div>
        </div>
      </AccordionSection>

      {/* 2. Gebäudehülle */}
      <AccordionSection idx={1} openSection={openSection} onToggle={toggleSection} icon="🧱" title={t('sections.envelope')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t('envelope.facadeMaterial')}</label>
            <select {...register('facade_material')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="brick">{t('envelope.facadeMaterials.brick')}</option>
              <option value="sand_lime">{t('envelope.facadeMaterials.sand_lime')}</option>
              <option value="concrete">{t('envelope.facadeMaterials.concrete')}</option>
              <option value="wood">{t('envelope.facadeMaterials.wood')}</option>
              <option value="other">{t('envelope.facadeMaterials.other')}</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="facade_insulated" {...register('facade_insulated')} className={checkboxCls} />
            <label htmlFor="facade_insulated" className="text-sm text-zinc-700">{t('envelope.facadeInsulated')}</label>
          </div>
          <div>
            <label className={labelCls}>{t('envelope.facadeInsulationThickness')}</label>
            <input type="number" placeholder="z.B. 12" {...register('facade_insulation_thickness')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t('envelope.roofType')}</label>
            <select {...register('roof_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="flat">{t('envelope.roofTypes.flat')}</option>
              <option value="pitched">{t('envelope.roofTypes.pitched')}</option>
              <option value="hipped">{t('envelope.roofTypes.hipped')}</option>
              <option value="mono_pitched">{t('envelope.roofTypes.mono_pitched')}</option>
              <option value="other">{t('envelope.roofTypes.other')}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="roof_insulated" {...register('roof_insulated')} className={checkboxCls} />
            <label htmlFor="roof_insulated" className="text-sm text-zinc-700">{t('envelope.roofInsulated')}</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="basement_ceiling_insulated" {...register('basement_ceiling_insulated')} className={checkboxCls} />
            <label htmlFor="basement_ceiling_insulated" className="text-sm text-zinc-700">{t('envelope.basementCeilingInsulated')}</label>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SectionPhotoUpload projectId={projectId} userId={userId} category="facade" categoryLabel="Fassade" initialPhotos={photosByCategory['facade']} />
          <SectionPhotoUpload projectId={projectId} userId={userId} category="roof" categoryLabel="Dach" initialPhotos={photosByCategory['roof']} />
          <SectionPhotoUpload projectId={projectId} userId={userId} category="basement" categoryLabel="Keller" initialPhotos={photosByCategory['basement']} />
        </div>
      </AccordionSection>

      {/* 3. Heizung */}
      <AccordionSection idx={2} openSection={openSection} onToggle={toggleSection} icon="🔥" title={t('sections.heating')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t('heating.type')}</label>
            <select {...register('heating_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="gas_boiler">{t('heating.types.gas_boiler')}</option>
              <option value="oil_boiler">{t('heating.types.oil_boiler')}</option>
              <option value="heat_pump">{t('heating.types.heat_pump')}</option>
              <option value="district">{t('heating.types.district')}</option>
              <option value="pellet">{t('heating.types.pellet')}</option>
              <option value="other">{t('heating.types.other')}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('heating.yearInstalled')}</label>
            <input type="number" placeholder="z.B. 2005" {...register('heating_year')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t('heating.fuelType')}</label>
            <select {...register('heating_fuel')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="gas">{t('heating.fuelTypes.gas')}</option>
              <option value="oil">{t('heating.fuelTypes.oil')}</option>
              <option value="electricity">{t('heating.fuelTypes.electricity')}</option>
              <option value="district">{t('heating.fuelTypes.district')}</option>
              <option value="wood">{t('heating.fuelTypes.wood')}</option>
              <option value="other">{t('heating.fuelTypes.other')}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('heating.hotWater')}</label>
            <select {...register('hot_water_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="central">{t('heating.hotWaterTypes.central')}</option>
              <option value="flow_heater">{t('heating.hotWaterTypes.flow_heater')}</option>
              <option value="boiler">{t('heating.hotWaterTypes.boiler')}</option>
              <option value="solar">{t('heating.hotWaterTypes.solar')}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="has_solar_thermal" {...register('has_solar_thermal')} className={checkboxCls} />
            <label htmlFor="has_solar_thermal" className="text-sm text-zinc-700">{t('heating.solarThermal')}</label>
          </div>
        </div>
        <div className="mt-4">
          <SectionPhotoUpload projectId={projectId} userId={userId} category="heating" categoryLabel="Heizung" initialPhotos={photosByCategory['heating']} />
        </div>
      </AccordionSection>

      {/* 4. Fenster */}
      <AccordionSection idx={3} openSection={openSection} onToggle={toggleSection} icon="🪟" title={t('sections.windows')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t('windows.type')}</label>
            <select {...register('window_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="single">{t('windows.types.single')}</option>
              <option value="double">{t('windows.types.double')}</option>
              <option value="triple">{t('windows.types.triple')}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('windows.frameMaterial')}</label>
            <select {...register('window_frame_material')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="pvc">{t('windows.frameMaterials.pvc')}</option>
              <option value="wood">{t('windows.frameMaterials.wood')}</option>
              <option value="aluminium">{t('windows.frameMaterials.aluminium')}</option>
              <option value="wood_aluminium">{t('windows.frameMaterials.wood_aluminium')}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('windows.gValue')}</label>
            <input type="number" step="0.01" placeholder="z.B. 0.60" {...register('window_g_value')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t('windows.uValue')}</label>
            <input type="number" step="0.01" placeholder="z.B. 1.10" {...register('window_u_value')} className={inputCls} />
          </div>
        </div>
        <div className="mt-4">
          <SectionPhotoUpload projectId={projectId} userId={userId} category="windows" categoryLabel="Fenster" initialPhotos={photosByCategory['windows']} />
        </div>
      </AccordionSection>

      {/* 5. Lüftung */}
      <AccordionSection idx={4} openSection={openSection} onToggle={toggleSection} icon="💨" title={t('sections.ventilation')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t('ventilation.type')}</label>
            <select {...register('ventilation_type')} className={selectCls}>
              <option value="">{t('pleaseSelect')}</option>
              <option value="natural">{t('ventilation.types.natural')}</option>
              <option value="mechanical_supply">{t('ventilation.types.mechanical_supply')}</option>
              <option value="mechanical_exhaust">{t('ventilation.types.mechanical_exhaust')}</option>
              <option value="balanced">{t('ventilation.types.balanced')}</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="has_heat_recovery" {...register('has_heat_recovery')} className={checkboxCls} />
            <label htmlFor="has_heat_recovery" className="text-sm text-zinc-700">{t('ventilation.heatRecovery')}</label>
          </div>
        </div>
        <div className="mt-4">
          <SectionPhotoUpload projectId={projectId} userId={userId} category="other" categoryLabel="Lüftung" initialPhotos={photosByCategory['other']} />
        </div>
      </AccordionSection>

      {/* 6. Notizen */}
      <AccordionSection idx={5} openSection={openSection} onToggle={toggleSection} icon="📝" title={t('sections.notes')}>
        <textarea
          rows={4}
          {...register('notes')}
          placeholder={t('notes')}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </AccordionSection>

      {/* Error message */}
      {saveState === 'error' && (
        <p className="text-sm text-red-600">Fehler beim Speichern. Bitte erneut versuchen.</p>
      )}

      {/* Desktop save button */}
      <button
        type="submit"
        disabled={saveState === 'saving'}
        className="hidden rounded-lg bg-orange-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50 sm:block"
      >
        {saveState === 'saving' ? t('saving') : t('save')}
      </button>

      {/* Sticky mobile save button */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-zinc-200 bg-white p-3 sm:hidden">
        <button
          type="submit"
          disabled={saveState === 'saving'}
          className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {saveState === 'saving' ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  );
}
