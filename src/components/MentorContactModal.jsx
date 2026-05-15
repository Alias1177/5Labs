import { useEffect } from 'react';
import { buildContactLink } from '../data/educationPrograms.js';

/**
 * Модалка «Свяжитесь с ментором» — открывается при нажатии «Записаться».
 *
 * Содержит три кнопки мессенджеров (Telegram / Instagram / WhatsApp) с
 * предзаполненным сообщением о записи и CTA «Открыть в кабинете».
 *
 * Props:
 *   open         — boolean: показана ли
 *   programName  — название курса (для шапки)
 *   message      — заранее собранное сообщение для менеджера (та же логика,
 *                  что использовалась в нижнем блоке)
 *   isNew        — true, если пользователь только что записался (тогда
 *                  показываем «поздравляем + первые 2 урока открыты»)
 *   onOpenCabinet — клик по «Открыть в кабинете»
 *   onClose      — клик по бэкдропу / Esc / «Закрыть»
 *   t            — словарь t.enrollment.modal
 */
export default function MentorContactModal({
  open,
  programName,
  message,
  isNew,
  onOpenCabinet,
  onClose,
  t,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl dark:border-white/10 dark:bg-ink">
        <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-violet/20 blur-3xl dark:bg-lime/20" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet dark:border-lime/40 dark:bg-lime/10 dark:text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
            {t.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight">{t.title}</h2>
          <p className="mt-1 text-sm text-muted">{programName}</p>

          <p className="mt-4 text-sm">{isNew ? t.descNew : t.descExisting}</p>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-widest text-subtle">
              {t.contactTitle}
            </div>
            <div className="mt-2 grid gap-2">
              <ContactRow channel="telegram" label="Telegram" message={message} variant="ink" />
              <ContactRow channel="instagram" label="Instagram" message={message} variant="ink" />
              <ContactRow channel="whatsapp" label="WhatsApp" message={message} variant="brand" />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCabinet}
            className="btn-primary mt-5 w-full justify-center"
          >
            {t.openCabinet}
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full text-center text-xs text-subtle hover:text-ink dark:hover:text-paper"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ channel, label, message, variant }) {
  const cls =
    variant === 'brand'
      ? 'bg-violet text-paper hover:bg-violet-600 dark:bg-lime dark:text-ink dark:hover:bg-lime-300'
      : 'bg-ink text-paper hover:bg-ink/90 dark:bg-paper dark:text-ink dark:hover:bg-paper/90';
  return (
    <a
      href={buildContactLink(channel, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-3 rounded-xl p-3.5 transition hover:-translate-y-0.5 ${cls}`}
    >
      <span className="flex items-center gap-3">
        <SocialIcon channel={channel} />
        <span className="font-semibold">{label}</span>
      </span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

function SocialIcon({ channel }) {
  const common = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.7,
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (channel === 'telegram') {
    return (
      <svg {...common}>
        <path d="M21.5 4.5 3 11l5.5 1.8L10 19l3-3.5 5 4 3.5-15z" />
        <path d="m8.5 12.8 7-5" />
      </svg>
    );
  }
  if (channel === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (channel === 'whatsapp') {
    return (
      <svg {...common}>
        <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 20.4L3 21z" />
        <path d="M9 9.5c0 4 3 7 7 7l1.4-1.5-2.1-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2L9 9.5z" />
      </svg>
    );
  }
  return null;
}
