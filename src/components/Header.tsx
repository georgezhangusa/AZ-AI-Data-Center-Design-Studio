import React from 'react';
import { ArrowRight, BookOpen, Download, FileText, Send, Share2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onOpenCompare: () => void;
  onOpenPushEpc: () => void;
  onPrint: () => void;
  onOpenExport?: () => void;
  onOpenReadme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSetStep,
  onOpenCompare,
  onOpenPushEpc,
  onPrint,
  onOpenExport,
  onOpenReadme
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between no-print shadow-xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex flex-col text-left">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
          AZ AI Data Center Design Studio
        </span>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
          <span>Developer: George Zhang</span>
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
            v1.0.0
          </span>
          {onOpenReadme && (
            <>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              <button
                type="button"
                onClick={onOpenReadme}
                className="inline-flex items-center gap-1 font-sans text-[11px] px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded border border-blue-200 transition-colors cursor-pointer select-none"
              >
                <BookOpen className="w-3 h-3" />
                <span>Readme</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links / Step Controls */}
      <nav className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 text-xs font-medium">
        <button
          onClick={() => onSetStep(1)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 1
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          1. Workload Ingress
        </button>
        <span className="text-slate-300 text-xs px-0.5 select-none" aria-hidden="true">/</span>
        <button
          onClick={() => onSetStep(2)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 2
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          2. Component Physics
        </button>
        <span className="text-slate-300 text-xs px-0.5 select-none" aria-hidden="true">/</span>
        <button
          onClick={() => onSetStep(3)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 3
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          3. Deliverables & ROI
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        {onOpenReadme && (
          <button
            onClick={onOpenReadme}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-100 border border-slate-300 border-b-[3px] border-b-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-[2px] active:border-b-slate-300 active:shadow-none transition-all duration-75 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 select-none"
            title="View Project README & Inquiries"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Readme</span>
          </button>
        )}
        <button
          onClick={onOpenCompare}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-100 border border-slate-300 border-b-[3px] border-b-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-[2px] active:border-b-slate-300 active:shadow-none transition-all duration-75 cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center select-none"
        >
          Compare Presets
        </button>
        <button
          onClick={onOpenExport || onPrint}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-100 border border-slate-300 border-b-[3px] border-b-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-[2px] active:border-b-slate-300 active:shadow-none transition-all duration-75 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 select-none"
        >
          <FileText className="w-3.5 h-3.5" />
          Export Pitch Pack
        </button>
        <button
          onClick={onOpenPushEpc}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 border border-emerald-600 border-b-[3px] border-b-emerald-800 shadow-[0_2px_5px_rgba(5,150,105,0.3)] active:translate-y-[2px] active:border-b-emerald-700 active:shadow-none transition-all duration-75 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 select-none"
        >
          <Send className="w-3.5 h-3.5" />
          Push to EPC
        </button>
      </div>
    </header>
  );
};
