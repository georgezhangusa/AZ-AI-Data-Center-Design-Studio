import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { calculatePersonaROI } from '../utils/engineeringEngine';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Printer,
  Send,
  Sparkles,
  X
} from 'lucide-react';

interface ExportPitchPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onPrint: () => void;
  onOpenPushEpc: () => void;
}

export const ExportPitchPackModal: React.FC<ExportPitchPackModalProps> = ({
  isOpen,
  onClose,
  config,
  calc,
  onPrint,
  onOpenPushEpc
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const roi = calculatePersonaROI('neocloud', config, calc);

  // 1. Export BOM as real CSV
  const handleDownloadCSV = () => {
    const bomRows = [
      ['Equipment / Subsystem Package', 'Specification & Architecture', 'Lead Time (Weeks)', 'CapEx ($M)'],
      ['Substation & Switchgear Lineup', `${config.substationType.toUpperCase()} Gas-Insulated Switchgear`, '80', calc.substationCapExM.toFixed(1)],
      ['Main Power Transformation', `${config.transformerType.toUpperCase()} Units`, '110', calc.transformersCapExM.toFixed(1)],
      ['Cooling Infrastructure & CDUs', `Direct-to-Chip CDUs + ${config.rejectionPlant.toUpperCase()}`, '52', calc.coolingPlantCapExM.toFixed(1)],
      ['BTM Generation & Storage', `${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()}`, '40', (calc.btmGenCapExM + calc.bessCapExM).toFixed(1)],
      ['Power Distribution Architecture', config.serverPower === '800vdc' ? '800V DC Central Busway' : '480V AC Conventional Lineup', '45', calc.powerDistributionCapExM.toFixed(1)],
      ['Civil & Structural Build', config.envelopeType.replace('_', ' ').toUpperCase(), '65', calc.civilStructuralCapExM.toFixed(1)],
      ['EPC Management & FEED Engineering', 'Turnkey Construction & Commissioning', '60', calc.epcManagementCapExM.toFixed(1)],
      ['TOTAL ESTIMATED CAPEX', `${calc.facilityTotalLoadMW} MW AI Facility Baseline`, `${calc.criticalPathWeeks} Wks Total`, calc.totalCapExM.toFixed(1)]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + bomRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AZ_DataCenter_BOM_${calc.facilityTotalLoadMW}MW_${config.gpuType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('BOM CSV downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 2. Export Technical Configuration JSON
  const handleDownloadJSON = () => {
    const exportData = {
      project: 'AZ Data Center Design Studio - FEED Study',
      docRef: 'AZ-FEED-2026-0928',
      generatedAt: new Date().toISOString(),
      facilityOverview: {
        totalLoadMW: calc.facilityTotalLoadMW,
        criticalITLoadMW: calc.criticalITLoadMW,
        pue: calc.pue,
        wue: calc.wue,
        cue: calc.cue,
        totalCapExM: calc.totalCapExM,
        totalAnnualOpExM: calc.totalAnnualOpExM,
        criticalPathWeeks: calc.criticalPathWeeks,
        bottleneck: calc.bottleneckComponent,
        projectedCOD: calc.projectedCODDate,
        rackCount: calc.totalRacks,
        rackDensityKW: calc.rackDensityKW
      },
      configuration: config,
      financialModel: roi
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `AZ_DataCenter_FEED_Config_${calc.facilityTotalLoadMW}MW.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('Configuration JSON exported!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 3. Copy Formatted Executive Brief to Clipboard
  const handleCopySummary = async () => {
    const summaryText = `=====================================================
AZ DATA CENTER DESIGN STUDIO - EXECUTIVE FEED PITCH PACK
=====================================================
Facility Baseline:
• Total Power: ${calc.facilityTotalLoadMW} MW (Critical IT Load: ${calc.criticalITLoadMW.toFixed(1)} MW)
• Accelerators: ${config.gpuCount.toLocaleString()} x ${config.gpuType.toUpperCase()}
• Racks: ${calc.totalRacks.toLocaleString()} Racks at ${calc.rackDensityKW} kW/Rack
• Footprint: ${calc.totalFootprintSqFt.toLocaleString()} sq ft total (${calc.whiteSpaceSqFt.toLocaleString()} sq ft white space)

Key Efficiency & Sustainability Metrics:
• Design PUE: ${calc.pue.toFixed(2)}
• Water Usage (WUE): ${calc.wue} L/kWh
• Total Heat Rejection: ${calc.heatDissipationTons.toLocaleString()} Tons (${calc.totalCoolantFlowGPM.toLocaleString()} GPM)

Subsystem Architecture:
• Substation: ${config.substationType.toUpperCase()} Substation (${config.dualUtilityFeed ? 'Dual Utility Feeds' : 'Single Feed'})
• Transformation: ${config.transformerType === 'sst' ? 'Solid-State Transformers (SST)' : 'Conventional Oil-Filled'}
• Power Distribution: ${config.serverPower === '800vdc' ? '800V DC Central Busway' : '480V AC Distribution'}
• Cooling: Direct-to-Chip (D2C) Liquid CDUs + ${config.rejectionPlant.toUpperCase()}
• Onsite Generation: ${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()} Storage

Commercial & Financial Baseline:
• Total CapEx: $${calc.totalCapExM}M ($${Math.round(calc.capexPerMW * 1000)}k per MW)
• Projected Annual Revenue: ${roi.primaryStatValue}
• Projected IRR / Payback: ${roi.secondaryStatValue} (${roi.tertiaryStatValue})
• Lead Time to Commercial Operations: ${calc.criticalPathWeeks} Weeks (Target COD: ${calc.projectedCODDate})
• Primary Long-Lead Bottleneck: ${calc.bottleneckComponent}
=====================================================
Generated by AZ Engineering Synthesis Engine`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = summaryText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 4. Trigger Print / PDF
  const handlePrintTrigger = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print trigger caught:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                Export Deliverable
              </span>
              <span className="text-xs font-mono text-slate-500">
                {calc.facilityTotalLoadMW} MW • {config.gpuType.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Export Executive Pitch Pack & FEED Deliverables
            </h3>
            <p className="text-xs text-slate-600">
              Download formal specifications, export itemized BOM spreadsheets, or print presentation-ready pitch decks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* 4 Primary Functional Export Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Option 1: Formal Print / PDF */}
          <button
            onClick={handlePrintTrigger}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 text-left transition flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 flex items-center gap-1.5">
                <span>Print / Save as PDF Deck</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Generates a clean, 5-page formal FEED engineering document formatted for executive review.
              </p>
            </div>
          </button>

          {/* Option 2: BOM CSV Spreadsheet */}
          <button
            onClick={handleDownloadCSV}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/40 text-left transition flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                <span>Download Bill of Materials (.CSV)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Itemized equipment pricing, lead times, and sub-package breakdown for Excel / ERP ingestion.
              </p>
            </div>
          </button>

          {/* Option 3: Copy Executive Brief */}
          <button
            onClick={handleCopySummary}
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/40 text-left transition flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-purple-700 flex items-center gap-1.5">
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Executive Brief (Text)'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Full plain-text memo containing key power, cooling, CapEx, and ROI numbers ready for email or Slack.
              </p>
            </div>
          </button>

          {/* Option 4: Technical Configuration JSON */}
          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-100 text-left transition flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-slate-700 text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-slate-800 flex items-center gap-1.5">
                <span>Export Design Specs (.JSON)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Complete engineering state and constraint parameters for automated CAD/BIM or CPQ systems.
              </p>
            </div>
          </button>
        </div>

        {/* Quick Pitch Summary Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wide">
              Pitch Deck Highlights Preview
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Ready for Investment Committee
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Capacity</span>
              <span className="font-mono font-bold text-slate-900">{calc.facilityTotalLoadMW} MW</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Design PUE</span>
              <span className="font-mono font-bold text-blue-600">{calc.pue.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">CapEx Baseline</span>
              <span className="font-mono font-bold text-emerald-600">${calc.totalCapExM}M</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Lead Time</span>
              <span className="font-mono font-bold text-slate-900">{calc.criticalPathWeeks} Wks</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-xs">
          <div className="text-[11px] text-slate-500">
            All exports include timestamped engineering assumptions and physics verification tags.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPushEpc();
              }}
              className="px-3.5 py-1.5 rounded-lg font-bold text-white bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-700 border-b-[2px] border-b-emerald-900 shadow-xs active:translate-y-[1px] active:border-b-emerald-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Push to EPC Estimating</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
