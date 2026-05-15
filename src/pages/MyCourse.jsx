import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { getProgram } from '../data/educationPrograms.js';
import {
  FREE_LESSONS,
  isLessonUnlocked,
  unlockedLessonsCount,
  useEnrollments,
} from '../data/useEnrollments.js';
import PaymentModal from '../components/PaymentModal.jsx';

/**
 * Страница одного курса в личном кабинете: /my-courses/:slug.
 *
 * Поведение:
 *   - Если пользователь не авторизован — на /login с возвратом сюда.
 *   - Если ещё не записан на курс — редирект на каталог программы.
 *   - Иначе показывает список блоков-уроков, где первые 2 открыты,
 *     остальные закрыты до оплаты. После оплаты — все доступны.
 *   - В шапке курса — прогресс-бар и статус (превью / полный доступ).
 */

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

export default function MyCourse() {
  const { slug } = useParams();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { get, toggleLesson, markPaid } = useEnrollments();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const program = getProgram(slug);
  const enrollment = get(slug);

  // Не залогинен → отправляем на /login с возвратом сюда.
  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(`/my-courses/${slug}`)}`} replace />;
  }
  if (!program) return <Navigate to="/education" replace />;
  // Не записан — отправляем на страницу программы, где можно записаться.
  if (!enrollment) return <Navigate to={`/education/programs/${slug}`} replace />;

  const e = t.educationPage;
  const c = t.course;

  // Собираем блоки уроков из i18n. Структура совпадает с EducationProgram.jsx.
  const topicsRaw = e.detail.topics[program.descKey];
  const topicsData = Array.isArray(topicsRaw)
    ? { blocks: topicsRaw.map((title) => ({ title, desc: '' })) }
    : (topicsRaw || { blocks: [] });
  const blocks = Array.isArray(topicsData.blocks) ? topicsData.blocks : [];
  const total = blocks.length;

  const unlocked = unlockedLessonsCount(enrollment, total);
  const doneCount = (enrollment.progress || []).filter((i) => i < total).length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const previewBlock = !enrollment.paid;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28 pb-20">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.backToDashboard}
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip">
              <span className={`h-1.5 w-1.5 rounded-full ${enrollment.paid ? 'bg-lime' : 'bg-violet dark:bg-lime'}`} />
              {enrollment.paid ? t.myCourses.paidBadge : t.myCourses.previewBadge}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight lg:text-5xl">
              {program.name}
            </h1>
            <p className="mt-3 max-w-xl text-muted">
              {e.catalog.descriptions[program.descKey] || ''}
            </p>
          </div>

          {previewBlock && (
            <button
              type="button"
              onClick={() => setPaymentOpen(true)}
              className="btn-primary"
            >
              <span>💳</span>
              {c.unlockCta}
            </button>
          )}
        </div>

        {/* Status card */}
        <div
          className={`mt-8 rounded-2xl border p-6 ${
            enrollment.paid
              ? 'border-lime/40 bg-lime/5'
              : 'border-violet/40 bg-violet/10 dark:border-lime/40 dark:bg-lime/10'
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="eyebrow">
                {enrollment.paid ? c.paidEyebrow : c.previewEyebrow}
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">
                {enrollment.paid ? c.paidTitle : c.previewTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {enrollment.paid ? c.paidDesc : c.previewDesc}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-subtle">
                {c.progressTitle}
              </div>
              <div className="font-display text-3xl font-bold tabular-nums">
                {percent}
                <span className="text-ink/40 dark:text-white/40 text-2xl">%</span>
              </div>
              <div className="text-xs text-muted">
                {t.myCourses.lessonsDoneOf
                  .replace('{done}', String(doneCount))
                  .replace('{total}', String(total))}
              </div>
            </div>
          </div>
          <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-lime transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Lessons */}
        {blocks.length === 0 ? (
          <div className="surface-card mt-8 rounded-2xl p-8 text-center text-muted">
            {c.noBlocks}
          </div>
        ) : (
          <ol className="mt-8 space-y-3">
            {blocks.map((b, i) => {
              const unlockedHere = isLessonUnlocked(enrollment, i, total);
              const isDone = (enrollment.progress || []).includes(i);

              return (
                <li
                  key={i}
                  className={`relative overflow-hidden rounded-2xl border p-5 transition ${
                    unlockedHere
                      ? isDone
                        ? 'border-lime/50 bg-lime/5'
                        : 'border-ink/15 bg-paper hover:border-violet dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-lime'
                      : 'border-ink/10 bg-ink/[0.02] dark:border-white/10 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-sm font-semibold ${
                          isDone
                            ? 'border-lime bg-lime text-ink'
                            : unlockedHere
                            ? 'border-violet/40 bg-violet/10 text-violet dark:border-lime/40 dark:bg-lime/10 dark:text-lime'
                            : 'border-ink/15 bg-ink/5 text-ink/40 dark:border-white/15 dark:bg-white/5 dark:text-white/40'
                        }`}
                      >
                        {isDone ? <CheckIcon className="h-5 w-5" /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest">
                          <span className="text-subtle">
                            {c.block} {i + 1}
                          </span>
                          {i < FREE_LESSONS && !enrollment.paid && (
                            <span className="rounded-full bg-lime/20 px-2 py-0.5 text-ink dark:text-lime">
                              {c.free}
                            </span>
                          )}
                          {!unlockedHere && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-0.5 text-ink/60 dark:bg-white/10 dark:text-white/60">
                              <LockIcon className="h-3 w-3" />
                              {c.locked}
                            </span>
                          )}
                        </div>
                        <h3
                          className={`mt-1.5 font-display text-lg font-semibold leading-snug ${
                            unlockedHere ? '' : 'text-ink/60 dark:text-white/60'
                          }`}
                        >
                          {b.title}
                        </h3>
                        {b.desc && (
                          <p className={`mt-2 text-sm ${unlockedHere ? 'text-muted' : 'text-ink/40 dark:text-white/40'}`}>
                            {b.desc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {unlockedHere ? (
                        <button
                          type="button"
                          onClick={() => toggleLesson(slug, i)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            isDone
                              ? 'border-lime bg-lime text-ink'
                              : 'border-ink/20 hover:border-violet hover:text-violet dark:border-white/20 dark:hover:border-lime dark:hover:text-lime'
                          }`}
                          aria-pressed={isDone}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                          {c.markDone}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPaymentOpen(true)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-violet px-3 py-1.5 text-xs font-semibold text-paper transition hover:brightness-110 dark:bg-lime dark:text-ink"
                        >
                          <LockIcon className="h-3.5 w-3.5" />
                          {c.unlockCta}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Footer locked banner — appears only in preview mode */}
        {previewBlock && total > unlocked && (
          <div className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet/40 bg-violet/10 text-violet dark:border-lime/40 dark:bg-lime/10 dark:text-lime">
                <LockIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-base font-bold">{c.lessonLocked}</div>
                <p className="mt-0.5 text-sm text-muted">{c.lessonLockedDesc}</p>
              </div>
            </div>
            <button type="button" onClick={() => setPaymentOpen(true)} className="btn-primary">
              {c.unlockCta}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <PaymentModal
        open={paymentOpen}
        programName={program.name}
        price={t.payment.defaultPrice}
        onClose={() => setPaymentOpen(false)}
        onPaid={() => markPaid(slug)}
        t={t.payment}
      />
    </section>
  );
}
