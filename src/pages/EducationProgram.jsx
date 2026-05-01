import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { SCHEDULE, buildContactLink, getProgram } from '../data/educationPrograms.js';

/**
 * Страница одной программы. Сюда приходят с каталога:
 *  /education/programs/<slug>?format=individual|group&mode=online|offline
 *
 * UX:
 *   1. Хлебные крошки + крупный заголовок программы.
 *   2. Темы программы (что внутри).
 *   3. Блок «Расписание + Запись»:
 *      - Тогглы формата (индивидуально/группа) и доставки (online/offline).
 *      - Сетка слотов; клик — выбираем слот.
 *      - Три кнопки: Telegram / Instagram / WhatsApp.
 *        Каждая откроет мессенджер с подготовленным сообщением,
 *        куда уже подставлены: программа, формат, выбранный слот.
 *
 * Реализация:
 *   - Initial-стейт для тогглов читаем из ?format & ?mode (default: individual+online).
 *   - Слот хранится в локальном стейте; никакого API — всё на клиенте.
 *   - Если slug невалидный → редирект на /education.
 */

export default function EducationProgram() {
  const { slug } = useParams();
  const { t } = useI18n();
  const location = useLocation();
  const program = getProgram(slug);
  const e = t.educationPage;

  // Запрашиваем initial-настройки из URL. useMemo чтобы реакт не пересчитывал
  // при каждом ре-рендере (search не меняется без явной навигации).
  const init = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return {
      format: p.get('format') === 'group' ? 'group' : 'individual',
      delivery: p.get('mode') === 'offline' ? 'offline' : 'online',
    };
    // location.search — единственный источник
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const [format, setFormat] = useState(init.format);
  const [delivery, setDelivery] = useState(init.delivery);
  const [picked, setPicked] = useState(null); // { dayKey, time } | null

  // Если программа не найдена — отправляем на хаб образования.
  // Делаем это после хуков, чтобы не нарушить порядок.
  if (!program) return <Navigate to="/education" replace />;

  const desc = e.catalog.descriptions[program.descKey];
  // Темы программы хранятся как { lessonsCount, exam, blocks: [{ title, desc }] }.
  // На случай legacy-данных подстрахуемся: если пришёл массив строк — превратим
  // его в массив блоков с пустым описанием. Если ничего нет — пустой объект.
  const topicsRaw = e.detail.topics[program.descKey];
  const topicsData = Array.isArray(topicsRaw)
    ? { lessonsCount: null, exam: false, blocks: topicsRaw.map((t) => ({ title: t, desc: '' })) }
    : (topicsRaw || { lessonsCount: null, exam: false, blocks: [] });
  const blocks = topicsData.blocks || [];
  const slots = SCHEDULE[delivery] || [];

  // Сборка лейбла для пилюли «N занятий [+ экзамен]».
  function lessonsPill() {
    if (typeof topicsData.lessonsCount !== 'number') return null;
    const main = `${topicsData.lessonsCount} ${e.detail.lessonsLabel}`;
    return topicsData.exam ? `${main} ${e.detail.examLabel}` : main;
  }

  function fmtDuration(d) {
    if (!d) return e.catalog.tbd;
    const key = String(d.months);
    return e.catalog.durations[key] || `${d.months}`;
  }

  // Собираем сообщение для мессенджера.
  // Менеджер сразу видит программу, формат и слот — ничего уточнять не нужно.
  function buildMessage() {
    const lines = [
      e.detail.signupGreeting,
      `${e.detail.programLabel}: ${program.name}`,
      `${e.detail.formatLabel}: ${e.catalog[format].eyebrow} • ${e.catalog[delivery]}`,
    ];
    if (picked) {
      lines.push(`${e.detail.timeLabel}: ${e.detail.days[picked.dayKey]}, ${picked.time}`);
    }
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
          <Reveal className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
            <Link to="/education" className="link-underline hover:text-ink dark:hover:text-paper">
              {e.eyebrow}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`/education/${format}`}
              className="link-underline hover:text-ink dark:hover:text-paper"
            >
              {e.catalog[format].eyebrow}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-violet dark:text-lime">{program.name}</span>
          </Reveal>

          <Reveal>
            <h1 className="font-display font-bold leading-[1.02] text-[clamp(2.5rem,7vw,5.5rem)]">
              {program.name}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-sm dark:border-white/15 dark:bg-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
                {fmtDuration(program.duration)}
              </span>
              {lessonsPill() && (
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-sm dark:border-white/15 dark:bg-white/5">
                  {lessonsPill()}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-sm dark:border-white/15 dark:bg-white/5">
                {e.catalog[format].eyebrow}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-sm dark:border-white/15 dark:bg-white/5">
                {e.catalog[delivery]}
              </span>
            </div>
            {desc && <p className="mt-7 max-w-2xl text-lg text-muted lg:text-xl">{desc}</p>}
          </Reveal>
        </div>
      </section>

      {/* Topics */}
      {blocks.length > 0 && (
        <section className="relative pb-16 lg:pb-20">
          <div className="container-narrow">
            <Reveal>
              <span className="eyebrow">{e.detail.topicsEyebrow}</span>
              <h2 className="mt-4 font-display text-3xl font-bold lg:text-4xl">
                {e.detail.topicsTitle}
              </h2>
            </Reveal>
            {/*
              Карточки-блоки: «Блок N» как акцентная подпись, заголовок темы и
              развёрнутое описание под ней. Если описания нет (legacy-программы),
              карточка остаётся компактной — заголовок без подзаголовка.
            */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map((b, i) => (
                <Reveal
                  key={i}
                  delay={i * 50}
                  className="rounded-2xl surface-card p-6"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-violet dark:text-lime tabular-nums">
                    {e.detail.blockLabel} {i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug">
                    {b.title}
                  </h3>
                  {b.desc && (
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {b.desc}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule + signup */}
      <section className="relative pb-28">
        <div className="container-narrow">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6 shadow-sm dark:border-white/10 dark:bg-ink/40 lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-violet/15 blur-3xl"
              />

              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr]">
                {/* Left: schedule */}
                <div>
                  <span className="eyebrow">{e.detail.scheduleEyebrow}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold lg:text-4xl">
                    {e.detail.scheduleTitle}
                  </h2>
                  <p className="mt-3 text-muted">{e.detail.scheduleSubtitle}</p>

                  {/* Toggles */}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ToggleGroup
                      label={e.detail.formatLabel}
                      value={format}
                      onChange={(v) => setFormat(v)}
                      options={[
                        { value: 'individual', label: e.catalog.individual.eyebrow },
                        { value: 'group',      label: e.catalog.group.eyebrow },
                      ]}
                    />
                    <ToggleGroup
                      label={e.catalog.deliveryLabel}
                      value={delivery}
                      onChange={(v) => { setDelivery(v); setPicked(null); }}
                      options={[
                        { value: 'online',  label: e.catalog.online },
                        { value: 'offline', label: e.catalog.offline },
                      ]}
                    />
                  </div>

                  {/* Slots */}
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {slots.length === 0 && (
                      <div className="col-span-full rounded-2xl border border-dashed border-ink/15 p-6 text-center text-muted dark:border-white/15">
                        {e.detail.noSlots}
                      </div>
                    )}
                    {slots.map((s, i) => {
                      const isPicked =
                        picked && picked.dayKey === s.dayKey && picked.time === s.time;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPicked(isPicked ? null : s)}
                          className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                            isPicked
                              ? 'border-violet bg-violet/10 dark:border-lime dark:bg-lime/10'
                              : 'border-ink/15 hover:border-violet/50 dark:border-white/15 dark:hover:border-lime/50'
                          }`}
                        >
                          <div>
                            <div className="font-display text-base font-bold">
                              {e.detail.days[s.dayKey]}
                            </div>
                            <div className="text-sm text-muted">{s.time}</div>
                          </div>
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${
                              isPicked
                                ? 'border-violet bg-violet text-paper dark:border-lime dark:bg-lime dark:text-ink'
                                : 'border-ink/30 dark:border-white/30'
                            }`}
                          >
                            {isPicked && <span aria-hidden="true">✓</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: signup CTAs */}
                <div className="flex flex-col">
                  <span className="eyebrow">{e.detail.signupEyebrow}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold lg:text-3xl">
                    {e.detail.signupTitle}
                  </h3>
                  <p className="mt-3 text-muted">
                    {picked
                      ? e.detail.signupReady
                          .replace('{day}', e.detail.days[picked.dayKey])
                          .replace('{time}', picked.time)
                      : e.detail.signupHint}
                  </p>

                  <div className="mt-6 grid gap-3">
                    <SignupButton
                      label="Telegram"
                      channel="telegram"
                      message={buildMessage()}
                      variant="ink"
                    />
                    <SignupButton
                      label="Instagram"
                      channel="instagram"
                      message={buildMessage()}
                      variant="ink"
                    />
                    <SignupButton
                      label="WhatsApp"
                      channel="whatsapp"
                      message={buildMessage()}
                      variant="brand"
                    />
                  </div>

                  <p className="mt-5 text-xs text-subtle">{e.detail.signupNote}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ─── helpers ────────────────────────────────────────────────────────────── */

function ToggleGroup({ label, value, onChange, options }) {
  return (
    <div className="inline-flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.25em] text-ink/50 dark:text-white/50">
        {label}
      </span>
      <div className="inline-flex rounded-full border border-ink/15 bg-ink/5 p-1 dark:border-white/15 dark:bg-white/5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              value === o.value
                ? 'bg-violet text-paper dark:bg-lime dark:text-ink'
                : 'text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignupButton({ label, channel, message, variant = 'ink' }) {
  const cls =
    variant === 'brand'
      ? 'bg-violet text-paper hover:bg-violet-600 dark:bg-lime dark:text-ink dark:hover:bg-lime-300'
      : 'bg-ink text-paper hover:bg-ink/90 dark:bg-paper dark:text-ink dark:hover:bg-paper/90';
  return (
    <a
      href={buildContactLink(channel, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 ${cls}`}
    >
      <span className="flex items-center gap-3">
        <SocialIcon channel={channel} />
        <span className="font-semibold">{label}</span>
      </span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

function SocialIcon({ channel }) {
  const common = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.7,
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (channel === 'telegram') {
    return (
      <svg {...common}>
        <path d="M21.5 4.5 3 11l5.5 1.8L10 19l3-3.5 5 4 3.5-15z" />
        <path d="m8.5 12.8 7-5" />
      </svg>
    );
  }
  if (channel === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (channel === 'whatsapp') {
    return (
      <svg {...common}>
        <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 20.4L3 21z" />
        <path d="M9 9.5c0 4 3 7 7 7l1.4-1.5-2.1-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2L9 9.5z" />
      </svg>
    );
  }
  return null;
}
