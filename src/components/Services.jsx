import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';

function Card({ id, accent, tag, title, desc, features, href, ctaLabel }) {
  // accent: 'violet' | 'lime'
  const accentMap = {
    violet: {
      border: 'border-violet/40',
      glow: 'bg-violet/25',
      chip: 'bg-violet/10 text-violet border-violet/40',
      bullet: 'text-violet',
      bg: 'bg-gradient-to-br from-violet/10 via-transparent to-transparent',
      btn: 'bg-violet text-paper hover:bg-violet-600',
    },
    lime: {
      border: 'border-lime-500/50 dark:border-lime/40',
      glow: 'bg-lime/30',
      chip: 'bg-lime/15 text-lime-700 border-lime-500/50 dark:text-lime-400 dark:border-lime/40',
      bullet: 'text-lime-700 dark:text-lime-400',
      bg: 'bg-gradient-to-br from-lime/15 via-transparent to-transparent',
      btn: 'bg-lime text-ink hover:bg-lime-300',
    },
  };
  const a = accentMap[accent];
  return (
    <div
      id={id}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border ${a.border} ${a.bg} p-8 transition hover:-translate-y-1`}
    >
      <div
        className={`pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full ${a.glow} blur-3xl opacity-60 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative flex h-full flex-col">
        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${a.chip}`}>
          {tag}
        </div>

        <h3 className="mt-6 font-display text-3xl font-bold lg:text-4xl">{title}</h3>
        <p className="mt-4 text-muted">{desc}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-ink/85 dark:text-white/85">
              <span className={`text-lg leading-none ${a.bullet}`}>→</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link
            to={href}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${a.btn}`}
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useI18n();
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="container-narrow">
        <div className="max-w-3xl">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="mt-4 font-display text-display font-bold">{t.services.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card
            id="partnership"
            accent="violet"
            tag={t.services.partnership.tag}
            title={t.services.partnership.title}
            desc={t.services.partnership.desc}
            features={t.services.partnership.features}
            href="/services/partnership"
            ctaLabel={t.services.learnMore}
          />
          <Card
            id="premium"
            accent="lime"
            tag={t.services.premium.tag}
            title={t.services.premium.title}
            desc={t.services.premium.desc}
            features={t.services.premium.features}
            href="/services/premium"
            ctaLabel={t.services.learnMore}
          />
        </div>
      </div>
    </section>
  );
}
