import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

/**
 * Секция с горизонтальными полосами в палитре бренда.
 * На каждую полосу — большой заголовок (Marketing, Videography и т.д.).
 * Полосы «выезжают» с чередующихся сторон (слева/справа) по мере скролла
 * через эту секцию. Каждая со своим стаггер-задержкой для эффекта волны.
 *
 * ВАЖНО про производительность:
 *  - НЕ дёргаем React state на скролле (иначе на телефоне жуткие лаги:
 *    каждый scroll-эвент → setState → ре-рендер всего дерева секции).
 *  - Считаем прогресс в обычной переменной, обновляем стиль элементов
 *    напрямую через ref-ы. React в этом не участвует, поэтому скролл
 *    остаётся 60fps.
 *  - Дроссируем через requestAnimationFrame: даже если scroll-эвенты
 *    приходят пачкой, расчёт делается максимум раз за кадр.
 *  - Ставим also `prefers-reduced-motion` — у кого выключены анимации,
 *    показываем полосы сразу на месте без анимации.
 */
export default function HorizontalBars() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const barsRef = useRef([]);

  // Стиль полосы: цвет + направление въезда.
  // type: 'violet' | 'lime' | 'inverse'
  const styles = [
    { type: 'violet', from: 'left' },
    { type: 'lime', from: 'right' },
    { type: 'inverse', from: 'left' },
    { type: 'violet', from: 'right' },
    { type: 'lime', from: 'left' },
  ];

  // Классы по типу (адаптируется под тему)
  const classByType = {
    violet: 'bg-violet text-paper',
    lime: 'bg-lime text-ink',
    // В светлой теме — чёрная полоса с белым текстом;
    // В тёмной — белая полоса с чёрным текстом.
    inverse: 'bg-ink text-paper dark:bg-paper dark:text-ink',
  };

  const labels = t.stripes?.items || ['Marketing', 'Videography', 'Branding', 'Strategy', 'Education'];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Если у пользователя выключены анимации — ставим полосы на 0% сразу
    // и не подписываемся на скролл вообще.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      barsRef.current.forEach((el) => {
        if (el) el.style.transform = 'translate3d(0,0,0)';
      });
      return;
    }

    let rafId = 0;
    let queued = false;

    const compute = () => {
      queued = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));

      const step = 0.12;
      const bars = barsRef.current;
      for (let i = 0; i < bars.length; i++) {
        const el = bars[i];
        if (!el) continue;
        const style = styles[i % styles.length];
        const denom = 1 - i * step || 1;
        const local = Math.max(0, Math.min(1, (progress - i * step) / denom));
        const eased = 1 - Math.pow(1 - local, 3);
        const offset = (1 - eased) * 110;
        const tx = style.from === 'left' ? -offset : offset;
        el.style.transform = `translate3d(${tx}%, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(compute);
    };

    // Первичный расчёт
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // styles — стабильный массив-литерал, ESLint доволен; меняется только labels.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24">
      <div className="container-narrow mb-10">
        <h2 className="font-display text-display font-bold">
          {t.stripes?.heading || 'What we do'}
        </h2>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {labels.map((label, i) => {
          const style = styles[i % styles.length];
          // Стартовое смещение, чтобы до первого расчёта полосы были за краем
          // (а не вспышкой появлялись на месте).
          const initialOffset = style.from === 'left' ? -110 : 110;
          return (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)}
              className={`relative w-full ${classByType[style.type]}`}
              style={{
                transform: `translate3d(${initialOffset}%, 0, 0)`,
                willChange: 'transform',
                // На iOS-Safari это даёт более плавный композитинг
                backfaceVisibility: 'hidden',
              }}
            >
              <div
                className={`flex items-center gap-6 px-6 py-6 md:px-12 md:py-8 lg:py-10 ${
                  style.from === 'left' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span className="font-display font-bold uppercase tracking-tight leading-none text-[clamp(2.25rem,7vw,6rem)]">
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[clamp(1.25rem,2vw,1.75rem)] font-display opacity-70 ${
                    style.from === 'left' ? 'order-first' : ''
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
