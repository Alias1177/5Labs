import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/* Универсальная страница для юридических текстов: Privacy / Terms.
   Контент берётся из t.legal[kind]. */

export default function LegalPage({ kind = 'privacy' }) {
  const { t } = useI18n();
  const data = t.legal[kind];

  return (
    <section className="relative pt-28 pb-24 lg:pt-40 lg:pb-32">
      <div className="container-narrow relative">
        <Reveal className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-widest text-subtle">{t.legal.updated}</p>
        </Reveal>

        <div className="mt-12 max-w-3xl space-y-10">
          {data.sections.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <h2 className="font-display text-xl font-bold lg:text-2xl">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
