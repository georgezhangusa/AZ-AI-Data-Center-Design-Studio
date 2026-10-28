import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, type Language } from '../i18n/LanguageContext';

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
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 px-6 py-3 flex items-center justify-between no-print shadow-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-[23px] font-extrabold tracking-tight text-white whitespace-nowrap leading-tight">
            {t.common.appTitle}
          </span>
          <span className="font-mono text-xs px-2.5 py-0.5 bg-slate-800 text-slate-300 font-semibold rounded-md border border-slate-700">
            {t.common.version}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 font-medium">
          <span className="text-sm font-semibold text-slate-400">{t.common.developer}</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links / Step Controls */}
      <nav className="flex items-center gap-1.5 bg-slate-100 border border-slate-300/80 rounded-xl p-1.5 text-xs font-medium shadow-sm">
        <button
          onClick={() => onSetStep(1)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 1
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          {t.header.step1}
        </button>
        <span className="text-slate-400 text-xs px-0.5 select-none" aria-hidden="true">/</span>
        <button
          onClick={() => onSetStep(2)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 2
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          {t.header.step2}
        </button>
        <span className="text-slate-400 text-xs px-0.5 select-none" aria-hidden="true">/</span>
        <button
          onClick={() => onSetStep(3)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-75 whitespace-nowrap shrink-0 cursor-pointer select-none ${
            currentStep === 3
              ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.3)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none'
              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 font-semibold border border-slate-300 border-b-[2px] border-b-slate-400 hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:translate-y-[1px] active:border-b-slate-300 active:shadow-none'
          }`}
        >
          {t.header.step3}
        </button>
      </nav>

      {/* Zone 3: Far Right - Multilingual Switcher & Readme Button */}
      <div className="flex items-center gap-3 justify-end">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 active:bg-slate-700/80 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 transition cursor-pointer shadow-xs select-none"
            title={lang === 'zh' ? '切换语言' : lang === 'fr' ? 'Changer de langue' : 'Switch language'}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold flex items-center gap-1.5">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.label}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
          </button>

          {isOpen && (
            <div
              role="listbox"
              className="absolute right-0 mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 ring-1 ring-black/40 backdrop-blur"
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                {lang === 'zh' ? '选择语言' : lang === 'fr' ? 'Choisir la langue' : 'Select Language'}
              </div>
              {languages.map((item) => {
                const isSelected = item.code === lang;
                return (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLang(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-600/25 text-blue-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm select-none">{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {onOpenReadme && (
          <button
            type="button"
            onClick={onOpenReadme}
            className="inline-flex items-center gap-1.5 font-sans text-xs px-3.5 py-1.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg border border-blue-500 border-b-[3px] border-b-blue-800 shadow-[0_2px_5px_rgba(37,99,235,0.35)] active:translate-y-[2px] active:border-b-blue-700 active:shadow-none transition-all duration-75 cursor-pointer select-none"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.header.readme}</span>
          </button>
        )}
      </div>
    </header>
  );
};
