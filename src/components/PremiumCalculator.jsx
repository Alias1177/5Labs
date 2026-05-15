import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import {
  PREMIUM_SERVICES,
  formatPrice,
  getBundleDiscount,
} from '../data/premiumPricing.js';

/**
 * Калькулятор премиум-услуг.
 *
 * Поведение:
 *   - Услуги отрисовываются как чек-листы, сгруппированные по category
 *     ('brand' / 'product'). Лейблы и описания берутся из i18n
 *     (servicePages.premiumCalc.items[id]).
 *   - При клике по карточке услуга добавляется/убирается из выбора;
 *     сумма и применённая скидка пересчитываются мгновенно (useMemo).
 *   - В нижней «итоговой» панели показываем:
 *       • количество выбранных услуг
 *       • сумму без скидки (зачёркнутая, если скидка > 0)
 *       • процент скидки и итог
 *       • кнопку «Отправить бриф» (на /#contact)
 *
 * Прогрессивная скидка — в premiumPricing.js (BUNDLE_DISCOUNTS):
 *   2+ → 7%, 4+ → 15%, 6+ → 20%. Применяется ко всей сумме выбранного.
 *
 * Цены — плейсхолдеры в premiumPricing.js, формат вывода — formatPrice().
 */
export default function PremiumCalculator() {
  const { t } = useI18n();
  const calc = t.servicePages?.premiumCalc;
  const [selected, setSelected] = useState(() => new Set());

  // Группируем услуги по категориям один раз — содержимое массива не меняется.
  const groups = useMemo(() => {
    const map = new Map();
    PREMIUM_SERVICES.forEach((s) => {
      if (!map.has(s.group)) map.set(s.group, []);
      map.get(s.group).push(s);
    });
    return Array.from(map.entries()); // [['brand', [...]], ['product', [...]]]
  }, []);

  // Сводка по выбранному набору. Пересчитывается только когда
  // меняется selected — никаких лишних рендеров.
  const summary = useMemo(() => {
    const items = PREMIUM_SERVICES.filter((s) => selected.has(s.id));
    const subtotal = items.reduce((acc, s) => acc + s.price, 0);
    const discount = getBundleDiscount(items.length);
    const discountAmount = Math.round((subtotal * discount.percent) / 100);
    const total = subtotal - discountAmount;
    return { count: items.length, subtotal, discount, discountAmount, total };
  }, [selected]);

  // Toggle без мутации Set — создаём новый, чтобы React увидел изменение.
  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Защита: если вдруг переводов калькулятора нет (старая локаль), не падаем.
  if (!calc) return null;

  return (
    <section className="relative pb-24 lg:pb-28">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl border border-lime-500/50 bg-gradient-to-br from-lime/15 via-transparent to-transparent p-6 dark:border-lime/40 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-lime/30 blur-3xl"
          />

          <div className="relative">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-lime-700 dark:text-lime-400">
              {calc.eyebrow}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold lg:text-5xl">
              {calc.title}
            </h2>
            <p className="mt-4 max-w-2xl text-muted lg:text-lg">{calc.subtitle}</p>

            {/* Группы чек-листов */}
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {groups.map(([group, items]) => (
                <div key={group}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-700 dark:text-lime-400">
                    {calc.groups?.[group] || group}
                  </div>
                  <ul className="mt-4 grid gap-3">
                    {items.map((s) => {
                      const isOn = selected.has(s.id);
                      const meta = calc.items?.[s.id] || {};
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            aria-pressed={isOn}
                            onClick={() => toggle(s.id)}
                            className={`group flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                              isOn
                                ? 'border-lime-500 bg-lime/15 dark:border-lime dark:bg-lime/10'
                                : 'border-ink/15 bg-paper hover:border-lime-500/60 dark:border-white/15 dark:bg-ink/40 dark:hover:border-lime/50'
                            }`}
                          >
                            <span className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                                  isOn
                                    ? 'border-lime-600 bg-lime text-ink dark:border-lime'
                                    : 'border-ink/30 dark:border-white/30'
                                }`}
                                aria-hidden="true"
                              >
                                {isOn && (
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                      d="M2.5 6.5l2.5 2.5L9.5 4"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>
                              <span>
                                <span className="block font-display text-base font-bold leading-tight">
                                  {meta.title || s.id}
                                </span>
                                {meta.desc && (
                                  <span className="mt-1 block text-sm text-muted">
                                    {meta.desc}
                                  </span>
                                )}
                              </span>
                            </span>
                            <span className="shrink-0 whitespace-nowrap text-right">
                              <span className="text-[10px] uppercase tracking-widest text-subtle">
                                {calc.fromLabel}
                              </span>
                              <span className="block font-display text-sm font-bold tabular-nums">
                                {formatPrice(s.price)}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 rounded-2xl border border-ink/10 bg-paper/60 p-6 backdrop-blur dark:border-white/10 dark:bg-ink/40 lg:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-subtle">
                    {calc.summary.eyebrow}
                  </div>
                  <div className="mt-2 flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-4xl font-bold tabular-nums lg:text-5xl">
                      {formatPrice(summary.total)}
                    </span>
                    {summary.discount.percent > 0 && (
                      <>
                        <span className="text-base text-muted line-through tabular-nums">
                          {formatPrice(summary.subtotal)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-500/50 bg-lime/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-lime-800 dark:border-lime/40 dark:text-lime-300">
                          −{summary.discount.percent}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted">
                    {summary.count === 0
                      ? calc.summary.empty
                      : (calc.summary.selected || '')
                          .replace('{count}', String(summary.count))}
                    {summary.discount.percent > 0 && (
                      <>
                        {' · '}
                        {(calc.summary.discount || '')
                          .replace('{percent}', String(summary.discount.percent))}
                      </>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-subtle">{calc.summary.note}</p>
                </div>

                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-lime-300 dark:bg-lime dark:text-ink"
                  aria-disabled={summary.count === 0}
                >
                  {calc.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
