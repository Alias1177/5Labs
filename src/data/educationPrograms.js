/**
 * Каталог обучающих программ + расписания + контакты для записи.
 *
 * Программы — фиксированные «бренд-нейминг»: SMM Standart, Marketing, Meta и т.д.
 * Имена не переводятся (это, по сути, торговые названия). Описания и темы
 * лежат в /src/i18n/translations.js под educationPage.catalog.descriptions
 * и educationPage.detail.topics — связаны через `descKey`.
 *
 * accent определяет тему карточки:
 *  - 'violet' — фиолетовая полоса/обводка
 *  - 'lime'   — лаймовая
 *  - 'inverse'— чёрная (или белая в тёмной теме)
 *
 * duration:
 *  - { months: N } — известная длительность; форматируется через
 *    educationPage.catalog.durations[String(N)] (1 / 1.5 / 2 — есть ключи).
 *  - null — длительность не зафиксирована (показываем «По запросу»).
 */
export const PROGRAMS = [
  { slug: 'smm-standart',             name: 'SMM Standart',              duration: { months: 1 },   accent: 'violet',  descKey: 'smmStandart' },
  { slug: 'smm-professional',         name: 'SMM Professional',          duration: { months: 1.5 }, accent: 'lime',    descKey: 'smmProfessional' },
  { slug: 'marketing',                name: 'Marketing',                 duration: { months: 2 },   accent: 'inverse', descKey: 'marketing' },
  { slug: 'mobilography',             name: 'Mobilography',              duration: { months: 1 },   accent: 'violet',  descKey: 'mobilography' },
  { slug: 'meta',                     name: 'Meta',                      duration: { months: 1 },   accent: 'lime',    descKey: 'meta' },
  { slug: 'prompt-engineering',       name: 'Prompt Engineering',        duration: null,            accent: 'inverse', descKey: 'promptEngineering' },
  { slug: 'graphic-design',           name: 'Graphic Design',            duration: null,            accent: 'violet',  descKey: 'graphicDesign' },
  { slug: 'black-magic',              name: 'Black Magic',               duration: { months: 1 },   accent: 'lime',    descKey: 'blackMagic' },
  { slug: 'black-magic-mobilography', name: 'Black Magic + Mobilography', duration: { months: 2 },  accent: 'inverse', descKey: 'blackMagicMobilography' },
];

/** Поиск программы по slug, удобно использовать в маршруте `/programs/:slug`. */
export function getProgram(slug) {
  return PROGRAMS.find((p) => p.slug === slug) || null;
}

/**
 * Скелет расписания. На странице программы пользователь выбирает один слот
 * и идёт писать менеджеру в мессенджер с предзаполненным сообщением.
 * Реальные дни/часы заказчик подставит сам — это разумные дефолты.
 */
export const SCHEDULE = {
  online: [
    { dayKey: 'mon', time: '19:00 – 21:00' },
    { dayKey: 'wed', time: '19:00 – 21:00' },
    { dayKey: 'fri', time: '19:00 – 21:00' },
    { dayKey: 'sat', time: '11:00 – 13:00' },
  ],
  offline: [
    { dayKey: 'tue', time: '19:00 – 21:00' },
    { dayKey: 'thu', time: '19:00 – 21:00' },
    { dayKey: 'sat', time: '14:00 – 17:00' },
  ],
};

/**
 * Ближайшие семинары. Реальные даты заказчик подставит сам.
 * titleKey ссылается на educationPage.seminars.list.<key>.
 */
export const SEMINARS = [
  { slug: 'smm-intensive-may',      date: '2026-05-18', durationDays: 2, seats: 30, accent: 'violet',  titleKey: 'smmIntensive' },
  { slug: 'mobilography-workshop',  date: '2026-06-04', durationDays: 1, seats: 20, accent: 'lime',    titleKey: 'mobilographyWorkshop' },
  { slug: 'ai-marketing',           date: '2026-06-21', durationDays: 1, seats: 50, accent: 'inverse', titleKey: 'aiMarketing' },
];

/**
 * Контакты для записи. ЗАГЛУШКИ — заменить на реальные перед продакшеном.
 *  - telegram: ссылка вида https://t.me/<username> (открывает чат с менеджером).
 *  - instagram: ссылка вида https://ig.me/m/<username> (диплинк в Direct).
 *  - whatsapp: https://wa.me/<phone> без + и пробелов.
 */
export const CONTACT_LINKS = {
  telegram: 'https://t.me/fivelabsagency',
  instagram: 'https://ig.me/m/fivelabsagency',
  whatsapp: 'https://wa.me/905555555555',
};

/**
 * Собирает ссылку на мессенджер с предзаполненным сообщением.
 *  - WhatsApp поддерживает ?text=URLENC — показываем и предзаполнённый текст.
 *  - Telegram «коробочно» preset не поддерживает (только если это бот),
 *    но мы всё равно прокидываем ?text= — на случай, если линк ведёт на бота.
 *  - Instagram ig.me/m/ предзаполнения не умеет — открываем чистый чат.
 *    Менеджер увидит первое сообщение от пользователя как «текстом из шаблона»
 *    скопированный — это уже UX вне нашей зоны.
 */
export function buildContactLink(channel, message) {
  const base = CONTACT_LINKS[channel];
  if (!base) return '#';
  const encoded = encodeURIComponent(message || '');
  if (channel === 'whatsapp' && encoded) return `${base}?text=${encoded}`;
  if (channel === 'telegram' && encoded) return `${base}?text=${encoded}`;
  return base;
}
