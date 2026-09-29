import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onOpenCompare?: () => void;
  onOpenPushEpc?: () => void;
  onPrint?: () => void;
  onOpenExport?: () => void;
  onOpenReadme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSetStep,
  onOpenReadme
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between no-print shadow-xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-[25px] font-extrabold tracking-tight text-slate-700 whitespace-nowrap leading-tight">
            AZ AI Data Center Design Studio
          </span>
          <span className="font-mono text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200">
            v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 font-medium">
          <span className="text-sm font-semibold text-slate-700">Developer: George Zhang</span>
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

      {/* Zone 3: Far Right - Readme Button */}
      <div className="flex items-center justify-end">
        {onOpenReadme && (
          <button
            type="button"
            onClick={onOpenReadme}
            className="inline-flex items-center gap-1.5 font-sans text-xs px-3.5 py-1.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.35)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none transition-all duration-75 cursor-pointer select-none"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Readme</span>
          </button>
        )}
      </div>
    </header>
  );
};
