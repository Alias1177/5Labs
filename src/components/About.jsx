import { useI18n } from '../i18n/I18nContext.jsx';

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="9" cy="9" r="8.5" className="stroke-violet dark:stroke-lime" />
      <path d="M5.5 9.5l2.5 2.5 4.5-5" className="stroke-violet dark:stroke-lime" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="container-narrow grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="mt-4 font-display text-display font-bold">{t.about.title}</h2>
        </div>
        <div className="lg:col-span-7">
          <p className="text-lg text-muted">{t.about.p1}</p>
          <p className="mt-4 text-lg text-muted">{t.about.p2}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.about.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl surface-card px-4 py-3">
                <Check />
                <span className="text-ink/85 dark:text-white/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
