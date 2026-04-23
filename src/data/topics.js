/**
 * Моковая база тем маркетингового роадмапа.
 *
 * Каждая тема — шаг в программе. Порядок в массиве задаёт порядок на карте.
 * `locked: false` у первых трёх — они бесплатные.
 *
 * Структура темы:
 *   slug        — URL-slug (/roadmap/:slug)
 *   icon        — эмодзи-иконка для ноды
 *   duration    — оценка времени на тему
 *   lessons     — список уроков внутри темы (для страницы темы)
 *   locked      — true, если тема за пейволом (демо)
 *   highlights  — три буллета «что вынесешь» для страницы темы
 *
 * Переводимые поля (title/summary/lessons[i].title/highlights[i])
 * мы храним внутри i18n-словаря (`t.roadmap.topics[slug]`), а здесь —
 * только каркас. Так одну и ту же структуру можно показывать на
 * трёх языках без дублирования данных.
 */

export const TOPICS = [
  {
    slug: 'intro',
    icon: '🧭',
    duration: '15 min',
    locked: false,
    lessons: 3,
  },
  {
    slug: 'audience',
    icon: '🎯',
    duration: '25 min',
    locked: false,
    lessons: 4,
  },
  {
    slug: 'brand',
    icon: '🪄',
    duration: '30 min',
    locked: false,
    lessons: 4,
  },
  {
    slug: 'smm',
    icon: '📱',
    duration: '45 min',
    locked: true,
    lessons: 5,
  },
  {
    slug: 'content',
    icon: '✍️',
    duration: '40 min',
    locked: true,
    lessons: 5,
  },
  {
    slug: 'seo',
    icon: '🔍',
    duration: '50 min',
    locked: true,
    lessons: 6,
  },
  {
    slug: 'email',
    icon: '✉️',
    duration: '35 min',
    locked: true,
    lessons: 4,
  },
  {
    slug: 'performance',
    icon: '🚀',
    duration: '55 min',
    locked: true,
    lessons: 6,
  },
  {
    slug: 'analytics',
    icon: '📊',
    duration: '45 min',
    locked: true,
    lessons: 5,
  },
  {
    slug: 'launch',
    icon: '🔥',
    duration: '60 min',
    locked: true,
    lessons: 6,
  },
];

export function getTopicBySlug(slug) {
  return TOPICS.find((x) => x.slug === slug) || null;
}

export function getTopicIndex(slug) {
  return TOPICS.findIndex((x) => x.slug === slug);
}
