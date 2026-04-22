import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * При смене роута:
 *   - если есть #hash, плавно скроллим к соответствующей секции;
 *   - иначе — прыгаем в самый верх.
 *
 * Используется один раз внутри <BrowserRouter>, например в App.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Даём маленький tick, чтобы DOM успел отрендериться после смены роута
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
