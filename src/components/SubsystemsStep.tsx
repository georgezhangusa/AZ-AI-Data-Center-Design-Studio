import React from 'react';
import {
  BessType,
  BtmPowerType,
  CoolingLoopType,
  DataCenterConfig,
  EngineeringCalculation,
  EnvelopeType,
  RedundancyType,
  RejectionPlantType,
  ServerPowerArch,
  SubstationType,
  TransformerType
} from '../types/datacenter';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Building,
  CheckCircle,
  Clock,
  Cpu,
  Flame,
  Layers,
  ShieldCheck,
  Snowflake,
  Wrench,
  Zap
} from 'lucide-react';

interface SubsystemsStepProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onChangeConfig: (updates: Partial<DataCenterConfig>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const SubsystemsStep: React.FC<SubsystemsStepProps> = ({
  config,
  calc,
  onChangeConfig,
  onPrev,
  onNext
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Context */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Step 2: Component Engineering & Physics Rule Validation
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Configure power, thermal management, energy storage, and structural envelope. The integrated physics engine continuously checks thermodynamic and electrical validity.
        </p>
      </div>

      {/* ACTIVE PHYSICS CONSTRAINT ALERTS BANNER */}
      {calc.alerts.length > 0 && (
        <div className="space-y-3">
          {calc.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition shadow-xs ${
                alert.level === 'critical'
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : alert.level === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-blue-200 bg-blue-50 text-blue-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.level === 'critical'
                      ? 'text-red-600'
                      : alert.level === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">{alert.title}</h4>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">{alert.message}</p>
                </div>
              </div>

              <button
                onClick={() => onChangeConfig(alert.autoFix())}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  alert.level === 'critical'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : alert.level === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                {alert.remedyActionTitle}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subsystem Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DOMAIN 1: POWER & GRID INFRASTRUCTURE */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Zap className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Electrical Yard & Power Distribution
            </h3>
          </div>

          {/* Substation Type */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              High-Voltage Substation Yard Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ substationType: 'gis' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.substationType === 'gis'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">GIS (Gas-Insulated)</div>
                <div className="text-[10px] text-slate-500">70% smaller yard footprint</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ substationType: 'ais' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.substationType === 'ais'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">AIS (Air-Insulated)</div>
                <div className="text-[10px] text-slate-500">Traditional outdoor open yard</div>
              </button>
            </div>
          </div>

          {/* Transformer Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Medium-Voltage Transformation Layer
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {config.transformerType === 'sst' ? 'Lead Time: 44 Wks' : 'Lead Time: 124 Wks'}
              </span>
            </div>
            <select
              value={config.transformerType}
              onChange={(e) => onChangeConfig({ transformerType: e.target.value as TransformerType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="sst">Solid-State Transformer (SST) — Modular Skids, High Efficiency (44 Wks)</option>
              <option value="conventional">Conventional Oil-Filled Large Power Transformer (LPT) (124 Wks)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              SST offers solid-state fast voltage regulation and direct MV to DC/LV conversion.
            </span>
          </div>

          {/* Server Power Architecture */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              White Space Voltage Distribution
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ serverPower: '800vdc' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.serverPower === '800vdc'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">800V DC Central Busway</div>
                <div className="text-[10px] text-slate-500">98.4% efficiency, 38% less copper</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ serverPower: '480vac' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.serverPower === '480vac'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">480V AC Distribution</div>
                <div className="text-[10px] text-slate-500">Conventional 3-phase PDU/RPP</div>
              </button>
            </div>
          </div>

          {/* Behind-The-Meter Generation */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              Behind-The-Meter (BTM) Fast-Track Generation
            </label>
            <select
              value={config.btmPower}
              onChange={(e) => onChangeConfig({ btmPower: e.target.value as BtmPowerType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="grid_only">Utility Interconnect Only (Subject to Grid Queues)</option>
              <option value="aero_turbine">Aeroderivative Gas Turbines (Baker Hughes / GE LM2500 Fast-Track)</option>
              <option value="gas_recip">Natural Gas Reciprocating Engines (Wärtsilä / CAT High-Efficiency)</option>
              <option value="fuel_cell">Solid Oxide Fuel Cell Microgrid Arrays (Zero NOx/SOx)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              BTM generation bypasses utility transmission interconnect queues, pulling COD forward by 18-36 months.
            </span>
          </div>

          {/* Energy Storage BESS */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              Backup Energy Storage & Ride-Through
            </label>
            <select
              value={config.bessType}
              onChange={(e) => onChangeConfig({ bessType: e.target.value as BessType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="lfp_short">Modular LFP Battery UPS (15-min Critical Load Ride-Through)</option>
              <option value="lfp_long">Long-Duration Utility BESS (2-Hour Peak Shaving & Islanding)</option>
              <option value="flywheel">Kinetic Flywheel Storage (Chemical-Free Fast Dynamic Stabilization)</option>
            </select>
          </div>
        </div>

        {/* DOMAIN 2: THERMAL & STRUCTURAL SYSTEMS */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Snowflake className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Thermal Management & Civil Envelope
            </h3>
          </div>

          {/* Cooling Loop / Heat Extraction */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              Rack Heat Extraction Topology
            </label>
            <select
              value={config.coolingLoop}
              onChange={(e) => onChangeConfig({ coolingLoop: e.target.value as CoolingLoopType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="d2c_l2l">Direct-to-Chip (D2C) Liquid-to-Liquid CDUs (Required for &gt;35 kW/rack)</option>
              <option value="immersion">Single-Phase Immersion Cooling Tanks (100–150+ kW/tank)</option>
              <option value="rdhx">Active Rear-Door Heat Exchangers (RDHx)</option>
              <option value="air_hvac">Traditional Air CRAH / Chilled Water HVAC (Legacy air limit)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {calc.rackDensityKW > 35 && config.coolingLoop === 'air_hvac' ? (
                <span className="text-red-600 font-semibold">
                  Rule Violation: Air cooling cannot support {calc.rackDensityKW} kW/rack density.
                </span>
              ) : (
                'D2C CDUs supply clean water to cold plates directly on GPUs/CPUs.'
              )}
            </span>
          </div>

          {/* Heat Rejection Primary Plant */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              Central Heat Rejection Farm
            </label>
            <select
              value={config.rejectionPlant}
              onChange={(e) => onChangeConfig({ rejectionPlant: e.target.value as RejectionPlantType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="adiabatic_dry">Closed-Loop Adiabatic Dry Coolers (WUE: 0.02 L/kWh — Zero Water Waste)</option>
              <option value="hybrid_tower">Hybrid Evaporative Cooling Towers (WUE: 1.65 L/kWh — High Water)</option>
              <option value="chiller_economizer">Chilled Water Plant with Economizer Bypass Plates</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Adiabatic dry coolers eliminate municipal water risks and Legionella compliance mandates.
            </span>
          </div>

          {/* Mechanical & Electrical Redundancy */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              System Redundancy & Concurrency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ redundancy: 'n_plus_1' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.redundancy === 'n_plus_1'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">N+1 Redundancy</div>
                <div className="text-[10px] text-slate-500">Tier III standard performance</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ redundancy: '2n' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.redundancy === '2n'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">2N Concurrent</div>
                <div className="text-[10px] text-slate-500">Tier IV mission-critical dual paths</div>
              </button>
            </div>
          </div>

          {/* Structural Deployment Envelope */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              Civil / Building Envelope Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ envelopeType: 'stick_built' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.envelopeType === 'stick_built'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">Hardened Concrete Shell</div>
                <div className="text-[10px] text-slate-500">6,000 lbs/sq ft structural slab</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ envelopeType: 'modular_skid' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.envelopeType === 'modular_skid'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">Modular Prefab Skids</div>
                <div className="text-[10px] text-slate-500">Accelerates delivery by 9 months</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-2 cursor-pointer border border-slate-300 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 1</span>
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Generate Deliverables & ROI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
