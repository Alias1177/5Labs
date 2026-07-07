import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Свайпы по страницам с тачпада/тача.
 *
 * Поведение:
 *   - Двупальцевый горизонтальный свайп по тачпаду (или touch-свайп на мобиле)
 *     просто шагает по истории браузера: свайп → на шаг назад (как нативный
 *     back), свайп в обратную сторону → на шаг вперёд.
 *   - Работает на всех страницах.
 *   - Если внутри текущей страницы курсор стоит над контейнером, который
 *     умеет горизонтально скроллиться (`overflow-x: auto/scroll`), свайп не
 *     перехватывается — пользователь скроллит контент, а не листает страницы.
 *   - После каждой навигации стоит cooldown 800мс, чтобы один длинный свайп
 *     не пролистал сразу несколько шагов.
 *
 * Реализация:
 *   - `wheel`-события с горизонтальным `deltaX` суммируются в аккумуляторе.
 *     Когда суммарное значение пересекает WHEEL_THRESHOLD — переход.
 *   - На touch-устройствах смотрим `touchstart`/`touchmove` и срабатываем
 *     при достижении TOUCH_THRESHOLD.
 *   - `preventDefault()` на горизонтальном wheel убирает встроенный
 *     back/forward в браузере — иначе он перетягивает на себя свайп.
 */

const WHEEL_THRESHOLD = 80;   // суммарный |deltaX| для срабатывания
const TOUCH_THRESHOLD = 70;   // дистанция пальца в пикселях
const COOLDOWN_MS = 800;      // блок навигации после прыжка
const RESET_MS = 180;         // обнуляем аккумулятор после паузы

function isHorizontallyScrollable(node) {
  let el = node;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.nodeType === 1) {
      const style = window.getComputedStyle(el);
      const ox = style.overflowX;
      if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
        return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

export function usePageSwipe() {
  const navigate = useNavigate();

  const accum = useRef(0);
  const lastNavAt = useRef(0);
  const resetTimer = useRef(null);

  useEffect(() => {
    // Свайп просто шагает по истории браузера (как нативный back/forward),
    // поэтому работает на всех страницах без привязки к списку роутов.
    const goRelative = (delta) => {
      lastNavAt.current = Date.now();
      accum.current = 0;
      navigate(delta); // delta = -1 (назад) | 1 (вперёд)
    };

    const onWheel = (e) => {
      if (Date.now() - lastNavAt.current < COOLDOWN_MS) return;
      // Игнорируем явно вертикальные движения — у трекпадов macOS значения
      // deltaX/deltaY всегда не нулевые на 100%, поэтому сравниваем по сути.
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.5) return;
      if (Math.abs(e.deltaX) < 1) return;
      if (isHorizontallyScrollable(e.target)) return;

      // Гасим встроенный браузерный back/forward на двупальцевом свайпе.
      e.preventDefault();

      accum.current += e.deltaX;

      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        accum.current = 0;
      }, RESET_MS);

      if (accum.current >= WHEEL_THRESHOLD) goRelative(-1);
      else if (accum.current <= -WHEEL_THRESHOLD) goRelative(1);
    };

    // Touch-фолбэк для мобилок.
    let tStartX = 0;
    let tStartY = 0;
    let tHandled = false;
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      tStartX = e.touches[0].clientX;
      tStartY = e.touches[0].clientY;
      tHandled = false;
    };
    const onTouchMove = (e) => {
      if (tHandled || e.touches.length !== 1) return;
      if (Date.now() - lastNavAt.current < COOLDOWN_MS) return;
      const dx = e.touches[0].clientX - tStartX;
      const dy = e.touches[0].clientY - tStartY;
      if (Math.abs(dx) < TOUCH_THRESHOLD) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (isHorizontallyScrollable(e.target)) return;
      tHandled = true;
      goRelative(dx < 0 ? -1 : 1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      clearTimeout(resetTimer.current);
    };
  }, [navigate]);
}
