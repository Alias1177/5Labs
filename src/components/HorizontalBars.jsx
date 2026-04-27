import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

/**
 * Секция с горизонтальными полосами в палитре бренда.
 * На каждую полосу — большой заголовок (Marketing, Videography и т.д.).
 * Полосы «выезжают» с чередующихся сторон (слева/справа) по мере скролла
 * через эту секцию. Каждая со своим стаггер-задержкой для эффекта волны.
 */
export default function HorizontalBars() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 — секция только что снизу появилась, 1 — полностью проехала верхнюю кромку
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const labels = t.stripes?.items || ['Marketing', 'Videography', 'Branding', 'Strategy', 'Education'];

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
          // Каждая полоса стартует со своей задержкой.
          // step — сколько «скролла» между стартами соседних полос.
          const step = 0.12;
          const local = Math.max(0, Math.min(1, (progress - i * step) / (1 - i * step || 1)));
          // Easing (easeOutCubic) для плавности
          const eased = 1 - Math.pow(1 - local, 3);
          const offset = (1 - eased) * 110; // 110% — чтобы гарантированно уезжала за край
          const translateX = style.from === 'left' ? -offset : offset;

          return (
            <div
              key={i}
              className={`relative w-full ${classByType[style.type]}`}
              style={{
                transform: `translate3d(${translateX}%, 0, 0)`,
                willChange: 'transform',
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
