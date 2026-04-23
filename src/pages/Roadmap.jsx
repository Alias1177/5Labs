import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { TOPICS } from '../data/topics.js';
import { useRoadmapProgress } from '../data/useRoadmapProgress.js';

/**
 * Страница роадмапа.
 *  - Hero с Lottie "roadmap" справа.
 *  - Progress-карточка: X/N пройдено + полоса.
 *  - Зиг-заг из нод-тем (левый/правый сайд чередуется).
 *  - Позади нод — «дорога»: SVG-линия, которая волнисто петляет между центрами
 *    тем-нод. Три слоя: мягкая тень снаружи, серое «асфальтовое» полотно и
 *    пунктирная «разметка» посередине. На мобиле дорогу прячем — там обычный
 *    список с левой пунктирной линией.
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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopicNode({ topic, index, status, t }) {
  const isLeft = index % 2 === 0;
  const topicT = t.roadmap.topics[topic.slug] || {};
  const badge =
    status === 'done'
      ? { text: t.roadmap.doneBadge, cls: 'bg-lime/20 text-ink dark:text-lime' }
      : topic.locked
      ? { text: t.roadmap.lockedBadge, cls: 'bg-ink/10 text-ink/60 dark:bg-white/10 dark:text-white/60' }
      : { text: t.roadmap.freeBadge, cls: 'bg-violet/15 text-violet dark:bg-lime/15 dark:text-lime' };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-4 lg:gap-10">
      {/* Dot on the road (desktop only) */}
      <div className="pointer-events-none hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className={`grid h-16 w-16 place-items-center rounded-full border-4 text-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] ring-4 ring-paper dark:ring-ink transition ${
            status === 'done'
              ? 'border-lime bg-lime text-ink'
              : topic.locked
              ? 'border-ink/20 bg-paper text-ink/60 dark:border-white/20 dark:bg-ink dark:text-white/60'
              : 'border-violet bg-paper text-violet dark:border-lime dark:bg-ink dark:text-lime'
          }`}
        >
          {status === 'done' ? <CheckIcon className="h-6 w-6" /> : <span>{topic.icon}</span>}
        </div>
      </div>

      {/* Card */}
      <div className={`${isLeft ? 'lg:pr-20' : 'lg:col-start-2 lg:pl-20'}`}>
        <Link
          to={`/roadmap/${topic.slug}`}
          className={`group relative block overflow-hidden rounded-2xl border p-5 transition ${
            status === 'done'
              ? 'border-lime/40 bg-lime/5 dark:bg-lime/5'
              : topic.locked
              ? 'border-ink/10 bg-paper/80 backdrop-blur-sm dark:border-white/10 dark:bg-ink/60'
              : 'border-ink/15 bg-paper hover:-translate-y-0.5 hover:border-violet dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-lime'
          }`}
        >
          {!topic.locked && status !== 'done' && (
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-violet/0 via-violet/0 to-violet/10 opacity-0 transition group-hover:opacity-100 dark:from-lime/0 dark:to-lime/10" />
          )}

          <div className="flex items-start gap-4">
            {/* Mobile icon */}
            <div
              className={`lg:hidden grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-xl ${
                status === 'done'
                  ? 'border-lime bg-lime text-ink'
                  : topic.locked
                  ? 'border-ink/20 bg-ink/5 text-ink/60 dark:border-white/20 dark:bg-white/5 dark:text-white/60'
                  : 'border-violet/40 bg-violet/10 text-violet dark:border-lime/40 dark:bg-lime/10 dark:text-lime'
              }`}
            >
              {status === 'done' ? <CheckIcon className="h-5 w-5" /> : <span>{topic.icon}</span>}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-subtle">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-ink/20 dark:text-white/20">·</span>
                <span>
                  {topic.duration} · {topic.lessons} {t.roadmap.lessons}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold leading-tight">
                  {topicT.title || topic.slug}
                </h3>
                {topic.locked && status !== 'done' && (
                  <span className="inline-flex items-center text-ink/40 dark:text-white/40">
                    <LockIcon className="h-4 w-4" />
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-sm text-muted line-clamp-2">{topicT.summary}</p>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${badge.cls}`}
                >
                  {topic.locked && status !== 'done' && <LockIcon className="h-3 w-3" />}
                  {badge.text}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-ink/60 transition group-hover:text-violet dark:text-white/60 dark:group-hover:text-lime">
                  {status === 'done'
                    ? t.roadmap.review
                    : topic.locked
                    ? t.roadmap.continue
                    : t.roadmap.start}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const { t } = useI18n();
  const { completedSet, completed } = useRoadmapProgress();

  const pathContainerRef = useRef(null);
  const itemRefs = useRef([]);
  const [road, setRoad] = useState({ width: 0, height: 0, d: '' });

  // Пересчёт геометрии дороги.
  useLayoutEffect(() => {
    const compute = () => {
      const box = pathContainerRef.current;
      if (!box) return;
      const brect = box.getBoundingClientRect();
      const width = brect.width;
      const height = brect.height;

      const points = itemRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: width / 2,
            y: r.top - brect.top + r.height / 2,
          };
        })
        .filter(Boolean);

      if (points.length < 2) {
        setRoad({ width, height, d: '' });
        return;
      }

      // Строим ломано-волнистую кривую. Между каждой парой точек —
      // кубический Безье, у которого контрольные точки смещены в
      // противоположную сторону (чередуя) от центральной оси.
      // Ограничиваем смещение, чтобы дорога не уезжала за контейнер.
      const maxOffset = Math.min(width * 0.32, 240);
      let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const side = i % 2 === 1 ? 1 : -1; // первая арка уходит вправо
        const off = maxOffset * side;
        const c1x = p0.x + off;
        const c1y = p0.y + (p1.y - p0.y) * 0.35;
        const c2x = p1.x + off;
        const c2y = p0.y + (p1.y - p0.y) * 0.65;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }

      setRoad({ width, height, d });
    };

    compute();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
    if (ro && pathContainerRef.current) ro.observe(pathContainerRef.current);
    window.addEventListener('resize', compute);
    // Небольшая пауза для шрифтов / изображений, которые могут сместить layout.
    const to = setTimeout(compute, 300);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', compute);
      clearTimeout(to);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = TOPICS.length;
    const done = TOPICS.filter((x) => completedSet.has(x.slug)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28 pb-20">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[520px] w-[520px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        {/* Hero */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
              {t.roadmap.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] lg:text-6xl">
              {t.roadmap.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">{t.roadmap.subtitle}</p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full bg-glow-violet opacity-40 blur-3xl dark:bg-glow-lime" />
            <DotLottieReact
              src="/roadmap.json"
              autoplay
              loop
              style={{ width: '100%', maxWidth: '520px', height: '420px' }}
            />
          </div>
        </div>

        {/* Progress card */}
        <div className="surface-card mt-10 rounded-2xl p-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="eyebrow">{t.roadmap.progressTitle}</div>
              <div className="mt-1 text-sm text-muted">
                {stats.done} / {stats.total} {t.roadmap.progressLabel}
              </div>
            </div>
            <div className="font-display text-4xl font-bold tabular-nums">
              {stats.pct}
              <span className="text-ink/40 dark:text-white/40 text-2xl">%</span>
            </div>
          </div>
          <div className="relative mt-5 h-3 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-lime transition-[width] duration-700 ease-out"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>

        {/* Topic path */}
        <div ref={pathContainerRef} className="relative mt-14">
          {/* Road SVG (desktop only) */}
          {road.d && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block z-0"
              width={road.width}
              height={road.height}
              viewBox={`0 0 ${road.width} ${road.height}`}
              style={{ overflow: 'visible' }}
            >
              {/* Мягкая «тень» снаружи дороги */}
              <path
                d={road.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="68"
                className="text-ink/5 dark:text-white/5"
                stroke="currentColor"
              />
              {/* Бордюр */}
              <path
                d={road.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="58"
                className="text-ink/20 dark:text-white/15"
                stroke="currentColor"
              />
              {/* Асфальт */}
              <path
                d={road.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="50"
                className="text-ink/[0.08] dark:text-white/[0.08]"
                stroke="currentColor"
              />
              {/* Разметка — пунктир посередине */}
              <path
                d={road.d}
                fill="none"
                strokeLinecap="round"
                strokeWidth="2.5"
                strokeDasharray="16 14"
                className="text-violet/80 dark:text-lime/80"
                stroke="currentColor"
              />
            </svg>
          )}

          {/* Fallback vertical dashed line for mobile */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-0 h-full w-px lg:hidden"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, currentColor 0 6px, transparent 6px 14px)',
              backgroundSize: '1px 14px',
              color: 'rgba(127,127,127,0.35)',
            }}
          />

          <ol className="relative z-10 space-y-8 lg:space-y-24">
            {TOPICS.map((topic, idx) => {
              const status = completedSet.has(topic.slug) ? 'done' : 'todo';
              return (
                <li
                  key={topic.slug}
                  ref={(el) => (itemRefs.current[idx] = el)}
                >
                  <TopicNode topic={topic} index={idx} status={status} t={t} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
