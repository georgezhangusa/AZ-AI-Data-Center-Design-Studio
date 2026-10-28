import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Translations, translations } from './translations';

export type { Language };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('az_datacenter_lang') as Language;
      if (saved && (saved === 'en' || saved === 'zh' || saved === 'fr')) {
        return saved;
      }
      // If browser language has Chinese, default to zh
      if (typeof navigator !== 'undefined') {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('zh')) return 'zh';
        if (navLang.startsWith('fr')) return 'fr';
      }
    } catch {
      // fallback
    }
    return 'zh'; // Defaulting to Chinese as requested, with instant toggle to EN & FR!
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('az_datacenter_lang', newLang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
