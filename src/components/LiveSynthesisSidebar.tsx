import React from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { AlertCircle, Calendar, Clock, DollarSign, FileText, Layers, ShieldAlert, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface LiveSynthesisSidebarProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  currentStep: number;
  onSetStep: (step: number) => void;
  onOpenDeliverablesModal?: () => void;
}

export const LiveSynthesisSidebar: React.FC<LiveSynthesisSidebarProps> = ({
  config,
  calc,
  currentStep,
  onSetStep,
  onOpenDeliverablesModal
}) => {
  const hasCritical = calc.alerts.some(a => a.level === 'critical');

  const handleViewDeliverables = () => {
    onSetStep(3);
    if (onOpenDeliverablesModal) {
      onOpenDeliverablesModal();
    }
  };

  return (
    <aside className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col justify-between overflow-y-auto no-print shrink-0 shadow-xs">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <span className="text-base font-bold uppercase tracking-wider text-blue-900 block">
            Synthesis
          </span>
        </div>

        {/* Physics Status Pill / Alert indicator */}
        <div
          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
            hasCritical
              ? 'border-red-200 bg-red-50 text-red-900'
              : calc.alerts.length > 0
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                hasCritical
                  ? 'bg-red-600 animate-ping'
                  : calc.alerts.length > 0
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            />
            <span className="font-semibold text-[11px]">
              {hasCritical
                ? 'Constraint Violation Detected'
                : calc.alerts.length > 0
                ? `${calc.alerts.length} Engineering Warnings`
                : 'All Constraints Verified'}
            </span>
          </div>
          {calc.alerts.length > 0 && currentStep !== 2 && (
            <button
              onClick={() => onSetStep(2)}
              className="text-[10px] font-bold underline hover:text-slate-900"
            >
              Fix in Step 2
            </button>
          )}
        </div>

        {/* Electrical & Thermal Capacity Metrics */}
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Critical IT Load</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {calc.criticalITLoadMW >= 1000
                ? `${(calc.criticalITLoadMW / 1000).toFixed(2)} GW`
                : `${calc.criticalITLoadMW.toFixed(1)} MW`}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Facility Load</span>
            <span className="text-sm font-black text-blue-700 font-mono">
              {calc.facilityTotalLoadMW >= 1000
                ? `${(calc.facilityTotalLoadMW / 1000).toFixed(2)} GW`
                : `${calc.facilityTotalLoadMW.toLocaleString()} MW`}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Calculated PUE</span>
            <span className="text-sm font-black text-emerald-700 font-mono">{calc.pue.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Racks ({calc.rackDensityKW} kW/rk)</span>
            <span className="text-sm font-black text-slate-900 font-mono">{calc.totalRacks.toLocaleString()} Racks</span>
          </div>
        </div>

        {/* CapEx & OpEx Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-slate-700">Total CapEx</span>
            <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {calc.totalCapExM >= 1000
                ? `$${(calc.totalCapExM / 1000).toFixed(2)}B`
                : `$${calc.totalCapExM.toLocaleString()}M`}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-600 border-t border-slate-200 pt-2 font-mono">
            <span className="font-sans">Unit CapEx / MW</span>
            <span className="text-slate-800">${calc.capexPerMW}M / MW</span>
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-600 font-mono">
            <span className="font-sans">Annual Power OpEx</span>
            <span className="text-slate-800">
              {calc.annualPowerCostM >= 1000
                ? `$${(calc.annualPowerCostM / 1000).toFixed(2)}B / yr`
                : `$${calc.annualPowerCostM.toLocaleString()}M / yr`}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-600 font-mono">
            <span className="font-sans">Total Annual OpEx</span>
            <span className="text-emerald-700 font-bold">
              {calc.totalAnnualOpExM >= 1000
                ? `$${(calc.totalAnnualOpExM / 1000).toFixed(2)}B / yr`
                : `$${calc.totalAnnualOpExM.toLocaleString()}M / yr`}
            </span>
          </div>
        </div>

        {/* Supply Chain Critical Path & COD Date */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Critical Path Lead Time
            </span>
            <span className="font-mono font-bold text-amber-700">{calc.criticalPathWeeks} Weeks</span>
          </div>

          {/* Progress visualizer */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
            <div
              className={`h-full transition-all duration-500 ${
                calc.criticalPathWeeks > 80
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, Math.round((calc.criticalPathWeeks / 130) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <span>Projected COD:</span>
            <span className="font-mono font-bold text-slate-900">{calc.projectedCODDate}</span>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-1.5 leading-snug">
            Bottleneck: <span className="text-slate-800 font-medium">{calc.bottleneckComponent}</span>
          </div>
        </div>

        {/* ESG Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">WUE (L/kWh)</span>
            <span className="font-mono font-bold text-emerald-700">{calc.wue}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">Footprint</span>
            <span className="font-mono font-bold text-slate-900">{Math.round(calc.totalFootprintSqFt / 1000)}k sq ft</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleViewDeliverables}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-600 border-b-4 border-b-blue-800 shadow-[0_4px_8px_rgba(37,99,235,0.25)] active:translate-y-[3px] active:border-b-2 active:border-b-blue-700 active:shadow-none transition-all duration-75 cursor-pointer flex items-center justify-center gap-2 select-none group"
        >
          <FileText className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          <span>View Formal Deliverables</span>
        </button>
      </div>
    </aside>
  );
};
