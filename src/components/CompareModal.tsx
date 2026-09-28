import React from 'react';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { calculateEngineeringMetrics } from '../utils/engineeringEngine';
import { Check, X } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: DataCenterConfig;
  currentCalc: EngineeringCalculation;
  onApplyPreset: (presetId: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  currentCalc,
  onApplyPreset
}) => {
  if (!isOpen) return null;

  // Calculate comparisons against 2 prominent presets
  const preset1 = ARCHITECTURE_PRESETS[0]; // 100MW Blackwell
  const preset2 = ARCHITECTURE_PRESETS[1]; // 50MW Sovereign
  const calc1 = calculateEngineeringMetrics(preset1.config);
  const calc2 = calculateEngineeringMetrics(preset2.config);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Multi-Configuration Architecture Comparison
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Benchmark your custom configuration against validated industry design-build baselines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Metric / Dimension</th>
                <th className="py-3 px-4 text-blue-700 bg-blue-50 font-bold">
                  Current Custom Design
                </th>
                <th className="py-3 px-4 font-bold text-slate-900">
                  {preset1.title}
                </th>
                <th className="py-3 px-4 font-bold text-slate-900">
                  {preset2.title}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Accelerator & Silicon</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold font-sans">
                  {currentConfig.gpuType.toUpperCase()} ({currentCalc.rackDensityKW} kW/rack)
                </td>
                <td className="py-3 px-4 font-sans text-slate-900">GB200 (120 kW/rack)</td>
                <td className="py-3 px-4 font-sans text-slate-900">B200 (65 kW/rack)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Cluster Scale (GPUs)</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentConfig.ingressMode === 'top-down' ? currentConfig.gpuCount.toLocaleString() : (currentCalc.totalRacks * 72).toLocaleString()} GPUs
                </td>
                <td className="py-3 px-4">{preset1.config.gpuCount.toLocaleString()} GPUs</td>
                <td className="py-3 px-4">{preset2.config.gpuCount.toLocaleString()} GPUs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Critical IT Load</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.criticalITLoadMW.toFixed(1)} MW
                </td>
                <td className="py-3 px-4">{calc1.criticalITLoadMW.toFixed(1)} MW</td>
                <td className="py-3 px-4">{calc2.criticalITLoadMW.toFixed(1)} MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Total Facility Load</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.facilityTotalLoadMW} MW
                </td>
                <td className="py-3 px-4">{calc1.facilityTotalLoadMW} MW</td>
                <td className="py-3 px-4">{calc2.facilityTotalLoadMW} MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Calculated PUE</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.pue.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-emerald-700 font-bold">{calc1.pue.toFixed(2)}</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">{calc2.pue.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">White Space Power</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-sans">
                  {currentConfig.serverPower.toUpperCase()}
                </td>
                <td className="py-3 px-4 font-sans">800V DC Busway</td>
                <td className="py-3 px-4 font-sans">800V DC Busway</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Total CapEx ($M)</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold text-sm">
                  ${currentCalc.totalCapExM}M
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">${calc1.totalCapExM}M</td>
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">${calc2.totalCapExM}M</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Unit CapEx / MW</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  ${currentCalc.capexPerMW}M / MW
                </td>
                <td className="py-3 px-4">${calc1.capexPerMW}M / MW</td>
                <td className="py-3 px-4">${calc2.capexPerMW}M / MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Annual OpEx (Pwr)</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  ${currentCalc.annualPowerCostM}M / yr
                </td>
                <td className="py-3 px-4">${calc1.annualPowerCostM}M / yr</td>
                <td className="py-3 px-4">${calc2.annualPowerCostM}M / yr</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Critical Path Lead Time</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.criticalPathWeeks} Weeks
                </td>
                <td className="py-3 px-4">{calc1.criticalPathWeeks} Weeks</td>
                <td className="py-3 px-4">{calc2.criticalPathWeeks} Weeks</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">Earliest COD Date</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.projectedCODDate}
                </td>
                <td className="py-3 px-4 text-slate-900 font-bold">{calc1.projectedCODDate}</td>
                <td className="py-3 px-4 text-slate-900 font-bold">{calc2.projectedCODDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Tip: Click a preset button below to immediately load that architectural template.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onApplyPreset(preset1.id); onClose(); }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer border border-slate-200"
            >
              Load {preset1.title}
            </button>
            <button
              onClick={() => { onApplyPreset(preset2.id); onClose(); }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer border border-slate-200"
            >
              Load {preset2.title}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
