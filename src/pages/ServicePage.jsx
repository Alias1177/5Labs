import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/**
 * Shared layout for the two service tiers (Partnership / Premium).
 * Receives an accent ('violet' | 'lime') and which translation key to read.
 */

const ACCENT = {
  violet: {
    eyebrow: 'text-violet dark:text-violet-300',
    chipBorder: 'border-violet/40',
    chipBg: 'bg-violet/10 text-violet dark:text-violet-200',
    bullet: 'text-violet dark:text-violet-300',
    glow: 'bg-violet/30',
    cardBg: 'from-violet/10 via-transparent to-transparent',
    cardBorder: 'border-violet/40',
    badge: 'bg-violet text-paper',
    btn: 'bg-violet text-paper hover:bg-violet-600 dark:bg-violet dark:text-paper dark:hover:bg-violet-400',
    line: 'bg-violet/40',
    heroAura: 'from-violet/30 via-violet/10 to-transparent',
  },
  lime: {
    eyebrow: 'text-lime-700 dark:text-lime-400',
    chipBorder: 'border-lime-500/50 dark:border-lime/40',
    chipBg: 'bg-lime/15 text-lime-800 dark:text-lime-300',
    bullet: 'text-lime-700 dark:text-lime-400',
    glow: 'bg-lime/40',
    cardBg: 'from-lime/15 via-transparent to-transparent',
    cardBorder: 'border-lime-500/50 dark:border-lime/40',
    badge: 'bg-lime text-ink',
    btn: 'bg-lime text-ink hover:bg-lime-300 dark:bg-lime dark:text-ink dark:hover:bg-lime-300',
    line: 'bg-lime/50',
    heroAura: 'from-lime/30 via-lime/10 to-transparent',
  },
};

/* ─── Tiny icon set, picked by category tag ──────────────────────────────── */
function CategoryIcon({ tag, className = 'h-7 w-7' }) {
  const t = (tag || '').toLowerCase();
  const stroke = 'currentColor';
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.6,
    stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (t.includes('страт') || t.includes('strat')) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3v18M7 7l10 10M7 17l10-10" />
      </svg>
    );
  }
  if (t === 'smm') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill={stroke} />
      </svg>
    );
  }
  if (t.includes('perf')) {
    return (
      <svg {...common}>
        <path d="M3 17l6-6 4 4 7-9" />
        <path d="M14 6h6v6" />
      </svg>
    );
  }
  if (t === 'ai' || t.includes('автомат')) {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="16" height="12" rx="3" />
        <circle cx="9" cy="12" r="1.2" fill={stroke} />
        <circle cx="15" cy="12" r="1.2" fill={stroke} />
        <path d="M12 3v3M8 18l-1 3M16 18l1 3" />
      </svg>
    );
  }
  if (t.includes('анал') || t.includes('analy')) {
    return (
      <svg {...common}>
        <path d="M4 20V4M4 20h16" />
        <rect x="7" y="12" width="3" height="6" rx="0.5" />
        <rect x="12" y="8" width="3" height="10" rx="0.5" />
        <rect x="17" y="14" width="3" height="4" rx="0.5" />
      </svg>
    );
  }
  if (t === 'pr') {
    return (
      <svg {...common}>
        <path d="M3 11v2a3 3 0 003 3h1l5 4V4L7 8H6a3 3 0 00-3 3z" />
        <path d="M16 8a4 4 0 010 8" />
        <path d="M19 5a8 8 0 010 14" />
      </svg>
    );
  }
  if (t.includes('бренд') || t.includes('brand')) {
    return (
      <svg {...common}>
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6L4 9l5.5-.5L12 3z" />
      </svg>
    );
  }
  if (t.includes('разраб') || t.includes('devel')) {
    return (
      <svg {...common}>
        <path d="M9 8l-4 4 4 4" />
        <path d="M15 8l4 4-4 4" />
        <path d="M13 5l-2 14" />
      </svg>
    );
  }
  // fallback
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ServicePage({ accent = 'violet', tier = 'partnership' }) {
  const { t } = useI18n();
  const a = ACCENT[accent];
  const data = t.servicePages[tier];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Decorative aura */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br ${a.heroAura} blur-3xl opacity-70`}
        />

        <div className="container-narrow relative">
          {/* Breadcrumb */}
          <Reveal className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
            <Link to="/" className="link-underline hover:text-ink dark:hover:text-paper">
              {t.servicePages.backHome}
            </Link>
            <span aria-hidden="true">/</span>
            <span className={a.eyebrow}>{data.eyebrow}</span>
          </Reveal>

          <Reveal className="max-w-3xl">
            <span className={`font-display text-xs uppercase tracking-[0.25em] ${a.eyebrow}`}>
              {data.eyebrow}
            </span>
            <h1 className="mt-5 font-display font-bold leading-[1.02] text-[clamp(2.5rem,6vw,5rem)]">
              {data.title}
            </h1>
            <p className="mt-7 text-lg text-muted lg:text-xl">{data.intro}</p>
          </Reveal>

          <Reveal delay={120}>
            <div
              className={`mt-8 inline-flex items-center gap-3 rounded-full border ${a.chipBorder} ${a.chipBg} px-4 py-2 text-sm`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accent === 'violet' ? 'bg-violet' : 'bg-lime-500'}`} />
              {data.kicker}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sections grid */}
      <section className="relative pb-24 lg:pb-32">
        <div className="container-narrow">
          <div className="grid gap-6 lg:grid-cols-2">
            {data.groups.map((g, idx) => (
              <Reveal
                as="article"
                key={idx}
                delay={idx * 80}
                className={`group relative overflow-hidden rounded-3xl border ${a.cardBorder} bg-gradient-to-br ${a.cardBg} p-7 transition hover:-translate-y-1 lg:p-9`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full ${a.glow} opacity-50 blur-3xl transition-opacity group-hover:opacity-90`}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${a.cardBorder} bg-paper/60 backdrop-blur dark:bg-ink/60 ${a.eyebrow}`}>
                    <CategoryIcon tag={g.tag} />
                  </div>
                  <span className={`font-display text-sm font-semibold tabular-nums ${a.eyebrow}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative mt-7">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${a.chipBorder} ${a.chipBg}`}
                  >
                    {g.tag}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold lg:text-3xl">{g.title}</h3>
                  <p className="mt-3 text-muted">{g.desc}</p>

                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {g.items.map((it, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-ink/85 dark:text-white/85"
                      >
                        <span className={`mt-[2px] text-base leading-none ${a.bullet}`}>→</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-28">
        <div className="container-narrow">
          <Reveal>
            <div className={`relative overflow-hidden rounded-3xl border ${a.cardBorder} bg-gradient-to-br ${a.cardBg} p-10 lg:p-16`}>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full ${a.glow} blur-3xl opacity-60`}
              />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <span className={`font-display text-xs uppercase tracking-[0.25em] ${a.eyebrow}`}>
                    {data.eyebrow}
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold lg:text-5xl">
                    {t.servicePages.ctaTitle}
                  </h2>
                  <p className="mt-4 text-muted lg:text-lg">{t.servicePages.ctaSubtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/#contact"
                    className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${a.btn}`}
                  >
                    {t.servicePages.ctaButton}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link to="/" className="btn-ghost">
                    {t.servicePages.backHome}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
