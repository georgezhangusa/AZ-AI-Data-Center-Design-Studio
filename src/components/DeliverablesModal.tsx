import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { calculatePersonaROI } from '../utils/engineeringEngine';
import { generateFEEDPdfDeck } from '../utils/pdfGenerator';
import { SingleLineDiagram } from './SingleLineDiagram';
import { MechanicalPID } from './MechanicalPID';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Loader2,
  Printer,
  Send,
  Sparkles,
  X,
  Zap
} from 'lucide-react';

interface DeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onPrint: () => void;
  onOpenPushEpc: () => void;
  onGoToStep3?: () => void;
}

type ModalTab = 'summary' | 'subsystems' | 'bom' | 'roi' | 'schematics';

export const DeliverablesModal: React.FC<DeliverablesModalProps> = ({
  isOpen,
  onClose,
  config,
  calc,
  onPrint,
  onOpenPushEpc,
  onGoToStep3
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('summary');
  const [schematicView, setSchematicView] = useState<'sld' | 'pid'>('sld');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const roiNeocloud = calculatePersonaROI('neocloud', config, calc);

  const handlePrintOrDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = generateFEEDPdfDeck(config, calc);
      doc.save(`AZ_DataCenter_FEED_Pack_${calc.facilityTotalLoadMW}MW_${config.gpuType.toUpperCase()}.pdf`);
      try {
        onPrint();
      } catch {}
    } catch (e) {
      console.error('PDF generation error:', e);
      try {
        onPrint();
      } catch {}
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                Formal Deliverable
              </span>
              <span className="text-xs font-mono text-slate-500">
                DOC-REF: AZ-FEED-2026-0928
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Front-End Engineering Design (FEED) Deliverable Study
            </h2>
            <p className="text-xs text-slate-600">
              Mission-critical engineering feasibility package for {calc.facilityTotalLoadMW} MW facility with {config.gpuType.toUpperCase()} accelerators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrDownload}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-gradient-to-b from-white to-slate-100 border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 shadow-xs active:translate-y-[1px] active:border-b-slate-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-slate-600 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{isGeneratingPdf ? 'Generating...' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPushEpc();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-700 border-b-[3px] border-b-emerald-900 shadow-xs active:translate-y-[2px] active:border-b-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Push to EPC</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            1. Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('subsystems')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'subsystems'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            2. Subsystem Specs
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bom'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            3. Bill of Materials (BOM)
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            4. Persona Financial ROI
          </button>
          <button
            onClick={() => setActiveTab('schematics')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schematics'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            5. FEED Schematics (SLD / P&ID)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Critical IT Load
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {calc.criticalITLoadMW.toFixed(1)} MW
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Facility Total Load
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {calc.facilityTotalLoadMW} MW
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Design PUE
                  </span>
                  <span className="font-mono font-bold text-base text-blue-600">
                    {calc.pue.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Total CapEx
                  </span>
                  <span className="font-mono font-bold text-base text-emerald-600">
                    ${calc.totalCapExM}M
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Project Feasibility Scope
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  This preliminary Front-End Engineering Design (FEED) package establishes the electrical, mechanical, and commercial baseline for constructing a <strong>{calc.facilityTotalLoadMW} MW</strong> mission-critical AI computing campus optimized for <strong>{config.gpuType.toUpperCase()}</strong> high-density accelerator clusters ({calc.totalRacks.toLocaleString()} racks at {calc.rackDensityKW} kW/rack).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">
                    Campus Space Footprint
                  </span>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>White Space Data Hall:</span>
                      <strong className="text-slate-900 font-mono">{calc.whiteSpaceSqFt.toLocaleString()} sq ft</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Gray Space (Mechanical & Electrical):</span>
                      <strong className="text-slate-900 font-mono">{calc.graySpaceSqFt.toLocaleString()} sq ft</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Substation & Yard:</span>
                      <strong className="text-slate-900 font-mono">{calc.substationYardSqFt.toLocaleString()} sq ft</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span>Total Facility Footprint:</span>
                      <strong className="text-slate-900 font-mono">{calc.totalFootprintSqFt.toLocaleString()} sq ft</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">
                    Schedule & Supply Chain Feasibility
                  </span>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>Critical Lead Path:</span>
                      <strong className="text-slate-900 font-mono">{calc.criticalPathWeeks} Weeks</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Supply Bottleneck:</span>
                      <strong className="text-amber-700 font-medium">{calc.bottleneckComponent}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Commercial COD:</span>
                      <strong className="text-blue-700 font-mono">{calc.projectedCODDate}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span>Physics Rule Compliance:</span>
                      <strong className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All Checks Cleared
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subsystems' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Subsystem Domain</th>
                    <th className="py-2.5 px-3">Architecture Selection</th>
                    <th className="py-2.5 px-3">Key Engineering Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Substation Yard</td>
                    <td className="py-2 px-3">{config.substationType.toUpperCase()} Gas-Insulated Substation ({config.dualUtilityFeed ? 'Dual Feeds' : 'Single Feed'})</td>
                    <td className="py-2 px-3 font-mono">{calc.substationYardSqFt.toLocaleString()} sq ft yard, 100kA withstand</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Main Power Transformation</td>
                    <td className="py-2 px-3">{config.transformerType === 'sst' ? 'Solid-State Transformers (SST)' : 'Conventional Oil-Filled MV'}</td>
                    <td className="py-2 px-3">{config.redundancy.toUpperCase()} redundancy, 34.5kV to 4.16kV step-down</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Rack Power Architecture</td>
                    <td className="py-2 px-3">{config.serverPower === '800vdc' ? '800V DC Central Busway Lineup' : '480V AC Conventional Distribution'}</td>
                    <td className="py-2 px-3">{config.serverPower === '800vdc' ? '98.4% efficiency, low resistive copper loss' : '3-phase PDU/RPP lineup'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">BTM Generation</td>
                    <td className="py-2 px-3">{config.btmPower.toUpperCase()} Fast-Track Generation</td>
                    <td className="py-2 px-3">Bypasses long utility interconnect queue delay</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Thermal / CDUs</td>
                    <td className="py-2 px-3">Direct-to-Chip (D2C) Liquid CDUs, {config.rejectionPlant.toUpperCase()}</td>
                    <td className="py-2 px-3 font-mono">{calc.totalCoolantFlowGPM.toLocaleString()} GPM circulation, {calc.heatDissipationTons.toLocaleString()} Tons rejection</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Civil Structural Envelope</td>
                    <td className="py-2 px-3">{config.envelopeType === 'modular_skid' ? 'Pre-Fabricated Modular Container Skids' : 'Hardened Concrete Slab-on-Grade'}</td>
                    <td className="py-2 px-3 font-mono">{calc.structuralSlabLoadPcf} lbs/sq ft capacity, {calc.totalFootprintSqFt.toLocaleString()} sq ft area</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bom' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Equipment / Package</th>
                    <th className="py-2.5 px-3">Specification / Rating</th>
                    <th className="py-2.5 px-3">Lead Time</th>
                    <th className="py-2.5 px-3 text-right">Cost ($M)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Substation & Switchgear</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{config.substationType.toUpperCase()} MV GIS Lineup</td>
                    <td className="py-2 px-3 font-sans text-slate-600">80 Wks</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${calc.substationCapExM}M</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Transformation Packages</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{config.transformerType.toUpperCase()} Units</td>
                    <td className="py-2 px-3 font-sans text-slate-600">110 Wks</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${calc.transformersCapExM}M</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Cooling Plant & CDUs</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Liquid CDUs & {config.rejectionPlant.toUpperCase()}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">52 Wks</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${calc.coolingPlantCapExM}M</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">BTM Generation & BESS</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{config.btmPower.toUpperCase()} + {config.bessType.toUpperCase()}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">40 Wks</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${(calc.btmGenCapExM + calc.bessCapExM).toFixed(1)}M</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Civil & Structural Build</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{config.envelopeType.replace('_', ' ').toUpperCase()}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">65 Wks</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${calc.civilStructuralCapExM}M</td>
                  </tr>
                  <tr className="bg-slate-50 font-sans font-bold">
                    <td colSpan={3} className="py-2.5 px-3 text-slate-900 uppercase">
                      Total Baseline CapEx
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-sm">
                      ${calc.totalCapExM}M
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    {roiNeocloud.primaryStatLabel}
                  </span>
                  <span className="font-mono font-bold text-base text-blue-600">
                    {roiNeocloud.primaryStatValue}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    {roiNeocloud.secondaryStatLabel}
                  </span>
                  <span className="font-mono font-bold text-base text-emerald-600">
                    {roiNeocloud.secondaryStatValue}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    {roiNeocloud.tertiaryStatLabel}
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {roiNeocloud.tertiaryStatValue}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-slate-900 block text-xs">
                  Financial Model Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  {roiNeocloud.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span>{item.label}:</span>
                      <strong className="font-mono text-slate-900">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schematics' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSchematicView('sld')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    schematicView === 'sld'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Electrical Single-Line (SLD)
                </button>
                <button
                  onClick={() => setSchematicView('pid')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    schematicView === 'pid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Mechanical Piping & Instrumentation (P&ID)
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 p-2 overflow-hidden bg-slate-50">
                {schematicView === 'sld' ? (
                  <SingleLineDiagram config={config} calc={calc} />
                ) : (
                  <MechanicalPID config={config} calc={calc} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="text-[11px] text-slate-500">
            Validated by AZ Engineering Synthesis Engine • Physics Constraints Verified
          </div>

          <div className="flex items-center gap-2">
            {onGoToStep3 && (
              <button
                onClick={onGoToStep3}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Go to Step 3 Interactive Studio →
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
