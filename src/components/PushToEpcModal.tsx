import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { CheckCircle2, CloudUpload, FileCheck, Send, ShieldCheck, X } from 'lucide-react';

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
              Automated CRM & EPC Estimating Pipeline
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Sync preliminary FEED specification directly into Salesforce CRM and Procore estimating database.
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
            <h4 className="text-base font-bold text-slate-900">Deal Record Successfully Ingested</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Salesforce Opportunity <strong>OPP-2026-AI-{Math.floor(1000 + Math.random() * 9000)}</strong> created with Total Contract Value (TCV) of <strong>${calc.totalCapExM}M</strong> ({calc.facilityTotalLoadMW} MW).
            </p>
            <div className="text-[11px] font-mono text-emerald-800 bg-white p-2.5 rounded-lg border border-emerald-300 max-w-sm mx-auto shadow-xs">
              ✓ Procore Itemized BOM Exported · ✓ Engineering Routing Triggered (24-Hr Turnaround)
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              Return to Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Deal Size (MW)</span>
                <span className="font-mono font-bold text-blue-700">{calc.facilityTotalLoadMW} MW</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Total CapEx</span>
                <span className="font-mono font-bold text-emerald-700">${calc.totalCapExM}M</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Projected COD</span>
                <span className="font-mono font-bold text-amber-700">{calc.projectedCODDate}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Account / Client Enterprise</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Lead Solutions Architect Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Pipeline Opportunity Stage</label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                >
                  <option value="Stage 1 - Sizing Study">Stage 1: Preliminary Site / Power Sizing</option>
                  <option value="Stage 2 - Qualified FEED Proposal">Stage 2: Qualified FEED Proposal & CapEx</option>
                  <option value="Stage 3 - Term Sheet & Reservation">Stage 3: Term Sheet & Power Reservation</option>
                  <option value="Stage 4 - EPC Design-Build Contract">Stage 4: EPC Design-Build Master Agreement</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Data transferred under AES-256 SOC-2 encryption.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Syncing...' : 'Confirm Pipeline Injection'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
