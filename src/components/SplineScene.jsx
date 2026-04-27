import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

// Ленивый импорт: Spline-рантайм ~300KB+, грузим только когда секция подъезжает к viewport.
const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * URL вашей экспортированной сцены Spline.
 * Чтобы заменить: File → Export → Code Export → React в Spline app и вставить .splinecode URL.
 */
const SPLINE_SCENE_URL = 'https://prod.spline.design/rUeT8xKXEUhXeOlg/scene.splinecode';

export default function SplineScene() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  // Ленивый монтаж Canvas когда секция приближается к viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleLoad = () => setReady(true);

  const side = t.splineSide || {};
  const items = side.items || [];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="3D motion scene"
    >
      <div className="container-narrow pt-20 lg:pt-28">
        <h2 className="font-display text-display font-bold">
          {t.splineHeading || 'Crafted with motion'}
        </h2>
        <p className="mt-4 max-w-2xl text-muted text-lg">
          {t.splineSubtitle || 'A live 3D space running on an infinite loop.'}
        </p>
      </div>

      <div className="relative mt-10 h-[80vh] min-h-[520px] w-full lg:h-[100vh]">
        {/* мягкое цветное свечение под сценой */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-3xl dark:bg-violet/30" />
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-lime/30 blur-3xl" />
        </div>

        {/* Fallback пока сцена грузится / ещё не в зоне видимости */}
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${
            ready ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={ready}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet/30 border-t-violet dark:border-lime/30 dark:border-t-lime" />
            <span className="text-sm uppercase tracking-widest text-subtle">Loading scene…</span>
          </div>
        </div>

        {/*
          pointer-events-none на обёртке Spline выключает wheel/drag-обработчики
          внутри canvas, так что скролл страницы не триггерит zoom сцены.
          Сама анимация проигрывается в своём цикле независимо.
        */}
        {mounted && (
          <div className="pointer-events-none absolute inset-0">
            <Suspense fallback={null}>
              <Spline scene={SPLINE_SCENE_URL} onLoad={handleLoad} />
            </Suspense>
          </div>
        )}

        {/* ============== OVERLAY TEXT ============== */}

        {/* Большой вертикальный watermark слева */}
        {side.watermark && (
          <div className="pointer-events-none absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 select-none">
            <div
              className="font-display font-black tracking-tighter text-ink/[0.06] dark:text-paper/[0.08] text-[18vw] md:text-[14vw] lg:text-[10vw] leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {side.watermark}
            </div>
          </div>
        )}

        {/* Угловой маркер сверху-справа */}
        {side.corner && (
          <div className="pointer-events-none absolute top-6 right-6 md:top-10 md:right-10 z-10">
            <span className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-subtle">
              {side.corner}
            </span>
          </div>
        )}

        {/* Стек тегов справа по центру */}
        {items.length > 0 && (
          <div className="pointer-events-none absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col items-end gap-4 md:gap-6">
            {items.map((it) => (
              <div key={it.num} className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-violet dark:text-lime">
                  {it.num}
                </span>
                <span className="h-px w-6 bg-ink/30 dark:bg-paper/30" />
                <span className="font-display text-sm md:text-base uppercase tracking-wider text-ink/80 dark:text-paper/80">
                  {it.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Подпись снизу-слева */}
        {side.caption && (
          <div className="pointer-events-none absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
                {side.caption}
              </span>
            </div>
          </div>
        )}

        {/* плавное затухание к фону страницы снизу */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-paper dark:to-ink z-10" />
      </div>
    </section>
  );
}
