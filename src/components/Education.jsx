import { useI18n } from '../i18n/I18nContext.jsx';

function Block({ id, index, accent, tag, title, desc, bullet }) {
  const accentMap = {
    violet: {
      text: 'text-violet',
      number: 'text-violet/30',
      dot: 'bg-violet',
    },
    lime: {
      text: 'text-lime-700 dark:text-lime-400',
      number: 'text-lime-500/40 dark:text-lime/30',
      dot: 'bg-lime-500 dark:bg-lime',
    },
  };
  const a = accentMap[accent];
  return (
    <div
      id={id}
      className="relative flex flex-col overflow-hidden rounded-3xl surface-card surface-card-hover p-8 transition"
    >
      <div className={`font-display text-[80px] leading-none font-bold ${a.number}`}>{index}</div>
      <div className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest dark:border-white/15 dark:bg-white/5 ${a.text}`}>
        {tag}
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold lg:text-3xl">{title}</h3>
      <p className="mt-3 text-muted">{desc}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm text-subtle">
        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
        {bullet}
      </div>
    </div>
  );
}

export default function Education() {
  const { t } = useI18n();
  return (
    <section id="education" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-glow-violet opacity-30" />
      <div className="container-narrow relative">
        <div className="max-w-3xl">
          <span className="eyebrow">{t.education.eyebrow}</span>
          <h2 className="mt-4 font-display text-display font-bold">{t.education.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Block
            id="seminars"
            index="01"
            accent="violet"
            tag={t.education.seminars.tag}
            title={t.education.seminars.title}
            desc={t.education.seminars.desc}
            bullet={t.education.seminars.bullet}
          />
          <Block
            id="individual"
            index="02"
            accent="lime"
            tag={t.education.individual.tag}
            title={t.education.individual.title}
            desc={t.education.individual.desc}
            bullet={t.education.individual.bullet}
          />
        </div>
      </div>
    </section>
  );
}
