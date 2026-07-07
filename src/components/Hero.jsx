import { useI18n } from '../i18n/I18nContext.jsx';
import HighlightWords from './HighlightWords.jsx';

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="home" className="relative overflow-hidden pt-28 lg:pt-36">
      {/* Background image (statue) — covers the hero area above the marquee */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[120px]">
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-right"
        />
        {/* Readability overlay — light wash in light theme, lighter wash in dark theme so the statue stays visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-paper/30 dark:from-ink/90 dark:via-ink/40 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-transparent to-paper dark:from-transparent dark:via-transparent dark:to-ink/70" />
      </div>

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] bg-glow-violet opacity-60" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <div className="flex min-h-[460px] flex-col items-start lg:min-h-[540px]">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
            {t.hero.eyebrow}
          </span>

          <h1 key={t.hero.title} className="mt-6 font-display text-hero font-bold leading-[1.1]">
            <HighlightWords text={t.hero.title} step={0.65} sweepIn={0.22} />
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted lg:text-xl">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn-primary">
              {t.hero.ctaPrimary}
              <ArrowRight />
            </a>
            <a href="#services" className="btn-ghost">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

      </div>

      {/* Marquee ticker */}
      <div className="relative mt-20 border-y border-ink/10 bg-ink/[0.02] py-6 overflow-hidden dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex w-max animate-marquee gap-10 text-ink/40 dark:text-white/40">
          {[...Array(2)].map((_, outer) => (
            <div key={outer} className="flex items-center gap-10">
              {['strategy', 'branding', 'video', 'performance', 'education', 'product', 'content', 'digital'].map(
                (w, i) => (
                  <span key={i} className="flex items-center gap-10 font-display text-2xl uppercase tracking-tight">
                    {w}
                    <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl surface-card surface-card-hover p-6 transition">
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${
          accent === 'violet' ? 'bg-violet/30' : 'bg-lime/30'
        } blur-3xl`}
      />
      <div className={`font-display text-5xl font-bold ${accent === 'violet' ? 'text-violet' : 'text-violet dark:text-lime-400'}`}>
        {value}
      </div>
      <div className="mt-2 text-sm uppercase tracking-widest text-subtle">{label}</div>
    </div>
  );
}
