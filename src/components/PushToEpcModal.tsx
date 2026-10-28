import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { CheckCircle2, CloudUpload, FileCheck, Send, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PushToEpcModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

export const PushToEpcModal: React.FC<PushToEpcModalProps> = ({
  isOpen,
  onClose,
  config,
  calc
}) => {
  const { t, lang } = useLanguage();
  const [clientName, setClientName] = useState('Nebula Compute Partners');
  const [contactEmail, setContactEmail] = useState('infrastructure@nebulacompute.ai');
  const [leadStage, setLeadStage] = useState('Qualified FEED Proposal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-emerald-600" />
              {t.epcModal.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.epcModal.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">
              {t.epcModal.submitSuccess}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {lang === 'zh' ? (
                <>Salesforce 商业商机 <strong>OPP-2026-AI-{Math.floor(1000 + Math.random() * 9000)}</strong> 已成功建立，合同总估值 (TCV) 为 <strong>${calc.totalCapExM}M</strong> ({calc.facilityTotalLoadMW} MW)。</>
              ) : lang === 'fr' ? (
                <>Opportunité Salesforce <strong>OPP-2026-AI-{Math.floor(1000 + Math.random() * 9000)}</strong> créée avec valeur totale de contrat (TCV) de <strong>${calc.totalCapExM}M</strong> ({calc.facilityTotalLoadMW} MW).</>
              ) : (
                <>Salesforce Opportunity <strong>OPP-2026-AI-{Math.floor(1000 + Math.random() * 9000)}</strong> created with Total Contract Value (TCV) of <strong>${calc.totalCapExM}M</strong> ({calc.facilityTotalLoadMW} MW).</>
              )}
            </p>
            <div className="text-[11px] font-mono text-emerald-800 bg-white p-2.5 rounded-lg border border-emerald-300 max-w-sm mx-auto shadow-xs">
              {lang === 'zh'
                ? '✓ Procore 明细 BOM 已同步导出 · ✓ 工程审阅工作流已触发 (24 小时内流转)'
                : lang === 'fr'
                ? '✓ BOM Procore exportée · ✓ Routage d\'ingénierie déclenché (délai 24h)'
                : '✓ Procore Itemized BOM Exported · ✓ Engineering Routing Triggered (24-Hr Turnaround)'}
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              {t.epcModal.closeBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  {lang === 'zh' ? '项目规模' : lang === 'fr' ? 'Échelle (MW)' : 'Deal Size (MW)'}
                </span>
                <span className="font-mono font-bold text-blue-700">{calc.facilityTotalLoadMW} MW</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  {t.epcModal.estCapEx}
                </span>
                <span className="font-mono font-bold text-emerald-700">${calc.totalCapExM}M</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  {t.epcModal.targetCOD}
                </span>
                <span className="font-mono font-bold text-amber-700">{calc.projectedCODDate}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 mb-1 block">
                  {lang === 'zh' ? '企业客户 / 投资主体' : lang === 'fr' ? 'Entreprise cliente / Compte' : 'Account / Client Enterprise'}
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">
                  {lang === 'zh' ? '主责方案架构师邮箱' : lang === 'fr' ? 'E-mail de l\'architecte référent' : 'Lead Solutions Architect Email'}
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">
                  {t.epcModal.pipelineStage}
                </label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                >
                  <option value="Stage 1 - Sizing Study">
                    {lang === 'zh' ? '阶段 1: 初步选址与电力容量评估' : lang === 'fr' ? 'Étape 1 : Étude de dimensionnement préliminaire' : 'Stage 1: Preliminary Site / Power Sizing'}
                  </option>
                  <option value="Stage 2 - Qualified FEED Proposal">
                    {lang === 'zh' ? '阶段 2: 审定 FEED 技术提案与 CapEx 预算' : lang === 'fr' ? 'Étape 2 : Proposition technique FEED qualifiée' : 'Stage 2: Qualified FEED Proposal & CapEx'}
                  </option>
                  <option value="Stage 3 - Term Sheet & Reservation">
                    {lang === 'zh' ? '阶段 3: 投资条款清单与电力容量锁定' : lang === 'fr' ? 'Étape 3 : Term sheet & réservation de puissance' : 'Stage 3: Term Sheet & Power Reservation'}
                  </option>
                  <option value="Stage 4 - EPC Design-Build Contract">
                    {lang === 'zh' ? '阶段 4: EPC 工程设计-总承包框架协议' : lang === 'fr' ? 'Étape 4 : Contrat de conception-construction EPC' : 'Stage 4: EPC Design-Build Master Agreement'}
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {lang === 'zh' ? '数据通过 AES-256 SOC-2 加密链路安全传输。' : lang === 'fr' ? 'Données sécurisées via chiffrement AES-256 SOC-2.' : 'Data transferred under AES-256 SOC-2 encryption.'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-200"
                >
                  {t.common.close}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (lang === 'zh' ? '同步中...' : lang === 'fr' ? 'Synchronisation...' : 'Syncing...') : t.epcModal.submitBtn}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
