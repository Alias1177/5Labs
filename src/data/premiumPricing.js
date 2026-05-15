/**
 * Прайсинг для калькулятора Premium-услуг.
 *
 * Структура:
 *   PREMIUM_SERVICES — каталог услуг. Каждый элемент:
 *     - id        : уникальный код, ссылка из i18n.servicePages.premiumCalc.items
 *     - group     : категория, чтобы сгруппировать в UI ('brand' | 'product')
 *     - price     : цена «от», в выбранной валюте (см. PREMIUM_CURRENCY)
 *
 *   BUNDLE_DISCOUNTS — прогрессивная скидка за количество выбранных услуг.
 *     Применяется как процент от суммы всех выбранных услуг.
 *
 *   PREMIUM_CURRENCY — валюта по умолчанию + форматтер.
 *
 * ВАЖНО: цены ниже — ПЛЕЙСХОЛДЕРЫ. Заменить на реальные перед продакшеном.
 *   Заказчик пришлёт реальные числа — поле `price` остаётся, формула
 *   калькулятора ничего не теряет.
 */

export const PREMIUM_SERVICES = [
  // Брендинг и креатив
  { id: 'logo',          group: 'brand',   price: 1500 },
  { id: 'identity',      group: 'brand',   price: 3500 },
  { id: 'visualConcept', group: 'brand',   price: 2500 },
  { id: 'adCampaign',    group: 'brand',   price: 4000 },
  { id: 'packaging',     group: 'brand',   price: 3000 },

  // Сайт и продукт
  { id: 'website',       group: 'product', price: 5000 },
  { id: 'uxui',          group: 'product', price: 3500 },
  { id: 'cro',           group: 'product', price: 2000 },
  { id: 'support',       group: 'product', price: 1200 },
];

/**
 * Скидка за пакет: чем больше услуг — тем заметнее экономия.
 * Применяется к сумме всех выбранных позиций.
 *
 * Список отсортирован по убыванию `min`. При расчёте берём первую
 * подходящую запись — это держит логику предсказуемой.
 */
export const BUNDLE_DISCOUNTS = [
  { min: 6, percent: 20 },
  { min: 4, percent: 15 },
  { min: 2, percent: 7 },
  { min: 0, percent: 0 },
];

export function getBundleDiscount(count) {
  return BUNDLE_DISCOUNTS.find((d) => count >= d.min) || BUNDLE_DISCOUNTS[BUNDLE_DISCOUNTS.length - 1];
}

/**
 * Валюта для отображения цен. Меняется глобально одной строчкой —
 * UI отрисовывается через formatPrice() ниже.
 */
export const PREMIUM_CURRENCY = {
  code: 'USD',
  // Intl.NumberFormat использует BCP 47 локали; передаём undefined,
  // чтобы взять локаль из браузера, а валюта будет жёстко USD.
  format(value) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: this.code,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      // Безопасный фолбек на случай старого окружения.
      return `$${Math.round(value).toLocaleString()}`;
    }
  },
};

export function formatPrice(value) {
  return PREMIUM_CURRENCY.format(value);
}
