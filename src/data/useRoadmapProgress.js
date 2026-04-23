import { useCallback, useEffect, useState } from 'react';

/**
 * Прогресс по роадмапу хранится в localStorage как массив slug'ов
 * завершённых тем. Хук возвращает:
 *   completedSet — Set<string> для O(1) проверки
 *   toggle(slug) — переключает отметку «завершено»
 *   markDone(slug) / unmark(slug) — императивные варианты
 *
 * Синхронизируется между вкладками через событие 'storage'.
 */

const KEY = '5labs:roadmap';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function useRoadmapProgress() {
  const [completed, setCompleted] = useState(() => read());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== KEY) return;
      setCompleted(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markDone = useCallback((slug) => {
    setCompleted((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      write(next);
      return next;
    });
  }, []);

  const unmark = useCallback((slug) => {
    setCompleted((prev) => {
      const next = prev.filter((x) => x !== slug);
      write(next);
      return next;
    });
  }, []);

  const toggle = useCallback((slug) => {
    setCompleted((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((x) => x !== slug)
        : [...prev, slug];
      write(next);
      return next;
    });
  }, []);

  const completedSet = new Set(completed);

  return { completed, completedSet, markDone, unmark, toggle };
}
