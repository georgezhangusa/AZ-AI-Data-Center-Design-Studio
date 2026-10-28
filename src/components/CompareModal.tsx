import React from 'react';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { calculateEngineeringMetrics } from '../utils/engineeringEngine';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, lang } = useLanguage();
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
              {t.compareModal.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.compareModal.subtitle}
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
                <th className="py-3 px-4">{t.compareModal.colMetric}</th>
                <th className="py-3 px-4 text-blue-700 bg-blue-50 font-bold">
                  {t.compareModal.colCurrent}
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
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricAccelerators}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold font-sans">
                  {currentConfig.gpuType.toUpperCase()} ({currentCalc.rackDensityKW} kW/rack)
                </td>
                <td className="py-3 px-4 font-sans text-slate-900">GB200 (120 kW/rack)</td>
                <td className="py-3 px-4 font-sans text-slate-900">B200 (65 kW/rack)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricRacks}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentConfig.ingressMode === 'top-down' ? currentConfig.gpuCount.toLocaleString() : (currentCalc.totalRacks * 72).toLocaleString()} GPUs ({currentCalc.totalRacks} {lang === 'zh' ? '机柜' : lang === 'fr' ? 'baies' : 'racks'})
                </td>
                <td className="py-3 px-4">{preset1.config.gpuCount.toLocaleString()} GPUs ({calc1.totalRacks} {lang === 'zh' ? '机柜' : lang === 'fr' ? 'baies' : 'racks'})</td>
                <td className="py-3 px-4">{preset2.config.gpuCount.toLocaleString()} GPUs ({calc2.totalRacks} {lang === 'zh' ? '机柜' : lang === 'fr' ? 'baies' : 'racks'})</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricITLoad}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.criticalITLoadMW.toFixed(1)} MW
                </td>
                <td className="py-3 px-4">{calc1.criticalITLoadMW.toFixed(1)} MW</td>
                <td className="py-3 px-4">{calc2.criticalITLoadMW.toFixed(1)} MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricFacilityLoad}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.facilityTotalLoadMW} MW
                </td>
                <td className="py-3 px-4">{calc1.facilityTotalLoadMW} MW</td>
                <td className="py-3 px-4">{calc2.facilityTotalLoadMW} MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricPUE}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.pue.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-emerald-700 font-bold">{calc1.pue.toFixed(2)}</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">{calc2.pue.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricPowerArch}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-sans">
                  {currentConfig.serverPower.toUpperCase()}
                </td>
                <td className="py-3 px-4 font-sans">800V DC Busway</td>
                <td className="py-3 px-4 font-sans">800V DC Busway</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricTotalCapEx}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold text-sm">
                  ${currentCalc.totalCapExM}M
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">${calc1.totalCapExM}M</td>
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">${calc2.totalCapExM}M</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{lang === 'zh' ? '单位 CapEx / MW' : lang === 'fr' ? 'CapEx unitaire / MW' : 'Unit CapEx / MW'}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  ${currentCalc.capexPerMW}M / MW
                </td>
                <td className="py-3 px-4">${calc1.capexPerMW}M / MW</td>
                <td className="py-3 px-4">${calc2.capexPerMW}M / MW</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricAnnualOpEx}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  ${currentCalc.annualPowerCostM}M / {lang === 'zh' ? '年' : lang === 'fr' ? 'an' : 'yr'}
                </td>
                <td className="py-3 px-4">${calc1.annualPowerCostM}M / {lang === 'zh' ? '年' : lang === 'fr' ? 'an' : 'yr'}</td>
                <td className="py-3 px-4">${calc2.annualPowerCostM}M / {lang === 'zh' ? '年' : lang === 'fr' ? 'an' : 'yr'}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricLeadTime}</td>
                <td className="py-3 px-4 text-blue-800 bg-blue-50/60 font-bold">
                  {currentCalc.criticalPathWeeks} {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}
                </td>
                <td className="py-3 px-4">{calc1.criticalPathWeeks} {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                <td className="py-3 px-4">{calc2.criticalPathWeeks} {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-600">{t.compareModal.metricCOD}</td>
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
            {lang === 'zh' ? '提示：点击下方预设按钮可直接加载该行业标杆架构。' : lang === 'fr' ? 'Astuce : Cliquez sur un bouton ci-dessous pour charger immédiatement ce modèle.' : 'Tip: Click a preset button below to immediately load that architectural template.'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onApplyPreset(preset1.id); onClose(); }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer border border-slate-200"
            >
              {lang === 'zh' ? '加载' : lang === 'fr' ? 'Charger' : 'Load'} {preset1.title}
            </button>
            <button
              onClick={() => { onApplyPreset(preset2.id); onClose(); }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer border border-slate-200"
            >
              {lang === 'zh' ? '加载' : lang === 'fr' ? 'Charger' : 'Load'} {preset2.title}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
