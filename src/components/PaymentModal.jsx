import { useEffect, useState } from 'react';

/**
 * Мок-модалка оплаты курса. Никаких настоящих платёжных шлюзов — это демо.
 *
 * Props:
 *   open      — boolean: показана ли модалка
 *   programName — название курса для шапки
 *   price       — текст цены (например, '4 900 ₽')
 *   onClose     — закрыть без оплаты
 *   onPaid      — вызвать после "успешной" оплаты
 *   t           — i18n-словарь t.payment (см. translations.js)
 *
 * UX:
 *   1. Карточная форма (фейковая).
 *   2. По нажатию "Оплатить" — небольшая задержка (имитация запроса).
 *   3. Состояние success → onPaid → onClose.
 */
export default function PaymentModal({ open, programName, price, onClose, onPaid, t }) {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');

  // Сбрасываем состояние при закрытии, чтобы при повторном открытии
  // не оставались данные предыдущего курса.
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setCard('');
      setExp('');
      setCvc('');
    }
  }, [open]);

  // ESC закрывает модалку.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isValid = card.replace(/\s/g, '').length >= 12 && exp.length >= 4 && cvc.length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    // Имитируем сетевую задержку, потом помечаем как оплачено.
    setTimeout(() => {
      onPaid?.();
      setLoading(false);
      onClose?.();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl dark:border-white/10 dark:bg-ink">
        <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-violet/20 blur-3xl dark:bg-lime/20" />

        <div className="relative">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
            {t.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{programName}</p>

          <div className="mt-5 flex items-baseline justify-between rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <span className="text-sm text-muted">{t.priceLabel}</span>
            <span className="font-display text-2xl font-bold">{price}</span>
          </div>

          <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-[11px] uppercase tracking-widest text-ink/60 dark:text-white/60">
                {t.cardLabel}
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={card}
                onChange={(e) =>
                  setCard(
                    e.target.value
                      .replace(/[^\d]/g, '')
                      .slice(0, 19)
                      .replace(/(\d{4})(?=\d)/g, '$1 ')
                  )
                }
                className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm tabular-nums outline-none transition focus:border-violet dark:border-white/15 dark:bg-white/[0.03] dark:focus:border-lime"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-ink/60 dark:text-white/60">
                  {t.expLabel}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={exp}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                    setExp(v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                  }}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm tabular-nums outline-none transition focus:border-violet dark:border-white/15 dark:bg-white/[0.03] dark:focus:border-lime"
                />
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-ink/60 dark:text-white/60">
                  CVC
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm tabular-nums outline-none transition focus:border-violet dark:border-white/15 dark:bg-white/[0.03] dark:focus:border-lime"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`btn-primary mt-2 w-full justify-center ${
                !isValid || loading ? 'opacity-60' : ''
              }`}
            >
              {loading ? t.processing : t.submit}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-center text-xs text-subtle hover:text-ink dark:hover:text-paper"
            >
              {t.cancel}
            </button>
          </form>

          <p className="mt-3 text-[11px] leading-snug text-subtle">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
