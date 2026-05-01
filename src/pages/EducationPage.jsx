import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/**
 * Хаб образования: три ярких блока (Семинары / Индивидуально / Группы)
 * + секция «Почему 5 Labs» + CTA к контактам.
 *
 * Карточки полноразмерные кликабельные ведут на каталог нужного формата.
 * Цвета подобраны в ритме главной (violet → lime → inverse).
 */

const FORMATS = [
  { key: 'seminars',   accent: 'violet',  href: '/education/seminars' },
  { key: 'individual', accent: 'lime',    href: '/education/individual' },
  { key: 'group',      accent: 'inverse', href: '/education/group' },
];

const ACCENT = {
  violet: {
    bg: 'bg-violet text-paper',
    chip: 'border-paper/40 text-paper',
    btn: 'bg-paper text-ink hover:bg-paper/90',
    glow: 'bg-violet-300/40',
    big: 'text-paper/15',
  },
  lime: {
    bg: 'bg-lime text-ink',
    chip: 'border-ink/30 text-ink',
    btn: 'bg-ink text-paper hover:bg-ink/90',
    glow: 'bg-lime-200/60',
    big: 'text-ink/15',
  },
  inverse: {
    bg: 'bg-ink text-paper dark:bg-paper dark:text-ink',
    chip: 'border-paper/30 text-paper dark:border-ink/30 dark:text-ink',
    btn: 'bg-paper text-ink hover:bg-paper/90 dark:bg-ink dark:text-paper dark:hover:bg-ink/90',
    glow: 'bg-paper/15 dark:bg-ink/15',
    big: 'text-paper/15 dark:text-ink/15',
  },
};

export default function EducationPage() {
  const { t } = useI18n();
  const e = t.educationPage;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 lg:pt-40 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 bg-glow-violet opacity-30"
        />
        <div className="container-narrow relative">
          <Reveal className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
            <Link to="/" className="link-underline hover:text-ink dark:hover:text-paper">
              {t.servicePages.backHome}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-violet dark:text-lime">{e.eyebrow}</span>
          </Reveal>
          <Reveal>
            <span className="eyebrow">{e.eyebrow}</span>
            <h1 className="mt-5 font-display font-bold leading-[1.02] text-[clamp(2.5rem,6vw,5rem)]">
              {e.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-muted lg:text-xl">{e.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* Three formats */}
      <section className="relative pb-24 lg:pb-32">
        <div className="container-narrow">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FORMATS.map((f, i) => {
              const a = ACCENT[f.accent];
              const data = e.formats[f.key];
              return (
                <Reveal
                  as={Link}
                  to={f.href}
                  key={f.key}
                  delay={i * 90}
                  className={`group relative isolate flex h-full min-h-[24rem] flex-col overflow-hidden rounded-3xl ${a.bg} p-7 transition hover:-translate-y-1 lg:p-9`}
                >
                  {/* Decorative aura behind text */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-24 -right-24 -z-10 h-56 w-56 rounded-full ${a.glow} opacity-60 blur-3xl transition-opacity group-hover:opacity-100`}
                  />
                  {/* Mega ghost number — лежит позади контента, в углу */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-6 -right-2 -z-10 select-none font-display text-[12rem] font-bold leading-none ${a.big}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="font-display text-5xl font-bold leading-none lg:text-6xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${a.chip}`}>
                      {data.tag}
                    </span>
                  </div>

                  <div className="relative mt-12 flex grow flex-col">
                    <h2 className="font-display text-3xl font-bold leading-tight lg:text-[2.25rem]">
                      {data.title}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed opacity-90">
                      {data.desc}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      {data.stat}
                    </div>
                    <div className="mt-auto pt-10">
                      <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition group-hover:-translate-y-0.5 ${a.btn}`}>
                        {e.formats.cta}
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="relative pb-24 lg:pb-32">
        <div className="container-narrow">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{e.why.eyebrow}</span>
            <h2 className="mt-4 font-display text-display font-bold">{e.why.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {e.why.items.map((it, i) => (
              <Reveal key={i} delay={i * 80} className="rounded-3xl surface-card surface-card-hover p-7 transition">
                <span className="font-display text-5xl font-bold text-violet/70 dark:text-lime/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold lg:text-2xl">{it.title}</h3>
                <p className="mt-3 text-muted">{it.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative pb-28">
        <div className="container-narrow">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-violet/40 bg-gradient-to-br from-violet/15 via-transparent to-transparent p-10 lg:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet/30 blur-3xl opacity-60"
              />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <span className="eyebrow">{e.bottomCta.eyebrow}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold lg:text-5xl">{e.bottomCta.title}</h2>
                  <p className="mt-4 text-muted lg:text-lg">{e.bottomCta.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/#contact" className="btn-primary">
                    {e.bottomCta.button}
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
