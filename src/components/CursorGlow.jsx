import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeContext.jsx';

/**
 * Зелёная подсветка вокруг курсора. Показывается только в тёмной теме и
 * только на устройствах с точным указателем. Слушатели mousemove работают
 * ВСЕГДА пока устройство поддерживает hover — поэтому при переключении
 * темы подсветка появляется сразу в текущей позиции курсора, без перезагрузки.
 */
export default function CursorGlow() {
  const { theme } = useTheme();
  const glowRef = useRef(null);
  // target — куда стремится glow; pos — где он сейчас (лерп даёт плавность)
  const targetRef = useRef({ x: -2000, y: -2000 });
  const posRef = useRef({ x: -2000, y: -2000 });
  const stateRef = useRef({ hasMoved: false, inside: false });

  const [supported, setSupported] = useState(false);

  // Определяем, поддерживает ли устройство hover (десктоп / лэптоп)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setSupported(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Слушатели + rAF-loop. Зависит только от `supported` и `theme`.
  // Позиция курсора хранится в refs, поэтому переживает переключение темы.
  useEffect(() => {
    if (!supported) return;

    const applyOpacity = () => {
      const el = glowRef.current;
      if (!el) return;
      const shouldShow =
        theme === 'dark' && stateRef.current.hasMoved && stateRef.current.inside;
      el.style.opacity = shouldShow ? '1' : '0';
    };

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      stateRef.current.inside = true;
      if (!stateRef.current.hasMoved) {
        // первый mousemove — телепортируем glow прямо в точку курсора
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        stateRef.current.hasMoved = true;
      }
      applyOpacity();
    };
    const onLeave = () => {
      stateRef.current.inside = false;
      applyOpacity();
    };
    const onEnter = () => {
      stateRef.current.inside = true;
      applyOpacity();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Синхронизируем opacity с новой темой сразу (если курсор не двигается)
    applyOpacity();

    let rafId;
    const loop = () => {
      const el = glowRef.current;
      if (el) {
        posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.18;
        posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.18;
        el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [supported, theme]);

  // На тач-устройствах не рендерим вовсе
  if (!supported) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[520px] w-[520px] opacity-0 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(circle, rgba(198,255,51,0.35) 0%, rgba(198,255,51,0.18) 25%, rgba(198,255,51,0.06) 50%, rgba(198,255,51,0) 70%)',
        mixBlendMode: 'screen',
        filter: 'blur(20px)',
        willChange: 'transform, opacity',
      }}
    />
  );
}
