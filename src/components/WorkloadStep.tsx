import React from 'react';
import { ACCELERATOR_SPECS, REGIONAL_DATA } from '../data/constants';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import { AcceleratorType, DataCenterConfig, DeploymentRegion, EngineeringCalculation, IngressMode } from '../types/datacenter';
import { ArrowRight, Cpu, Globe, MapPin, Sparkles, Zap } from 'lucide-react';

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
  const currentAccelerator = ACCELERATOR_SPECS[config.gpuType];
  const currentRegion = REGIONAL_DATA[config.region];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editorial Title & Context */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Step 1: Workload Ingress & Preliminary Sizing
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Select your engineering ingress track: top-down AI accelerator workload sizing, or bottom-up utility power constraint envelope.
        </p>
      </div>

      {/* Preset Reference Architectures Quick Select */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Validated Reference Architectures
            </span>
          </div>
          <span className="text-xs text-slate-500">1-Click Fast Configuration</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onChangeConfig({ ingressMode: 'top-down' })}
          className={`p-5 rounded-xl text-left border transition cursor-pointer shadow-xs ${
            config.ingressMode === 'top-down'
              ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              Track A: Top-Down (Compute & Cluster Driven)
            </span>
            <span className="text-xs text-blue-600 font-medium">Recommended for Neoclouds & AI Labs</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Specify AI accelerator silicon (GB200 NVL72, B200, H100) and GPU cluster scale. Engine calculates critical IT megawatts, thermal dissipation, and whitespace dimensions.
          </p>
        </button>

        <button
          onClick={() => onChangeConfig({ ingressMode: 'bottom-up' })}
          className={`p-5 rounded-xl text-left border transition cursor-pointer shadow-xs ${
            config.ingressMode === 'bottom-up'
              ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Track B: Bottom-Up (Site & Utility Grid Driven)
            </span>
            <span className="text-xs text-slate-500 font-medium">Ideal for Developers & Utilities</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Start with available high-voltage substation interconnect megawatt capacity and land parcel acreage to determine achievable AI rack density and GPU capacity.
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
                  AI Accelerator Architecture
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
                          <span className="font-mono text-blue-700 font-semibold">{item.kwPerRack} kW / rack</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {item.description}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{item.gpusPerRack} GPUs/rack</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.voltageTier}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.requiresLiquid ? 'Direct Liquid Cooling' : 'High Flow Air / Hybrid'}</span>
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
                      Target Cluster Scale (Total Accelerators)
                    </label>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {config.gpuCount.toLocaleString()} GPUs
                    </span>
                  </div>

                  <input
                    type="range"
                    min={2000}
                    max={64000}
                    step={1000}
                    value={config.gpuCount}
                    onChange={(e) => onChangeConfig({ gpuCount: parseInt(e.target.value) || 2000 })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>2,000 (Pod)</span>
                    <span>16,000 (Cluster)</span>
                    <span>32,000 (Campus)</span>
                    <span>64,000+ (Supercluster)</span>
                  </div>
                </div>

                {/* Instant Sizing Derived Metrics */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                    Calculated White Space Envelopes
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Active Enclosures</span>
                      <span className="font-mono font-bold text-slate-900">{calc.totalRacks.toLocaleString()} Racks</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Critical IT Demand</span>
                      <span className="font-mono font-bold text-blue-700">{calc.criticalITLoadMW.toFixed(1)} MW</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">White Space Area</span>
                      <span className="font-mono font-bold text-slate-800">{calc.whiteSpaceSqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Coolant Circulation</span>
                      <span className="font-mono font-bold text-emerald-700">{calc.totalCoolantFlowGPM.toLocaleString()} GPM</span>
                    </div>
                  </div>
                </div>

                {/* Region & Climate Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                    Deployment Region & Power Tariff
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
                          {reg.name} — ${reg.powerTariffPerKWh.toFixed(3)}/kWh ({reg.gridQueueYears} yr queue)
                        </option>
                      );
                    })}
                  </select>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>Grid: {currentRegion.gridName} · Summer Ambient: {currentRegion.ambientDryBulbC}°C Dry / {currentRegion.ambientWetBulbC}°C Wet</span>
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
                Substation Interconnect Cap (MW)
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
                Utility-committed MV feeder capacity
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                Target Rack Density (kW)
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
                Average kW per server cabinet
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                Site Parcel Size (Acres)
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
                Available land area for yard & buffers
              </span>
            </div>
          </div>
        )}

        {/* Step Navigation Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            Current Baseline: <strong className="text-slate-900 font-mono">{calc.criticalITLoadMW.toFixed(1)} MW IT</strong> · <strong className="text-blue-700 font-mono">{calc.totalRacks} Racks</strong>
          </div>
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-600 border-b-4 border-b-blue-800 shadow-[0_4px_8px_rgba(37,99,235,0.25)] active:translate-y-[3px] active:border-b-2 active:border-b-blue-700 active:shadow-none transition-all duration-75 flex items-center gap-2 cursor-pointer select-none"
          >
            <span>Proceed to Subsystem Physics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
