import { useI18n } from '../i18n/I18nContext.jsx';

export default function LangSwitcher({ className = '' }) {
  const { lang, setLang, languages } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/15 bg-ink/5 p-1 text-xs font-semibold dark:border-white/15 dark:bg-white/5 ${className}`}
      role="radiogroup"
      aria-label="Language"
    >
      {languages.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            role="radio"
            aria-checked={active}
            onClick={() => setLang(l.code)}
            className={`rounded-full px-3 py-1 transition ${
              active
                ? 'bg-violet text-paper dark:bg-lime dark:text-ink'
                : 'text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
