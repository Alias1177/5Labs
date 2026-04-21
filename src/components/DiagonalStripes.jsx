import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext.jsx';

/**
 * Диагональные полосы в стиле brand palette (Black / Violet / Lime / White).
 * Закреплены в правой части вьюпорта, повёрнуты на -22°.
 * По мере скролла растут в длину (scaleY).
 */
export default function DiagonalStripes() {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
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

  // В светлой теме «черная» полоса — насыщенная, «белая» — светло-серая для читаемости.
  // В тёмной теме наоборот.
  const stripes =
    theme === 'dark'
      ? [
          { color: '#FFFFFF', opacity: 0.92 },
          { color: '#7D39EB', opacity: 0.95 },
          { color: '#C6FF33', opacity: 0.95 },
          { color: '#1A1A1A', opacity: 0.95 },
        ]
      : [
          { color: '#000000', opacity: 0.92 },
          { color: '#7D39EB', opacity: 0.95 },
          { color: '#C6FF33', opacity: 0.95 },
          { color: '#EDEDED', opacity: 0.95 },
        ];

  // Минимальная и максимальная длина (vh) полосы.
  // На загрузке видно ~22vh — они чуть выглядывают. К концу страницы растягиваются до 220vh.
  const startVh = 22;
  const endVh = 220;
  const length = startVh + (endVh - startVh) * progress;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute -top-[10vh] right-[-8vw] flex gap-3 md:gap-4 origin-top"
        style={{
          transform: 'rotate(-22deg)',
          transformOrigin: '50% 0%',
        }}
      >
        {stripes.map((s, i) => (
          <div
            key={i}
            className="rounded-b-[2px] transition-[height] duration-200 ease-out"
            style={{
              width: 'clamp(28px, 5.2vw, 80px)',
              height: `${length}vh`,
              background: s.color,
              opacity: s.opacity,
              // Каждая следующая полоса чуть быстрее/медленнее для «параллакс» эффекта
              transform: `translateY(${(1 - progress) * -10 * (i + 1)}px)`,
              boxShadow:
                s.color === '#C6FF33'
                  ? '0 0 40px rgba(198,255,51,0.35)'
                  : s.color === '#7D39EB'
                  ? '0 0 40px rgba(125,57,235,0.35)'
                  : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
