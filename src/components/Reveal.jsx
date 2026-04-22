import { useEffect, useRef, useState } from 'react';

/**
 * Обёртка для плавного появления виджета при попадании в область видимости.
 *
 * Использование:
 *   <Reveal>
 *     <Section />
 *   </Reveal>
 *
 * Пропсы:
 *   - as: тег обёртки (default 'div')
 *   - delay: задержка в мс перед стартом анимации
 *   - y: смещение по Y до анимации (px). default 40
 *   - once: анимировать только первый раз (default true)
 *   - duration: длительность в мс (default 700)
 *   - className: доп. классы
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 40,
  once = true,
  duration = 700,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Уважаем пользовательские настройки reduced motion.
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
