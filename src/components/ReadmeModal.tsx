import React, { useState } from 'react';
import { X, Mail, Linkedin, Copy, Check, ExternalLink, BookOpen, Cpu, Zap, Droplets, ShieldCheck, FileSpreadsheet, Building2 } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('z_george@yahoo.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                About &amp; Project README
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                AZ AI Data Center Design Studio • Developer: George Zhang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close README modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Executive Overview */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4.5">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              System Overview
            </h3>
            <p className="text-slate-800 text-[13.5px] leading-relaxed">
              Engineered an interactive software for AI data center design that converts workload requirements into preliminary facility plans. Users configure GPUs, racks, substations, switchgear, 800V DC power, batteries, generators, cooling, and redundancy. It calculates capacity, PUE, costs, footprint, water use, and schedule, then generates engineering, financial, visualization, and proposal deliverable packages.
            </p>
          </div>

          {/* Conceptual Demonstration & Contact Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4.5">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              Collaboration &amp; Inquiries
            </h3>
            <p className="text-slate-800 text-[13.5px] leading-relaxed mb-3">
              This is a conceptual demonstration. If you think it could become a useful application, we can collaborate to make it happen. Please get in touch with the author, <strong>George Zhang</strong>:
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="mailto:z_george@yahoo.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-slate-800 hover:bg-amber-100/50 shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>z_george@yahoo.com</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 shadow-xs transition-colors cursor-pointer"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href="https://www.linkedin.com/in/georgezhangusa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-semibold hover:bg-[#006097] shadow-xs transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>LinkedIn: georgezhangusa</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>

          {/* Core Feature Architecture */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Engineered Capabilities &amp; Design Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Workload &amp; Compute Ingress
                </div>
                <p className="text-[12px] text-slate-600">
                  GPU clusters (NVIDIA GB200 NVL72, H100/H200, B200), high-density rack layout (40–140 kW/rack), and power sizing.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Power &amp; Behind-The-Meter (BTM)
                </div>
                <p className="text-[12px] text-slate-600">
                  Dual utility feeds, GIS/AIS substations, SST transformers, 800V DC distribution, BESS batteries, and aero turbines.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  Thermal Physics &amp; Cooling
                </div>
                <p className="text-[12px] text-slate-600">
                  Direct-to-chip liquid loops (L2L / L2A), immersion cooling, adiabatic dry coolers, PUE and WUE computation.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Civil, Envelope &amp; Redundancy
                </div>
                <p className="text-[12px] text-slate-600">
                  N, N+1, 2N redundancy tiers, modular vs stick-built structural envelopes, white space footprint, and land acreage.
                </p>
              </div>
            </div>
          </div>

          {/* Deliverables Produced */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Automated Deliverables &amp; Output Packages
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>FEED Engineering Package:</strong> Single-Line Diagrams (SLD), Process Flow Diagrams (PFD), and equipment bill-of-materials.</li>
              <li><strong>Financial &amp; TCO Modeling:</strong> 10-year CapEx and OpEx projections, energy utilization, and construction schedules.</li>
              <li><strong>EPC Push Pipeline:</strong> 1-click package submission to EPC contractor estimating workbenches.</li>
              <li><strong>Pitch Pack &amp; Spec Sheets:</strong> Formal executive briefing decks ready for board presentations or investors.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Release v1.0.0 • Conceptual Demo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
