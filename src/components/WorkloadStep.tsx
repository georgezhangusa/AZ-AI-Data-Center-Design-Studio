import React, { useEffect, useRef, useState } from 'react';
import { ACCELERATOR_SPECS, REGIONAL_DATA } from '../data/constants';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import { AcceleratorType, DataCenterConfig, DeploymentRegion, EngineeringCalculation, IngressMode } from '../types/datacenter';
import { ArrowRight, Check, Cpu, Globe, MapPin, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface WorkloadStepProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onChangeConfig: (updates: Partial<DataCenterConfig>) => void;
  onApplyPreset: (presetId: string) => void;
  onNext: () => void;
}

export const WorkloadStep: React.FC<WorkloadStepProps> = ({
  config,
  calc,
  onChangeConfig,
  onApplyPreset,
  onNext
}) => {
  const { t, lang } = useLanguage();
  const currentAccelerator = ACCELERATOR_SPECS[config.gpuType];
  const currentRegion = REGIONAL_DATA[config.region];

  const [displayGpuCount, setDisplayGpuCount] = useState<string>(config.gpuCount.toLocaleString());
  const [isGpuFocused, setIsGpuFocused] = useState<boolean>(false);
  const gpuInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isGpuFocused) {
      setDisplayGpuCount(config.gpuCount.toLocaleString());
    }
  }, [config.gpuCount, isGpuFocused]);

  const handleGpuInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    const digitsOnly = rawVal.replace(/[^0-9]/g, '');

    if (digitsOnly === '') {
      setDisplayGpuCount('');
      return;
    }

    const num = parseInt(digitsOnly, 10);
    const formatted = num.toLocaleString();

    // Track how many digits were before cursor to preserve position nicely
    const digitsBeforeCursor = rawVal.slice(0, cursorPosition).replace(/[^0-9]/g, '').length;

    setDisplayGpuCount(formatted);
    const clamped = Math.min(8192000, Math.max(2000, num));
    onChangeConfig({ gpuCount: clamped });

    requestAnimationFrame(() => {
      if (gpuInputRef.current) {
        let counted = 0;
        let newPos = formatted.length;
        for (let i = 0; i < formatted.length; i++) {
          if (counted === digitsBeforeCursor) {
            newPos = i;
            break;
          }
          if (formatted[i] !== ',') {
            counted++;
          }
          if (counted === digitsBeforeCursor) {
            newPos = i + 1;
            break;
          }
        }
        gpuInputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handleGpuInputBlur = () => {
    setIsGpuFocused(false);
    const digitsOnly = displayGpuCount.replace(/[^0-9]/g, '');
    const num = parseInt(digitsOnly, 10);
    const valid = isNaN(num) ? 2000 : Math.min(8192000, Math.max(2000, num));
    onChangeConfig({ gpuCount: valid });
    setDisplayGpuCount(valid.toLocaleString());
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editorial Title & Context */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {t.workload.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.workload.subtitle}
        </p>
      </div>

      {/* Preset Reference Architectures Quick Select */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t.workload.presetsTitle}
            </span>
          </div>
          <span className="text-xs text-slate-500">{t.workload.presetsSubtitle}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          {ARCHITECTURE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className="p-3 text-left rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-500/60 hover:bg-blue-50/40 transition group cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {preset.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {preset.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ingress Track Toggle (Interactive Segmented Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <button
          onClick={() => onChangeConfig({ ingressMode: 'top-down' })}
          className={`relative p-5 rounded-2xl text-left transition-all duration-100 cursor-pointer select-none group ${
            config.ingressMode === 'top-down'
              ? 'border-2 border-blue-400 border-b-[7px] border-b-blue-700 bg-gradient-to-b from-blue-50/90 via-sky-50/60 to-blue-100/90 shadow-[0_8px_20px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-b-[8px] hover:-translate-y-[1px] active:translate-y-[6px] active:border-b-[2px] active:shadow-[0_2px_4px_rgba(37,99,235,0.2)]'
              : 'border-2 border-slate-300 border-b-[7px] border-b-slate-400 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_16px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-slate-400 hover:border-b-slate-500 hover:border-b-[8px] hover:-translate-y-[1px] active:translate-y-[6px] active:border-b-[2px] active:shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* 3D Specular Highlight Line */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 rounded-full" />

          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-b-[3px] transition-transform duration-100 group-hover:scale-105 ${
                  config.ingressMode === 'top-down'
                    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-400 border-b-blue-800 shadow-[0_2px_6px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 border-slate-200 border-b-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]'
                }`}
              >
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block tracking-tight">
                  {t.workload.trackA_title}
                </span>
                <span className="text-[11px] font-medium text-blue-600 block">
                  {t.workload.trackA_tag}
                </span>
              </div>
            </div>

            {/* 3D Status Pill */}
            {config.ingressMode === 'top-down' ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 bg-gradient-to-b from-blue-500 to-blue-600 text-white border border-blue-400 border-b-[2px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>{t.common.active}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 border-b-[2px] border-b-slate-300/80 shadow-xs shrink-0">
                <span>{t.common.select}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {t.workload.trackA_desc}
          </p>
        </button>

        <button
          onClick={() => onChangeConfig({ ingressMode: 'bottom-up' })}
          className={`relative p-5 rounded-2xl text-left transition-all duration-100 cursor-pointer select-none group ${
            config.ingressMode === 'bottom-up'
              ? 'border-2 border-amber-400 border-b-[7px] border-b-amber-700 bg-gradient-to-b from-amber-50/90 via-orange-50/60 to-amber-100/90 shadow-[0_8px_20px_rgba(217,119,6,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-b-[8px] hover:-translate-y-[1px] active:translate-y-[6px] active:border-b-[2px] active:shadow-[0_2px_4px_rgba(217,119,6,0.2)]'
              : 'border-2 border-slate-300 border-b-[7px] border-b-slate-400 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_8px_16px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-slate-400 hover:border-b-slate-500 hover:border-b-[8px] hover:-translate-y-[1px] active:translate-y-[6px] active:border-b-[2px] active:shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* 3D Specular Highlight Line */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 rounded-full" />

          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-b-[3px] transition-transform duration-100 group-hover:scale-105 ${
                  config.ingressMode === 'bottom-up'
                    ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-400 border-b-amber-800 shadow-[0_2px_6px_rgba(217,119,6,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 border-slate-200 border-b-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block tracking-tight">
                  {t.workload.trackB_title}
                </span>
                <span className="text-[11px] font-medium text-amber-600 block">
                  {t.workload.trackB_tag}
                </span>
              </div>
            </div>

            {/* 3D Status Pill */}
            {config.ingressMode === 'bottom-up' ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 bg-gradient-to-b from-amber-500 to-amber-600 text-white border border-amber-400 border-b-[2px] border-b-amber-800 shadow-[0_2px_5px_rgba(217,119,6,0.3)] shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>{t.common.active}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 border-b-[2px] border-b-slate-300/80 shadow-xs shrink-0">
                <span>{t.common.select}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {t.workload.trackB_desc}
          </p>
        </button>
      </div>

      {/* Input Parameters Configuration Container */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
        {config.ingressMode === 'top-down' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accelerator Choice */}
              <div>
                <label className="text-xs font-semibold text-slate-800 mb-2 block">
                  {t.workload.siliconTitle}
                </label>
                <div className="space-y-2">
                  {(Object.keys(ACCELERATOR_SPECS) as AcceleratorType[]).map((typeKey) => {
                    const item = ACCELERATOR_SPECS[typeKey];
                    const isSelected = config.gpuType === typeKey;
                    return (
                      <div
                        key={typeKey}
                        onClick={() => onChangeConfig({ gpuType: typeKey, targetRackDensityKW: item.kwPerRack })}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/80 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">{item.name}</span>
                          <span className="font-mono text-blue-700 font-semibold">{item.kwPerRack} kW / {lang === 'zh' ? '机柜' : lang === 'fr' ? 'baie' : 'rack'}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {item.description}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{item.gpusPerRack} {lang === 'zh' ? '卡/柜' : lang === 'fr' ? 'GPU/baie' : 'GPUs/rack'}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.voltageTier}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.requiresLiquid ? (lang === 'zh' ? '直接芯片液冷 (DLC)' : lang === 'fr' ? 'Refroidissement Liquide Direct' : 'Direct Liquid Cooling') : (lang === 'zh' ? '高风量风冷 / 混冷' : lang === 'fr' ? 'Air Débit Élevé / Hybride' : 'High Flow Air / Hybrid')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cluster Scale & Sizing Slider */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-800">
                      {t.workload.clusterScaleTitle}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        ref={gpuInputRef}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        value={isGpuFocused ? displayGpuCount : config.gpuCount.toLocaleString()}
                        onFocus={() => {
                          setIsGpuFocused(true);
                          setDisplayGpuCount(config.gpuCount.toLocaleString());
                        }}
                        onChange={handleGpuInputChange}
                        onBlur={handleGpuInputBlur}
                        className="w-32 px-2.5 py-1 text-right text-xs font-bold text-slate-900 font-mono bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-xs"
                      />
                      <span className="text-xs font-bold text-slate-700">{t.common.gpus}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={2000}
                    max={8192000}
                    step={2000}
                    value={config.gpuCount}
                    onChange={(e) => onChangeConfig({ gpuCount: parseInt(e.target.value) || 2000 })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 select-none">
                    <span>2K (Min)</span>
                    <span>2M</span>
                    <span>4M</span>
                    <span>6M</span>
                    <span>8M Max</span>
                  </div>

                  {/* Fast Scale Selectors */}
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
                    {[
                      { label: lang === 'zh' ? '1.6万 Pod' : lang === 'fr' ? 'Pod 16K' : '16K Pod', val: 16000 },
                      { label: lang === 'zh' ? '6.4万 集群' : lang === 'fr' ? 'Cluster 64K' : '64K Cluster', val: 64000 },
                      { label: lang === 'zh' ? '25万 超算' : lang === 'fr' ? 'Hyper 250K' : '250K Hyper', val: 250000 },
                      { label: lang === 'zh' ? '100万 吉瓦级' : lang === 'fr' ? '1M Gigascale' : '1M Gigascale', val: 1000000 },
                      { label: lang === 'zh' ? '400万 超级园区' : lang === 'fr' ? 'Méga-Campus 4M' : '4M Mega-Campus', val: 4000000 },
                      { label: lang === 'zh' ? '800万 极限' : lang === 'fr' ? 'Max 8M' : '8M Max', val: 8192000 }
                    ].map((shortcut) => (
                      <button
                        key={shortcut.val}
                        type="button"
                        onClick={() => onChangeConfig({ gpuCount: shortcut.val })}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded-md border transition cursor-pointer whitespace-nowrap ${
                          config.gpuCount === shortcut.val || (shortcut.val === 8192000 && config.gpuCount >= 8000000)
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Sizing Derived Metrics */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                    {t.workload.calculatedEnvelopes}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.workload.activeEnclosures}</span>
                      <span className="font-mono font-bold text-slate-900">{calc.totalRacks.toLocaleString()} {t.common.racks}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.workload.criticalIT}</span>
                      <span className="font-mono font-bold text-blue-700">
                        {calc.criticalITLoadMW >= 1000
                          ? `${(calc.criticalITLoadMW / 1000).toFixed(2)} GW`
                          : `${calc.criticalITLoadMW.toFixed(1)} MW`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.workload.whiteSpaceArea}</span>
                      <span className="font-mono font-bold text-slate-800">{calc.whiteSpaceSqFt.toLocaleString()} {t.common.sqft}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.workload.coolantCirculation}</span>
                      <span className="font-mono font-bold text-emerald-700">{calc.totalCoolantFlowGPM.toLocaleString()} {t.common.gpm}</span>
                    </div>
                  </div>
                </div>

                {/* Region & Climate Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                    {t.workload.regionTitle}
                  </label>
                  <select
                    value={config.region}
                    onChange={(e) => onChangeConfig({ region: e.target.value as DeploymentRegion })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                  >
                    {(Object.keys(REGIONAL_DATA) as DeploymentRegion[]).map((regKey) => {
                      const reg = REGIONAL_DATA[regKey];
                      return (
                        <option key={regKey} value={regKey}>
                          {reg.name} — ${reg.powerTariffPerKWh.toFixed(3)}{t.common.perKWh} ({reg.gridQueueYears} {t.workload.queueYears})
                        </option>
                      );
                    })}
                  </select>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{t.workload.gridPrefix}: {currentRegion.gridName} · {t.workload.summerAmbient}: {currentRegion.ambientDryBulbC}°C {t.workload.dryBulb} / {currentRegion.ambientWetBulbC}°C {t.workload.wetBulb}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Bottom-Up Inputs */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                {t.workload.substationCapTitle}
              </label>
              <input
                type="number"
                min={10}
                max={300}
                step={5}
                value={config.fixedUtilityMW}
                onChange={(e) => onChangeConfig({ fixedUtilityMW: parseFloat(e.target.value) || 10 })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {t.workload.substationCapSub}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                {t.workload.rackDensityTitle}
              </label>
              <input
                type="number"
                min={30}
                max={150}
                step={10}
                value={config.targetRackDensityKW}
                onChange={(e) => onChangeConfig({ targetRackDensityKW: parseFloat(e.target.value) || 40 })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {t.workload.rackDensitySub}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                {t.workload.siteParcelTitle}
              </label>
              <input
                type="number"
                min={5}
                max={200}
                step={5}
                value={config.landAcreage}
                onChange={(e) => onChangeConfig({ landAcreage: parseFloat(e.target.value) || 10 })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {t.workload.siteParcelSub}
              </span>
            </div>
          </div>
        )}

        {/* Step Navigation Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            {lang === 'zh' ? '当前基线规格：' : lang === 'fr' ? 'Configuration Actuelle : ' : 'Current Baseline: '}
            <strong className="text-slate-900 font-mono">
              {calc.criticalITLoadMW >= 1000
                ? `${(calc.criticalITLoadMW / 1000).toFixed(2)} GW IT`
                : `${calc.criticalITLoadMW.toFixed(1)} MW IT`}
            </strong> · <strong className="text-blue-700 font-mono">{calc.totalRacks.toLocaleString()} {t.common.racks}</strong>
          </div>
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-600 border-b-4 border-b-blue-800 shadow-[0_4px_8px_rgba(37,99,235,0.25)] active:translate-y-[3px] active:border-b-2 active:border-b-blue-700 active:shadow-none transition-all duration-75 flex items-center gap-2 cursor-pointer select-none"
          >
            <span>{t.workload.btnNext}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
