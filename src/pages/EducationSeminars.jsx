import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { SEMINARS, buildContactLink } from '../data/educationPrograms.js';

/**
 * Страница «Семинары» — список ближайших дат с быстрой записью в мессенджер.
 *
 * Каждый семинар:
 *   - крупная дата (число + месяц)
 *   - название и формат (1 день / интенсив / онлайн / офлайн)
 *   - локация
 *   - количество мест
 *   - три кнопки записи (TG / IG / WP) с предзаполненным сообщением.
 */

const ACCENT = {
  violet: {
    card:   'border-violet/40 bg-gradient-to-br from-violet/10 via-transparent to-transparent',
    date:   'text-violet',
    bar:    'bg-violet',
    btn:    'bg-violet text-paper hover:bg-violet-600',
  },
  lime: {
    card:   'border-lime-500/50 dark:border-lime/40 bg-gradient-to-br from-lime/15 via-transparent to-transparent',
    date:   'text-lime-700 dark:text-lime-400',
    bar:    'bg-lime',
    btn:    'bg-lime text-ink hover:bg-lime-300',
  },
  inverse: {
    card:   'border-ink/30 dark:border-paper/30 bg-gradient-to-br from-ink/10 via-transparent to-transparent dark:from-paper/10',
    date:   'text-ink dark:text-paper',
    bar:    'bg-ink dark:bg-paper',
    btn:    'bg-ink text-paper hover:bg-ink/90 dark:bg-paper dark:text-ink dark:hover:bg-paper/90',
  },
};

export default function EducationSeminars() {
  const { t } = useI18n();
  const e = t.educationPage;
  const sem = e.seminars;

  function formatDate(iso, lang) {
    // Парсим вручную, чтобы не зависеть от Intl и не ловить часовых поясов.
    const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
    const monthIdx = m - 1;
    const months =
      sem.months || ['', '', '', '', '', '', '', '', '', '', '', ''];
    return { day: d, month: months[monthIdx], year: y };
  }

  function buildMessage(s, info) {
    const lines = [
      e.detail.signupGreeting,
      `${sem.programLabel}: ${info.title}`,
      `${sem.dateLabel}: ${info.dateText}`,
      `${sem.formatLabel}: ${info.format}`,
      info.location ? `${sem.locationLabel}: ${info.location}` : null,
    ].filter(Boolean);
    return lines.join('\n');
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
          <Reveal className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
            <Link to="/education" className="link-underline hover:text-ink dark:hover:text-paper">
              {e.eyebrow}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-violet dark:text-lime">{sem.eyebrow}</span>
          </Reveal>

          <Reveal>
            <span className="eyebrow">{sem.eyebrow}</span>
            <h1 className="mt-5 font-display font-bold leading-[1.04] text-[clamp(2.25rem,5.5vw,4.5rem)]">
              {sem.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted lg:text-xl">{sem.subtitle}</p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-2 text-sm text-violet dark:text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              {sem.kicker}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Upcoming list */}
      <section className="relative pb-28 lg:pb-32">
        <div className="container-narrow">
          <Reveal className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold lg:text-4xl">{sem.upcomingTitle}</h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {SEMINARS.map((s, i) => {
              const a = ACCENT[s.accent];
              const item = sem.list[s.titleKey];
              const dateParts = formatDate(s.date);
              const dateText = `${dateParts.day} ${dateParts.month} ${dateParts.year}`;
              const info = {
                title: item.title,
                location: item.location,
                format: item.format,
                dateText,
              };
              return (
                <Reveal
                  key={s.slug}
                  delay={i * 80}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition hover:-translate-y-1 lg:p-9 ${a.card}`}
                >
                  <div aria-hidden="true" className={`absolute left-0 top-0 h-1 w-16 ${a.bar}`} />

                  <div className="grid grid-cols-[auto_1fr] gap-6">
                    {/* Date block */}
                    <div className="flex flex-col items-start">
                      <div className={`font-display text-6xl font-bold leading-none tabular-nums lg:text-7xl ${a.date}`}>
                        {dateParts.day}
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
                        {dateParts.month} {dateParts.year}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                      <h3 className="font-display text-2xl font-bold leading-tight lg:text-3xl">
                        {item.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-ink/15 bg-paper/70 px-3 py-1 uppercase tracking-widest text-ink/70 dark:border-white/15 dark:bg-ink/40 dark:text-white/70">
                          {item.format}
                        </span>
                        <span className="rounded-full border border-ink/15 bg-paper/70 px-3 py-1 uppercase tracking-widest text-ink/70 dark:border-white/15 dark:bg-ink/40 dark:text-white/70">
                          {sem.seatsLabel.replace('{n}', s.seats)}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-muted">{item.location}</p>
                    </div>
                  </div>

                  {/* Signup row */}
                  <div className="mt-7 flex flex-wrap gap-2 border-t border-ink/10 pt-6 dark:border-white/10">
                    <span className="mr-1 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55 self-center">
                      {sem.signUp}
                    </span>
                    <ChannelBtn channel="telegram" label="Telegram" message={buildMessage(s, info)} />
                    <ChannelBtn channel="instagram" label="Instagram" message={buildMessage(s, info)} />
                    <ChannelBtn channel="whatsapp" label="WhatsApp" message={buildMessage(s, info)} primary />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function ChannelBtn({ channel, label, message, primary = false }) {
  const cls = primary
    ? 'bg-violet text-paper hover:bg-violet-600 dark:bg-lime dark:text-ink dark:hover:bg-lime-300'
    : 'border border-ink/15 bg-ink/5 text-ink hover:border-violet hover:text-violet dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-lime dark:hover:text-lime';
  return (
    <a
      href={buildContactLink(channel, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${cls}`}
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}
