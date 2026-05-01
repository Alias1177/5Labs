import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';

/**
 * Education-секция на главной — тизер.
 * 3 карточки (Семинары / Индивидуально / Группы) + CTA на полный хаб /education.
 *
 * Карточки кликабельные целиком, ведут на каталог нужного формата.
 * Цветовое кодирование совпадает с хабом и горизонтальными полосами:
 *   01 violet, 02 lime, 03 inverse.
 */

function Block({ to, index, accent, tag, title, desc, bullet }) {
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
    inverse: {
      text: 'text-ink dark:text-paper',
      number: 'text-ink/30 dark:text-paper/30',
      dot: 'bg-ink dark:bg-paper',
    },
  };
  const a = accentMap[accent];
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-3xl surface-card surface-card-hover p-8 transition hover:-translate-y-1"
    >
      <div className={`font-display text-[80px] leading-none font-bold ${a.number}`}>
        {index}
      </div>
      <div
        className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest dark:border-white/15 dark:bg-white/5 ${a.text}`}
      >
        {tag}
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold lg:text-3xl">{title}</h3>
      <p className="mt-3 text-muted">{desc}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm text-subtle">
        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
        {bullet}
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100">
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export default function Education() {
  const { t } = useI18n();
  return (
    <section id="education" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-glow-violet opacity-30" />
      <div className="container-narrow relative">
        <div className="flex flex-wrap items-end justify-between gap-6 max-w-5xl">
          <div className="max-w-3xl">
            <span className="eyebrow">{t.education.eyebrow}</span>
            <h2 className="mt-4 font-display text-display font-bold">{t.education.title}</h2>
          </div>
          <Link to="/education" className="btn-ghost">
            {t.education.allCta || 'All programs'}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Block
            to="/education/seminars"
            index="01"
            accent="violet"
            tag={t.education.seminars.tag}
            title={t.education.seminars.title}
            desc={t.education.seminars.desc}
            bullet={t.education.seminars.bullet}
          />
          <Block
            to="/education/individual"
            index="02"
            accent="lime"
            tag={t.education.individual.tag}
            title={t.education.individual.title}
            desc={t.education.individual.desc}
            bullet={t.education.individual.bullet}
          />
          <Block
            to="/education/group"
            index="03"
            accent="inverse"
            tag={t.education.group?.tag || 'Group'}
            title={t.education.group?.title || 'Group programs'}
            desc={t.education.group?.desc || ''}
            bullet={t.education.group?.bullet || ''}
          />
        </div>
      </div>
    </section>
  );
}
