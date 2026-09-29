import React, { useState } from 'react';
import {
  BusinessPersona,
  DataCenterConfig,
  EngineeringCalculation
} from '../types/datacenter';
import { calculatePersonaROI } from '../utils/engineeringEngine';
import { CampusVisualizer } from './CampusVisualizer';
import { MechanicalPID } from './MechanicalPID';
import { SingleLineDiagram } from './SingleLineDiagram';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  FileSpreadsheet,
  Globe2,
  Layers,
  Leaf,
  Network,
  PieChart,
  Send,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface DeliverablesStepProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onOpenPushEpc: () => void;
  onPrint: () => void;
  onOpenExport?: () => void;
  onOpenCompare?: () => void;
}

type TabKey = 'aerial' | 'sld' | 'pid' | 'roi' | 'bom' | 'esg';

export const DeliverablesStep: React.FC<DeliverablesStepProps> = ({
  config,
  calc,
  onOpenPushEpc,
  onPrint,
  onOpenExport,
  onOpenCompare
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('aerial');
  const [persona, setPersona] = useState<BusinessPersona>('neocloud');

  const roiData = calculatePersonaROI(persona, config, calc);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Step 3: Executive Pitch Deck & FEED Engineering Pack
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Dual-track deliverables: 3D architectural representations and persona-specific ROI alongside formal electrical and mechanical FEED schematics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Presets</span>
            </button>
          )}
          <button
            onClick={onOpenExport || onPrint}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Pitch Pack</span>
          </button>
          <button
            onClick={onOpenPushEpc}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit to CRM & EPC</span>
          </button>
        </div>
      </div>

      {/* Deliverables Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('aerial')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'aerial'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          3D Aerial Campus Plan
        </button>
        <button
          onClick={() => setActiveTab('sld')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'sld'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Electrical Single-Line (SLD)
        </button>
        <button
          onClick={() => setActiveTab('pid')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'pid'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          Mechanical P&ID
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'roi'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          Financial ROI & TCO
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'bom'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Itemized Bill of Materials (BOM)
        </button>
        <button
          onClick={() => setActiveTab('esg')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'esg'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          ESG & Sustainability
        </button>
      </div>

      {/* TAB CONTENT 1: AERIAL & CAMPUS VISUALIZATION */}
      {activeTab === 'aerial' && (
        <div className="space-y-4">
          <CampusVisualizer config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 2: ELECTRICAL SLD */}
      {activeTab === 'sld' && (
        <div className="space-y-4">
          <SingleLineDiagram config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 3: MECHANICAL P&ID */}
      {activeTab === 'pid' && (
        <div className="space-y-4">
          <MechanicalPID config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 4: ROI & BUSINESS ARCHETYPES */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          {/* Persona Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Stakeholder Business Archetype</h4>
              <p className="text-xs text-slate-500">Select business model to contextualize return on capital and cash flows.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setPersona('neocloud')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'neocloud' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GPUaaS / Neocloud
              </button>
              <button
                onClick={() => setPersona('colo')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'colo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Wholesale Colocation
              </button>
              <button
                onClick={() => setPersona('enterprise')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'enterprise' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Enterprise Private Cloud
              </button>
            </div>
          </div>

          {/* Persona Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.primaryStatLabel}</span>
              <span className="text-2xl font-black text-emerald-600 font-mono tracking-tight">{roiData.primaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">Calculated annual cash generation</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.secondaryStatLabel}</span>
              <span className="text-2xl font-black text-blue-600 font-mono tracking-tight">{roiData.secondaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">Net operating margin post power OpEx</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.tertiaryStatLabel}</span>
              <span className="text-2xl font-black text-indigo-600 font-mono tracking-tight">{roiData.tertiaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">Unlevered capital amortization</span>
            </div>
          </div>

          {/* Financial Breakdown Table & Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Financial Schedule Parameters</h4>
              <div className="divide-y divide-slate-200 text-xs">
                {roiData.breakdown.map((row, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-600">{row.label}</span>
                    <span className="font-mono font-bold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Executive Investment Thesis</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{roiData.narrative}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Bankable EPC Underwriting Standard
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Includes full balance-of-plant (BOP), utility interconnection fees, commissioning contingency, and Tier III/IV compliance guarantees.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ITEMIZED BILL OF MATERIALS (BOM) */}
      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Preliminary Front-End Engineering Design (FEED) Bill of Materials
              </h4>
              <p className="text-xs text-slate-500">
                Priced equipment schedule and civil construction budget for {calc.facilityTotalLoadMW} MW facility.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
              Total CapEx: ${calc.totalCapExM}M
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Subsystem Domain</th>
                  <th className="py-3 px-4">Specification & Manufacturer Baseline</th>
                  <th className="py-3 px-4">Procurement Lead Time</th>
                  <th className="py-3 px-4 text-right">Cost ($M)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">High-Voltage Substation</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.substationType.toUpperCase()} Substation, 115kV/34.5kV, {config.dualUtilityFeed ? 'Dual Utility Feeds' : 'Single Feed'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">50–64 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.substationCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Transformation Layer</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.transformerType === 'sst' ? 'Modular Solid-State Transformers (SST)' : 'Oil-Filled MV Transformers (LPT)'} ({config.redundancy.toUpperCase()})
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {config.transformerType === 'sst' ? '44 Weeks' : '124 Weeks (Bottleneck)'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.transformersCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">BTM Generation</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.btmPower === 'aero_turbine' ? 'Aeroderivative Dual-Fuel Gas Turbines (Fast-Track)' : config.btmPower === 'gas_recip' ? 'Reciprocating Natural Gas Gensets' : config.btmPower === 'fuel_cell' ? 'Solid Oxide Fuel Cells' : 'Utility Grid Only'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">20–72 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.btmGenCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">UPS & Energy Storage</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.bessType === 'lfp_long' ? '2-Hour Utility BESS (Peak Shaving & Islanding)' : config.bessType === 'flywheel' ? 'Kinetic Flywheel Storage' : '15-min Modular LFP Battery UPS'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">32–40 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.bessCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Cooling & CDUs</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    Liquid CDUs, Secondary Fluid Network, {config.rejectionPlant.toUpperCase()} Heat Rejection
                  </td>
                  <td className="py-3 px-4 text-slate-600">36 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.coolingPlantCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Power Distribution</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.serverPower === '800vdc' ? '800V DC Central Busway & End-of-Row Rectifiers' : '480V AC Distribution, PDUs & RPPs'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">28 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.powerDistributionCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Civil & Structural Shell</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.envelopeType === 'modular_skid' ? 'Pre-Engineered Offsite Modular Skids' : 'Hardened Concrete Shell (6,000 lbs/sq ft)'} ({calc.totalFootprintSqFt.toLocaleString()} sq ft)
                  </td>
                  <td className="py-3 px-4 text-slate-600">32–68 Weeks</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.civilStructuralCapExM}M</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">EPC Engineering & Commissioning</td>
                  <td className="py-3 px-4 font-sans text-slate-600">FEED studies, permitting, Level 1-5 commissioning, project insurance</td>
                  <td className="py-3 px-4 text-slate-600">Continuous</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.epcManagementCapExM}M</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 border-t border-slate-200 font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-slate-900">TOTAL ESTIMATED CAPEX:</td>
                  <td className="py-3 px-4 text-right text-blue-700 font-mono text-sm">${calc.totalCapExM}M</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: ESG & SUSTAINABILITY SCORECARD */}
      {activeTab === 'esg' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">PUE (Design)</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">{calc.pue.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Tier-1 Efficiency</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">WUE (Water Usage)</span>
              <span className="text-2xl font-black text-blue-600 font-mono">{calc.wue} L/kWh</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {config.rejectionPlant === 'adiabatic_dry' ? 'Zero Water Waste' : 'Evaporative Consumption'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">CUE (Carbon Intensity)</span>
              <span className="text-2xl font-black text-amber-600 font-mono">{calc.cue} kg/kWh</span>
              <span className="text-[10px] text-slate-500 block mt-1">Scope 2 Grid Footprint</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Heat Reuse Potential</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">46°C / 115°F</span>
              <span className="text-[10px] text-slate-500 block mt-1">District Heat Ready</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Environmental & Permitting Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900">Acoustic & Noise Mitigation</span>
                <p className="text-slate-600">
                  VFD fan arrays on adiabatic dry coolers engineered to maintain &lt;55 dBA sound pressure at the property line boundary.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900">Air Permitting & NOx Compliance</span>
                <p className="text-slate-600">
                  {config.btmPower === 'aero_turbine' ? 'Selective Catalytic Reduction (SCR) package achieves <2.5 ppm NOx compliance.' : config.btmPower === 'fuel_cell' ? 'Solid oxide fuel cells emit zero combustion particulate matter.' : 'Zero localized Scope 1 combustion emissions on utility grid feed.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
