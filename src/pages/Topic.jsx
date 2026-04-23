import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { TOPICS, getTopicBySlug, getTopicIndex } from '../data/topics.js';
import { useRoadmapProgress } from '../data/useRoadmapProgress.js';

function LockIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Страница отдельной темы: /roadmap/:slug.
 *  - Если slug не существует — редиректим на /roadmap.
 *  - Если тема locked — показываем "замочный" экран с CTA вернуться к карте.
 *  - Иначе — показываем уроки, хайлайты и кнопки mark-done / next.
 */
export default function Topic() {
  const { slug } = useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { completedSet, toggle } = useRoadmapProgress();

  const topic = getTopicBySlug(slug);

  // Неправильный slug — возвращаемся к роадмапу.
  useEffect(() => {
    if (!topic) navigate('/roadmap', { replace: true });
  }, [topic, navigate]);
  if (!topic) return null;

  const topicT = t.roadmap.topics[topic.slug] || {};
  const idx = getTopicIndex(topic.slug);
  const total = TOPICS.length;
  const next = TOPICS[idx + 1] || null;
  const isDone = completedSet.has(topic.slug);

  // ----- Locked screen -----
  if (topic.locked) {
    return (
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28 pb-20">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] bg-glow-violet opacity-50" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] bg-glow-lime opacity-40" />

        <div className="container-narrow relative">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.roadmap.backToMap}
          </Link>

          <div className="mx-auto mt-10 max-w-xl surface-card rounded-2xl p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-ink/15 bg-ink/5 text-ink/60 dark:border-white/15 dark:bg-white/5 dark:text-white/60">
              <LockIcon className="h-8 w-8" />
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-subtle">
              <span>{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-ink/20 dark:text-white/20">·</span>
              <span>{topic.duration}</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight lg:text-4xl">
              {topicT.title}
            </h1>
            <p className="mt-2 text-muted">{topicT.summary}</p>

            <div className="mt-6 rounded-xl border border-ink/10 bg-ink/[0.03] p-4 text-left dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <LockIcon className="h-4 w-4 text-violet dark:text-lime" />
                {t.roadmap.locked}
              </div>
              <p className="mt-2 text-sm text-muted">{t.roadmap.lockedDesc}</p>
            </div>

            <Link to="/roadmap" className="btn-primary mt-6">
              {t.roadmap.backToMap}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ----- Regular topic -----
  const handleToggle = () => toggle(topic.slug);

  const handleNext = () => {
    if (next) navigate(`/roadmap/${next.slug}`);
    else navigate('/roadmap');
  };

  const lessons = Array.isArray(topicT.lessons) ? topicT.lessons : [];
  const highlights = Array.isArray(topicT.highlights) ? topicT.highlights : [];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28 pb-20">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[520px] w-[520px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        {/* Back + progress chip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.roadmap.backToMap}
          </Link>

          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
            {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Header */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-violet/40 bg-violet/10 text-2xl text-violet dark:border-lime/40 dark:bg-lime/10 dark:text-lime">
                {topic.icon}
              </div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-subtle">
                <span>{topic.duration}</span>
                <span className="text-ink/20 dark:text-white/20">·</span>
                <span>{topic.lessons} {t.roadmap.lessons}</span>
                {isDone && (
                  <>
                    <span className="text-ink/20 dark:text-white/20">·</span>
                    <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[10px] text-ink dark:text-lime">
                      {t.roadmap.doneBadge}
                    </span>
                  </>
                )}
              </div>
            </div>

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight lg:text-5xl">
              {topicT.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">{topicT.summary}</p>

            {/* Lessons */}
            <div className="surface-card mt-8 rounded-2xl p-6">
              <div className="eyebrow">{t.roadmap.lessonsTitle}</div>
              <ol className="mt-4 space-y-3">
                {lessons.map((lesson, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-ink/[0.02] dark:hover:bg-white/[0.03]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/15 bg-paper text-xs font-semibold dark:border-white/15 dark:bg-white/5">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm">{lesson}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleToggle}
                className={isDone ? 'btn-ghost' : 'btn-primary'}
              >
                {isDone ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {t.roadmap.unmarkDone}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.roadmap.markDone}
                  </>
                )}
              </button>

              {next && (
                <button type="button" onClick={handleNext} className="btn-ghost">
                  {t.roadmap.nextTopic}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right rail — highlights */}
          <aside className="lg:col-span-1">
            <div className="surface-card sticky top-24 rounded-2xl p-6">
              <div className="eyebrow">{topicT.title}</div>
              <h3 className="mt-2 font-display text-lg font-semibold">
                {t.roadmap.lessonsTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime text-ink">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6.5l2.5 2.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
