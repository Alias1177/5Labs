import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, LANGUAGES } from './translations.js';

const I18nContext = createContext(null);

const DEFAULT_LANG = 'ru';
const STORAGE_KEY = '5labs-lang';

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANG;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
    const browser = navigator.language?.slice(0, 2);
    if (browser && translations[browser]) return browser;
    return DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      languages: LANGUAGES,
      t: translations[lang] || translations[DEFAULT_LANG],
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
