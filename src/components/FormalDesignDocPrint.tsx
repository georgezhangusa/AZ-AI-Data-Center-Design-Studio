import React from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { calculatePersonaROI } from '../utils/engineeringEngine';

interface FormalDesignDocPrintProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

export const FormalDesignDocPrint: React.FC<FormalDesignDocPrintProps> = ({ config, calc }) => {
  const roiNeocloud = calculatePersonaROI('neocloud', config, calc);

  return (
    <div className="hidden print-only p-8 text-black bg-white font-sans text-sm space-y-6">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            AZ Data Center Studio
          </h1>
          <p className="text-xs text-slate-600 font-semibold tracking-wider uppercase mt-0.5">
            Mission-Critical AI Infrastructure EPC Solutions · Front-End Engineering Design (FEED) Study
          </p>
        </div>
        <div className="text-right text-xs text-slate-600 font-mono">
          <div>DOC-REF: AZ-FEED-2026-0928</div>
          <div>DATE: September 28, 2026</div>
          <div>CLASSIFICATION: Commercial Confidential</div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
          1. Project Executive Baseline
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          This preliminary Front-End Engineering Design (FEED) package establishes the electrical, mechanical, and commercial feasibility for constructing a <strong>{calc.facilityTotalLoadMW} MW</strong> mission-critical AI supercomputing facility optimized for <strong>{config.gpuType.toUpperCase()}</strong> high-density accelerator racks.
        </p>

        <div className="grid grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 bg-slate-100 rounded border border-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Critical IT Load</span>
            <span className="font-mono font-black text-base text-slate-900">{calc.criticalITLoadMW.toFixed(1)} MW</span>
          </div>
          <div className="p-3 bg-slate-100 rounded border border-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Facility Power</span>
            <span className="font-mono font-black text-base text-slate-900">{calc.facilityTotalLoadMW} MW</span>
          </div>
          <div className="p-3 bg-slate-100 rounded border border-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Design PUE</span>
            <span className="font-mono font-black text-base text-slate-900">{calc.pue.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-slate-100 rounded border border-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated CapEx</span>
            <span className="font-mono font-black text-base text-slate-900">${calc.totalCapExM}M</span>
          </div>
        </div>
      </div>

      {/* Subsystem Specifications */}
      <div className="space-y-2 print-break-inside">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
          2. Architectural & Engineering Subsystems
        </h2>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
            <tr>
              <th className="py-2 px-3">Subsystem Domain</th>
              <th className="py-2 px-3">Selected Technology & Configuration</th>
              <th className="py-2 px-3">Engineering Criteria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2 px-3 font-semibold">Substation Yard</td>
              <td className="py-2 px-3">{config.substationType.toUpperCase()} Substation, {config.dualUtilityFeed ? 'Dual 115kV/230kV Feeds' : 'Single 115kV Feed'}</td>
              <td className="py-2 px-3">{calc.substationYardSqFt.toLocaleString()} sq ft yard, 100kA withstand rating</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">Transformation</td>
              <td className="py-2 px-3">{config.transformerType === 'sst' ? 'Solid-State Transformers (SST)' : 'Oil-Filled MV Transformers (LPT)'}</td>
              <td className="py-2 px-3">{config.redundancy.toUpperCase()} redundancy, 34.5kV to 4.16kV step-down</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">Power Distribution</td>
              <td className="py-2 px-3">{config.serverPower === '800vdc' ? '800V DC Central Busway Lineup' : '480V AC Conventional Distribution'}</td>
              <td className="py-2 px-3">{config.serverPower === '800vdc' ? '98.4% efficiency, eliminated PSU stages' : '3-phase PDU/RPP lineup'}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">BTM Generation</td>
              <td className="py-2 px-3">{config.btmPower.toUpperCase()} Fast-Track Onsite Generation</td>
              <td className="py-2 px-3">Bypasses utility interconnect queue delays</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">Thermal / CDUs</td>
              <td className="py-2 px-3">Direct-to-Chip (D2C) Liquid CDUs, {config.rejectionPlant.toUpperCase()}</td>
              <td className="py-2 px-3">{calc.totalCoolantFlowGPM.toLocaleString()} GPM circulation, {calc.heatDissipationTons.toLocaleString()} Tons heat rejection</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-semibold">Civil Envelope</td>
              <td className="py-2 px-3">{config.envelopeType === 'modular_skid' ? 'Pre-Fabricated Modular Container Skids' : 'Hardened Concrete Slab-on-Grade'}</td>
              <td className="py-2 px-3">{calc.structuralSlabLoadPcf} lbs/sq ft slab capacity, {calc.totalFootprintSqFt.toLocaleString()} sq ft area</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bill of Materials Breakdown */}
      <div className="space-y-2 print-break-inside">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
          3. Preliminary Bill of Materials (BOM) & Schedule
        </h2>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
            <tr>
              <th className="py-2 px-3">Equipment / Package</th>
              <th className="py-2 px-3">Lead Time</th>
              <th className="py-2 px-3 text-right">Cost ($M)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2 px-3">High-Voltage Substation Package</td>
              <td className="py-2 px-3">50–64 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.substationCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Medium-Voltage Transformation & Switchgear</td>
              <td className="py-2 px-3">{config.transformerType === 'sst' ? '44 Weeks' : '124 Weeks'}</td>
              <td className="py-2 px-3 text-right">${calc.transformersCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Behind-the-Meter Generation (BTM)</td>
              <td className="py-2 px-3">20–72 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.btmGenCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">UPS Battery & Energy Storage (BESS)</td>
              <td className="py-2 px-3">32–40 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.bessCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Liquid Cooling CDUs & Heat Rejection Farm</td>
              <td className="py-2 px-3">36 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.coolingPlantCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Power Distribution (800V DC / Busways)</td>
              <td className="py-2 px-3">28 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.powerDistributionCapExM}M</td>
            </tr>
            <tr>
              <td className="py-2 px-3">Civil, Structural Shell & Foundations</td>
              <td className="py-2 px-3">32–68 Weeks</td>
              <td className="py-2 px-3 text-right">${calc.civilStructuralCapExM}M</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="py-2 px-3">EPC Engineering, Permitting & Level 1-5 Cx</td>
              <td className="py-2 px-3">Continuous</td>
              <td className="py-2 px-3 text-right">${calc.epcManagementCapExM}M</td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t border-slate-300">
            <tr>
              <td colSpan={2} className="py-2 px-3 text-right">TOTAL DIRECT & INDIRECT CAPEX:</td>
              <td className="py-2 px-3 text-right">${calc.totalCapExM}M</td>
            </tr>
          </tfoot>
        </table>

        <div className="pt-2 text-xs flex justify-between font-mono text-slate-700">
          <span>Critical Path Bottleneck: <strong>{calc.bottleneckComponent}</strong> ({calc.criticalPathWeeks} Weeks)</span>
          <span>Earliest Commercial Operation Date: <strong>{calc.projectedCODDate}</strong></span>
        </div>
      </div>

      {/* Signature & Authorization Block */}
      <div className="pt-8 border-t border-slate-400 grid grid-cols-2 gap-12 text-xs print-break-inside">
        <div>
          <div className="font-bold text-slate-900 mb-1">PREPARED BY:</div>
          <div className="text-slate-600 mb-8">AZ Data Center Studio — Senior Solutions Architecture Team</div>
          <div className="border-b border-slate-400 w-3/4 mb-1"></div>
          <div className="text-[10px] text-slate-500">Authorized EPC Managing Director Signature</div>
        </div>
        <div>
          <div className="font-bold text-slate-900 mb-1">ACKNOWLEDGED & RECEIVED BY:</div>
          <div className="text-slate-600 mb-8">Client Executive Engineering Stakeholder</div>
          <div className="border-b border-slate-400 w-3/4 mb-1"></div>
          <div className="text-[10px] text-slate-500">Client Chief Technology / Infrastructure Officer</div>
        </div>
      </div>
    </div>
  );
};
