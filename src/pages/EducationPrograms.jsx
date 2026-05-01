import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { PROGRAMS } from '../data/educationPrograms.js';

/**
 * Каталог программ. Один компонент на два формата:
 *   /education/individual  → format="individual"
 *   /education/group       → format="group"
 *
 * UX:
 *   1. Шапка с заголовком формата.
 *   2. Тоггл «Онлайн / Офлайн» — это подсказка для пользователя; форма
 *      записи на странице программы запомнит выбор через query.
 *   3. Сетка карточек программ. По клику — на /education/programs/:slug
 *      с прокинутыми query: format и mode (online/offline).
 */

const ACCENT_CARD = {
  violet:  'border-violet/40 bg-gradient-to-br from-violet/10 via-transparent to-transparent',
  lime:    'border-lime-500/50 dark:border-lime/40 bg-gradient-to-br from-lime/15 via-transparent to-transparent',
  inverse: 'border-ink/30 dark:border-paper/30 bg-gradient-to-br from-ink/10 via-transparent to-transparent dark:from-paper/10',
};
const ACCENT_NUM = {
  violet:  'text-violet/80',
  lime:    'text-lime-700/90 dark:text-lime/80',
  inverse: 'text-ink/70 dark:text-paper/70',
};
const ACCENT_BAR = {
  violet:  'bg-violet',
  lime:    'bg-lime',
  inverse: 'bg-ink dark:bg-paper',
};

export default function EducationPrograms({ format = 'individual' }) {
  const { t } = useI18n();
  const e = t.educationPage;
  const head = e.catalog[format];
  const [delivery, setDelivery] = useState('online');

  function fmtDuration(d) {
    if (!d) return e.catalog.tbd;
    const key = String(d.months);
    return e.catalog.durations[key] || `${d.months}`;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-glow-violet opacity-25"
        />
        <div className="container-narrow relative">
          <Reveal className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
            <Link to="/education" className="link-underline hover:text-ink dark:hover:text-paper">
              {e.eyebrow}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-violet dark:text-lime">{head.eyebrow}</span>
          </Reveal>

          <Reveal>
            <span className="eyebrow">{head.eyebrow}</span>
            <h1 className="mt-5 font-display font-bold leading-[1.04] text-[clamp(2.25rem,5.5vw,4.5rem)]">
              {head.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted lg:text-xl">{head.subtitle}</p>
          </Reveal>

          {/* Delivery toggle */}
          <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
              {e.catalog.deliveryLabel}
            </span>
            <div className="inline-flex rounded-full border border-ink/15 bg-ink/5 p-1 dark:border-white/15 dark:bg-white/5">
              {['online', 'offline'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDelivery(m)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    delivery === m
                      ? 'bg-violet text-paper dark:bg-lime dark:text-ink'
                      : 'text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper'
                  }`}
                >
                  {e.catalog[m]}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Programs grid */}
      <section className="relative pb-28 lg:pb-32">
        <div className="container-narrow">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p, i) => (
              <Reveal
                as={Link}
                to={`/education/programs/${p.slug}?format=${format}&mode=${delivery}`}
                key={p.slug}
                delay={(i % 6) * 60}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition hover:-translate-y-1 lg:p-7 ${ACCENT_CARD[p.accent]}`}
              >
                {/* Accent bar — top-left strip */}
                <div
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-1 w-12 ${ACCENT_BAR[p.accent]}`}
                />

                <div className="flex items-start justify-between">
                  <span className={`font-display text-4xl font-bold tabular-nums ${ACCENT_NUM[p.accent]}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-paper/70 px-3 py-1 text-[11px] uppercase tracking-widest text-ink/70 dark:border-white/15 dark:bg-ink/40 dark:text-white/70">
                    {fmtDuration(p.duration)}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold leading-tight lg:text-3xl">
                  {p.name}
                </h3>
                <p className="mt-3 text-sm text-muted">
                  {e.catalog.descriptions[p.descKey]}
                </p>

                <div className="mt-auto pt-7 inline-flex items-center gap-2 text-sm font-semibold">
                  {e.catalog.signUp}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
