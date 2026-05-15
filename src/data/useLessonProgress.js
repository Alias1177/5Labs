import { useCallback, useEffect, useState } from 'react';

/**
 * Прогресс по урокам. Храним в localStorage map: { [topicSlug]: number[] },
 * где number[] — индексы пройденных уроков внутри темы.
 *
 * Хук возвращает:
 *   getDone(slug)        — Set<number> завершённых уроков темы
 *   getStats(slug, total)— { done, total, percent }
 *   toggleLesson(slug,i) — переключает урок
 *   markAll(slug, total) — отмечает все уроки темы как пройденные
 *   resetTopic(slug)     — обнуляет прогресс по теме
 *
 * Синхронизация между вкладками — через событие 'storage'.
 */

const KEY = '5labs:lessons';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    // sanitize: каждое значение должно быть массивом чисел
    const out = {};
    for (const [slug, list] of Object.entries(parsed)) {
      if (Array.isArray(list)) {
        out[slug] = list.filter((x) => typeof x === 'number');
      }
    }
    return out;
  } catch {
    return {};
  }
}

function write(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function useLessonProgress() {
  const [map, setMap] = useState(() => read());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== KEY) return;
      setMap(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const getDone = useCallback(
    (slug) => new Set(map[slug] || []),
    [map]
  );

  const getStats = useCallback(
    (slug, total) => {
      const done = (map[slug] || []).length;
      const tot = total || 0;
      const percent = tot > 0 ? Math.round((Math.min(done, tot) / tot) * 100) : 0;
      return { done: Math.min(done, tot), total: tot, percent };
    },
    [map]
  );

  const toggleLesson = useCallback((slug, lessonIndex) => {
    setMap((prev) => {
      const list = Array.isArray(prev[slug]) ? prev[slug] : [];
      const next = list.includes(lessonIndex)
        ? list.filter((x) => x !== lessonIndex)
        : [...list, lessonIndex];
      const updated = { ...prev, [slug]: next };
      write(updated);
      return updated;
    });
  }, []);

  const markAll = useCallback((slug, total) => {
    setMap((prev) => {
      const next = Array.from({ length: total }, (_, i) => i);
      const updated = { ...prev, [slug]: next };
      write(updated);
      return updated;
    });
  }, []);

  const resetTopic = useCallback((slug) => {
    setMap((prev) => {
      const updated = { ...prev, [slug]: [] };
      write(updated);
      return updated;
    });
  }, []);

  return { map, getDone, getStats, toggleLesson, markAll, resetTopic };
}
