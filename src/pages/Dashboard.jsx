import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { TOPICS } from '../data/topics.js';
import { useLessonProgress } from '../data/useLessonProgress.js';
import { useRoadmapProgress } from '../data/useRoadmapProgress.js';
import { getProgram } from '../data/educationPrograms.js';
import {
  FREE_LESSONS,
  unlockedLessonsCount,
  useEnrollments,
} from '../data/useEnrollments.js';
import PaymentModal from '../components/PaymentModal.jsx';

/**
 * Личный кабинет.
 *  - Большой общий прогресс-бар убран.
 *  - Каждая тема показана карточкой с собственной "обложкой-фоткой"
 *    (градиент + большая иконка) и собственным прогресс-баром,
 *    который считается по пройденным урокам внутри темы.
 *  - На карточке: кнопка-галочка «отметить все уроки темы»
 *    и кнопка «сбросить». Тап по самой карточке ведёт на тему.
 */

// Палитра обложек для записанных программ. Программ много (10),
// поэтому подбираем градиент по slug. Если не нашли — берём дефолт.
const PROGRAM_COVERS = {
  'smm-standart':              { from: '#7C3AED', to: '#22D3EE' },
  'smm-professional':          { from: '#A78BFA', to: '#F472B6' },
  'marketing':                 { from: '#F472B6', to: '#FB923C' },
  'mobilography':              { from: '#22D3EE', to: '#A3E635' },
  'meta':                      { from: '#60A5FA', to: '#A78BFA' },
  'prompt-engineering':        { from: '#0EA5E9', to: '#22D3EE' },
  'ai-video':                  { from: '#A3E635', to: '#22D3EE' },
  'graphic-design':            { from: '#F43F5E', to: '#FB923C' },
  'black-magic':               { from: '#7C3AED', to: '#F43F5E' },
  'black-magic-mobilography':  { from: '#FB923C', to: '#F472B6' },
};

// Палитра обложек: каждой теме — свой градиент, чтобы карточки
// визуально отличались как настоящие "фотки".
const COVERS = {
  intro:       { from: '#7C3AED', to: '#22D3EE',  badge: 'rgba(124,58,237,0.18)' },
  audience:    { from: '#F472B6', to: '#FB923C',  badge: 'rgba(244,114,182,0.18)' },
  brand:       { from: '#A78BFA', to: '#F472B6',  badge: 'rgba(167,139,250,0.18)' },
  smm:         { from: '#22D3EE', to: '#A3E635',  badge: 'rgba(34,211,238,0.18)' },
  content:     { from: '#FB923C', to: '#FACC15',  badge: 'rgba(251,146,60,0.18)' },
  seo:         { from: '#34D399', to: '#22D3EE',  badge: 'rgba(52,211,153,0.18)' },
  email:       { from: '#60A5FA', to: '#A78BFA',  badge: 'rgba(96,165,250,0.18)' },
  performance: { from: '#F43F5E', to: '#FB923C',  badge: 'rgba(244,63,94,0.18)' },
  analytics:   { from: '#0EA5E9', to: '#22D3EE',  badge: 'rgba(14,165,233,0.18)' },
  launch:      { from: '#A3E635', to: '#22D3EE',  badge: 'rgba(163,230,53,0.18)' },
};

function LockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopicCard({ topic, index, t, lessons, onMarkAll, onReset, onToggleDone, isDone }) {
  const cover = COVERS[topic.slug] || { from: '#7C3AED', to: '#A3E635' };
  const topicT = t.roadmap.topics[topic.slug] || {};
  const totalLessons = topic.lessons || 0;
  const stats = lessons.getStats(topic.slug, totalLessons);

  // На "обложке" — мягкие декоративные кружки, чтобы выглядело как иллюстрация.
  return (
    <div
      className={`group surface-card relative flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] ${
        topic.locked ? 'opacity-95' : ''
      }`}
    >
      {/* Обложка */}
      <Link
        to={`/roadmap/${topic.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.to} 100%)`,
        }}
        aria-label={topicT.title || topic.slug}
      >
        {/* Декоративные круги */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-black/15 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]"
        />

        {/* Номер */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
          <span className="opacity-50">/</span>
          <span className="opacity-70">{String(TOPICS.length).padStart(2, '0')}</span>
        </span>

        {/* Бейдж "готово" / "закрыто" */}
        {isDone ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 shadow-sm">
            <CheckIcon className="h-3 w-3" />
            {t.roadmap.doneBadge}
          </span>
        ) : topic.locked ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            <LockIcon className="h-3 w-3" />
            {t.dashboard.cardLocked}
          </span>
        ) : null}

        {/* "Фотка" — крупная эмодзи-иконка */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-24 w-24 place-items-center rounded-3xl bg-white/95 text-5xl shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] transition group-hover:scale-105">
            {topic.icon}
          </span>
        </span>
      </Link>

      {/* Тело карточки */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-subtle">
          <span>{topic.duration}</span>
          <span className="text-ink/20 dark:text-white/20">·</span>
          <span>
            {totalLessons} {t.dashboard.lessonsCount}
          </span>
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-tight">
          {topicT.title || topic.slug}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{topicT.summary}</p>

        {/* Внутренний прогресс-бар */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink/70 dark:text-white/70">
              {stats.done} / {stats.total} {t.dashboard.lessonsCount}
            </span>
            <span className="font-display font-semibold tabular-nums">
              {stats.percent}
              <span className="text-ink/40 dark:text-white/40">%</span>
            </span>
          </div>
          <div className="relative mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${stats.percent}%`,
                background: `linear-gradient(90deg, ${cover.from}, ${cover.to})`,
              }}
            />
          </div>
        </div>

        {/* Действия */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <Link
            to={`/roadmap/${topic.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-violet dark:text-paper dark:hover:text-lime"
          >
            {topic.locked
              ? t.dashboard.cardLocked
              : isDone
              ? t.dashboard.cardReview
              : stats.percent > 0
              ? t.dashboard.cardContinue
              : t.dashboard.cardStart}
            <ArrowIcon />
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Сброс прогресса */}
            {stats.done > 0 && !topic.locked && (
              <button
                type="button"
                onClick={() => onReset(topic.slug)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-ink/15 text-ink/60 transition hover:border-ink/30 hover:text-ink dark:border-white/15 dark:text-white/60 dark:hover:text-paper"
                title={t.dashboard.cardReset}
                aria-label={t.dashboard.cardReset}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2.5 8a5.5 5.5 0 109.6-3.6M12.5 2v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Галочка: отметить все уроки темы как пройденные */}
            <button
              type="button"
              disabled={topic.locked}
              onClick={() => onMarkAll(topic, isDone)}
              className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
                topic.locked
                  ? 'cursor-not-allowed border-ink/10 text-ink/30 dark:border-white/10 dark:text-white/30'
                  : isDone
                  ? 'border-lime bg-lime text-ink hover:brightness-95'
                  : 'border-ink/20 text-ink/60 hover:border-violet hover:text-violet dark:border-white/20 dark:text-white/60 dark:hover:border-lime dark:hover:text-lime'
              }`}
              title={t.dashboard.cardMarkAll}
              aria-label={t.dashboard.cardMarkAll}
              aria-pressed={isDone}
            >
              <CheckIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Enrolled course card ────────────────────────────────────────────────
   Карточка для блока «Мои курсы»: показывает прогресс по урокам внутри
   программы, статус (превью / оплачено) и CTA «Открыть» либо «Оплатить».
*/
function EnrolledCourseCard({ enrollment, t, e, onPay, onUnenroll }) {
  const program = getProgram(enrollment.slug);
  if (!program) return null;

  const cover = PROGRAM_COVERS[program.slug] || { from: '#7C3AED', to: '#A3E635' };

  const topicsRaw = e.detail.topics[program.descKey];
  const topicsData = Array.isArray(topicsRaw)
    ? { blocks: topicsRaw.map((title) => ({ title })) }
    : (topicsRaw || { blocks: [] });
  const total = Array.isArray(topicsData.blocks) ? topicsData.blocks.length : 0;
  const unlocked = unlockedLessonsCount(enrollment, total);
  const done = (enrollment.progress || []).filter((i) => i < total).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5">
      <Link
        to={`/my-courses/${program.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.to} 100%)`,
        }}
        aria-label={program.name}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-black/15 blur-2xl"
        />
        {/* Status badge */}
        {enrollment.paid ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink shadow-sm">
            <CheckIcon className="h-3 w-3" />
            {t.myCourses.paidBadge}
          </span>
        ) : (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-violet shadow-sm">
            {t.myCourses.previewBadge}
          </span>
        )}
        {/* Big "cover" with program name */}
        <span className="absolute inset-0 grid place-items-center px-6 text-center">
          <span className="font-display text-xl font-bold text-white drop-shadow-md sm:text-2xl">
            {program.name}
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-subtle">
          <span>
            {total} {t.course.lessonsCount}
          </span>
          {!enrollment.paid && (
            <>
              <span className="text-ink/20 dark:text-white/20">·</span>
              <span>{t.myCourses.freeLessons}</span>
            </>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-tight">
          {program.name}
        </h3>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink/70 dark:text-white/70">
              {t.myCourses.lessonsDoneOf
                .replace('{done}', String(done))
                .replace('{total}', String(total))}
            </span>
            <span className="font-display font-semibold tabular-nums">
              {percent}
              <span className="text-ink/40 dark:text-white/40">%</span>
            </span>
          </div>
          <div className="relative mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, ${cover.from}, ${cover.to})`,
              }}
            />
          </div>
          {!enrollment.paid && (
            <div className="mt-2 text-[11px] text-subtle">
              {`${unlocked} / ${total} ${t.course.lessonsCount} — ${t.myCourses.lockedRest}`}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <Link
            to={`/my-courses/${program.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-violet dark:text-paper dark:hover:text-lime"
          >
            {t.myCourses.open}
            <ArrowIcon />
          </Link>

          <div className="flex items-center gap-1.5">
            {!enrollment.paid && (
              <button
                type="button"
                onClick={onPay}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet px-3 py-1.5 text-xs font-semibold text-paper transition hover:brightness-110 dark:bg-lime dark:text-ink"
              >
                {t.myCourses.pay}
              </button>
            )}
            <button
              type="button"
              onClick={onUnenroll}
              className="grid h-8 w-8 place-items-center rounded-lg border border-ink/15 text-ink/60 transition hover:border-rose-500 hover:text-rose-500 dark:border-white/15 dark:text-white/60"
              title={t.myCourses.unenroll}
              aria-label={t.myCourses.unenroll}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 5h10M6 5V3.5A1.5 1.5 0 017.5 2h1A1.5 1.5 0 0110 3.5V5M5 5l1 8.5A1.5 1.5 0 007.5 15h1A1.5 1.5 0 0010 13.5L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const lessons = useLessonProgress();
  const { completedSet, markDone, unmark } = useRoadmapProgress();
  const { list: enrolledList, markPaid, unenroll } = useEnrollments();
  const [payingFor, setPayingFor] = useState(null); // program slug или null

  // Считаем, сколько уроков всего пройдено — для маленькой подписи в шапке.
  const totals = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const tp of TOPICS) {
      const s = lessons.getStats(tp.slug, tp.lessons || 0);
      done += s.done;
      total += s.total;
    }
    return { done, total };
  }, [lessons]);

  const handleMarkAll = (topic, currentlyDone) => {
    if (topic.locked) return;
    if (currentlyDone) {
      // снимаем отметку — обнуляем уроки и убираем тему из roadmap-progress
      lessons.resetTopic(topic.slug);
      unmark(topic.slug);
    } else {
      lessons.markAll(topic.slug, topic.lessons || 0);
      markDone(topic.slug);
    }
  };

  const handleReset = (slug) => {
    lessons.resetTopic(slug);
    unmark(slug);
  };

  const firstName = user?.name?.split(' ')[0] || user?.email || '';

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28 pb-16">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[520px] w-[520px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
              {t.dashboard.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight lg:text-5xl">
              {t.dashboard.greeting}
              {firstName ? `, ${firstName}` : ''} .
            </h1>
            <p className="mt-3 max-w-xl text-muted">{t.dashboard.subtitle}</p>

            {/* Маленькая подпись со счётчиком — без огромного бара */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/70 px-3 py-1 text-xs text-ink/70 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              {totals.done} / {totals.total} {t.dashboard.lessonsDone}
            </div>
          </div>

          <Link to="/roadmap" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 13l4-2 4 2 4-2M2 9l4-2 4 2 4-2M2 5l4-2 4 2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.dashboard.openRoadmap}
          </Link>
        </div>

        {/* Main grid: lesson cards + side animation */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left col — карточки уроков */}
          <div className="lg:col-span-2 space-y-10">
            {/* ─── My courses (enrollments) ──────────────────────────── */}
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="eyebrow">{t.myCourses.eyebrow}</div>
                  <h2 className="mt-1 font-display text-2xl font-bold lg:text-3xl">
                    {t.myCourses.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{t.myCourses.subtitle}</p>
                </div>
                <Link
                  to="/education"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-violet dark:text-paper dark:hover:text-lime"
                >
                  {t.myCourses.browse}
                  <ArrowIcon />
                </Link>
              </div>

              {enrolledList.length === 0 ? (
                <div className="surface-card mt-5 rounded-2xl p-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink/5 text-2xl dark:bg-white/5">
                    📚
                  </div>
                  <p className="mt-3 text-muted">{t.myCourses.empty}</p>
                  <Link to="/education" className="btn-primary mt-4">
                    {t.myCourses.browse}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {enrolledList.map((en) => (
                    <EnrolledCourseCard
                      key={en.slug}
                      enrollment={en}
                      t={t}
                      e={t.educationPage}
                      onPay={() => setPayingFor(en.slug)}
                      onUnenroll={() => {
                        if (window.confirm(t.myCourses.unenrollConfirm)) {
                          unenroll(en.slug);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="eyebrow">{t.dashboard.lessonsTitle}</div>
              <p className="mt-1 text-sm text-muted">{t.dashboard.lessonsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {TOPICS.map((topic, idx) => {
                const isDone = completedSet.has(topic.slug);
                return (
                  <TopicCard
                    key={topic.slug}
                    topic={topic}
                    index={idx}
                    t={t}
                    lessons={lessons}
                    onMarkAll={handleMarkAll}
                    onReset={handleReset}
                    onToggleDone={() => {}}
                    isDone={isDone}
                  />
                );
              })}
            </div>
          </div>

          {/* Right col — animation + email */}
          <div className="lg:col-span-1">
            <div className="surface-card sticky top-24 flex flex-col items-center justify-center rounded-2xl p-4">
              <div className="pointer-events-none absolute inset-0 -z-10 mx-auto rounded-2xl bg-glow-violet opacity-30 blur-3xl dark:bg-glow-lime" />
              <DotLottieReact
                src="/scientist.json"
                autoplay
                loop
                style={{ width: '100%', maxWidth: '360px', height: '360px' }}
              />
              <div className="mt-2 text-center text-xs uppercase tracking-widest text-subtle">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        open={!!payingFor}
        programName={payingFor ? (getProgram(payingFor)?.name || '') : ''}
        price={t.payment.defaultPrice}
        onClose={() => setPayingFor(null)}
        onPaid={() => payingFor && markPaid(payingFor)}
        t={t.payment}
      />
    </section>
  );
}
