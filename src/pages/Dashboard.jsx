import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

/**
 * Личный кабинет пользователя.
 *  - прогресс-бар = % закрытых задач от всех задач;
 *  - список задач с чекбоксами (toggle);
 *  - можно добавить новую задачу (живёт только в стейте);
 *  - справа — анимация Scientist (Lottie);
 *  - кнопка logout возвращает на /login.
 *
 * Данные мокированные: берём начальный список из i18n-словаря и
 * храним в useState. В реальном мире это был бы API.
 */
export default function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  // Инициализируем задачи из переводов только один раз.
  // Даже при смене языка — сам список не перезаписываем,
  // чтобы пользователь не потерял свой прогресс.
  const [tasks, setTasks] = useState(() =>
    (t.dashboard.tasks || []).map((task, idx) => ({
      id: `seed-${idx}`,
      title: task.title,
      done: !!task.done,
    }))
  );

  const [newTitle, setNewTitle] = useState('');

  const { completed, total, percent } = useMemo(() => {
    const tot = tasks.length;
    const done = tasks.filter((x) => x.done).length;
    const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
    return { completed: done, total: tot, percent: pct };
  }, [tasks]);

  // Анимируем число прогресса — плавно доезжает до текущего процента.
  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const start = animatedPercent;
    const target = percent;
    if (start === target) return;
    const duration = 600;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const t0 = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t0, 3); // easeOutCubic
      const val = Math.round(start + (target - start) * eased);
      setAnimatedPercent(val);
      if (t0 < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  const toggleTask = (id) => {
    setTasks((list) => list.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  const addTask = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTasks((list) => [
      ...list,
      { id: `user-${Date.now()}`, title, done: false },
    ]);
    setNewTitle('');
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
          </div>

          <Link to="/roadmap" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 13l4-2 4 2 4-2M2 9l4-2 4 2 4-2M2 5l4-2 4 2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.dashboard.openRoadmap}
          </Link>
        </div>

        {/* Main grid: tasks + animation */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left col — progress + tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress card */}
            <div className="surface-card rounded-2xl p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="eyebrow">{t.dashboard.progressTitle}</div>
                  <div className="mt-1 text-sm text-muted">
                    {completed} / {total} {t.dashboard.progressLabel}
                  </div>
                </div>
                <div className="font-display text-4xl font-bold tabular-nums">
                  {animatedPercent}
                  <span className="text-ink/40 dark:text-white/40 text-2xl">%</span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative mt-5 h-3 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-lime transition-[width] duration-700 ease-out"
                  style={{ width: `${animatedPercent}%` }}
                />
                {/* Shine */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-20 -translate-x-full animate-[shine_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{ mixBlendMode: 'overlay' }}
                />
              </div>
              <style>{`
                @keyframes shine {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(400%); }
                }
              `}</style>

              {percent === 100 && total > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs uppercase tracking-widest text-ink dark:text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  {t.dashboard.allDone}
                </div>
              )}
            </div>

            {/* Tasks card */}
            <div className="surface-card rounded-2xl p-6">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="eyebrow">{t.dashboard.tasksTitle}</div>
                  <div className="mt-1 text-sm text-muted">{t.dashboard.tasksSubtitle}</div>
                </div>
              </div>

              {/* Add task form */}
              <form onSubmit={addTask} className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.dashboard.addTaskPh}
                  className="flex-1 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-violet dark:border-white/15 dark:bg-white/5 dark:text-paper dark:focus:border-lime"
                />
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
                  {t.dashboard.add}
                </button>
              </form>

              {/* List */}
              <ul className="mt-5 divide-y divide-ink/5 dark:divide-white/5">
                {tasks.length === 0 && (
                  <li className="py-4 text-sm text-muted">{t.dashboard.empty}</li>
                )}
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="group flex w-full items-center gap-4 py-3 text-left transition hover:bg-ink/[0.02] dark:hover:bg-white/[0.03]"
                    >
                      {/* Checkbox */}
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
                          task.done
                            ? 'border-lime bg-lime text-ink'
                            : 'border-ink/25 bg-transparent dark:border-white/25 group-hover:border-violet dark:group-hover:border-lime'
                        }`}
                        aria-hidden="true"
                      >
                        {task.done && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>

                      {/* Title */}
                      <span
                        className={`flex-1 text-sm transition ${
                          task.done
                            ? 'text-ink/50 line-through dark:text-white/40'
                            : 'text-ink dark:text-paper'
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Status badge */}
                      <span
                        className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${
                          task.done
                            ? 'bg-lime/20 text-ink dark:text-lime'
                            : 'bg-ink/5 text-ink/60 dark:bg-white/5 dark:text-white/60'
                        }`}
                      >
                        {task.done ? t.dashboard.statusDone : t.dashboard.statusOpen}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right col — animation */}
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
    </section>
  );
}
