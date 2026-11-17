'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { dictionaries, getDictionary, Dictionary } from './dictionaries';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('tb_language') as Language;
    if (saved && (saved === 'ru' || saved === 'tr' || saved === 'kk')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tb_language', lang);
  };

  const t = getDictionary(language);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: 'ru' as Language,
      setLanguage: () => {},
      t: dictionaries.ru,
    };
  }
  return context;
}
