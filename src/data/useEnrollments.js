import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Хранилище записей пользователя на курсы (PROGRAMS из educationPrograms.js).
 *
 * Структура в localStorage:
 *   {
 *     [programSlug]: {
 *       slug: string,
 *       enrolledAt: ISO-date,
 *       paid: boolean,                 // оплачен ли курс
 *       paidAt: ISO-date | null,
 *       progress: number[],            // индексы пройденных уроков (блоков)
 *     }
 *   }
 *
 * Бизнес-правила:
 *   - FREE_LESSONS = 2 — первые два урока курса всегда открыты после записи.
 *   - Все последующие уроки доступны только после оплаты (paid === true).
 *   - Курсов может быть несколько одновременно — поэтому ключ-объектная карта.
 *
 * Синхронизация между вкладками — через событие 'storage'.
 */

export const FREE_LESSONS = 2;

const KEY = '5labs:enrollments';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out = {};
    for (const [slug, val] of Object.entries(parsed)) {
      if (!val || typeof val !== 'object') continue;
      out[slug] = {
        slug,
        enrolledAt: typeof val.enrolledAt === 'string' ? val.enrolledAt : new Date().toISOString(),
        paid: !!val.paid,
        paidAt: typeof val.paidAt === 'string' ? val.paidAt : null,
        progress: Array.isArray(val.progress)
          ? val.progress.filter((x) => typeof x === 'number')
          : [],
      };
    }
    return out;
  } catch {
    return {};
  }
}

function write(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    // Принудительно эмитим storage event внутри текущего таба, чтобы все
    // потребители хука увидели обновление (по умолчанию storage event не
    // срабатывает в той же вкладке, которая записала значение).
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
  } catch {
    /* ignore */
  }
}

/** Сколько уроков курса разблокировано: 2 после записи, все — после оплаты. */
export function unlockedLessonsCount(enrollment, totalLessons) {
  if (!enrollment) return 0;
  if (enrollment.paid) return totalLessons;
  return Math.min(FREE_LESSONS, totalLessons);
}

/** Проверить, открыт ли конкретный урок (index 0-based). */
export function isLessonUnlocked(enrollment, lessonIndex, totalLessons) {
  if (!enrollment) return false;
  if (enrollment.paid) return true;
  return lessonIndex < Math.min(FREE_LESSONS, totalLessons);
}

export function useEnrollments() {
  const [map, setMap] = useState(() => read());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key !== KEY) return;
      setMap(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const enroll = useCallback((slug) => {
    setMap((prev) => {
      if (prev[slug]) return prev; // уже записан — не перезаписываем
      const next = {
        ...prev,
        [slug]: {
          slug,
          enrolledAt: new Date().toISOString(),
          paid: false,
          paidAt: null,
          progress: [],
        },
      };
      write(next);
      return next;
    });
  }, []);

  const unenroll = useCallback((slug) => {
    setMap((prev) => {
      if (!prev[slug]) return prev;
      const next = { ...prev };
      delete next[slug];
      write(next);
      return next;
    });
  }, []);

  const markPaid = useCallback((slug) => {
    setMap((prev) => {
      const cur = prev[slug];
      if (!cur) return prev;
      const next = {
        ...prev,
        [slug]: { ...cur, paid: true, paidAt: new Date().toISOString() },
      };
      write(next);
      return next;
    });
  }, []);

  const toggleLesson = useCallback((slug, lessonIndex) => {
    setMap((prev) => {
      const cur = prev[slug];
      if (!cur) return prev;
      const list = Array.isArray(cur.progress) ? cur.progress : [];
      const nextList = list.includes(lessonIndex)
        ? list.filter((x) => x !== lessonIndex)
        : [...list, lessonIndex];
      const next = { ...prev, [slug]: { ...cur, progress: nextList } };
      write(next);
      return next;
    });
  }, []);

  const isEnrolled = useCallback((slug) => !!map[slug], [map]);
  const get = useCallback((slug) => map[slug] || null, [map]);

  const list = useMemo(
    () => Object.values(map).sort((a, b) => (a.enrolledAt < b.enrolledAt ? 1 : -1)),
    [map]
  );

  return { map, list, isEnrolled, get, enroll, unenroll, markPaid, toggleLesson };
}
