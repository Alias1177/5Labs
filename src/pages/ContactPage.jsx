import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/* ─── Отдельная страница «Контакты» со всеми нашими данными ──────────────────
   Email, телефон, соцсети + форма обратной связи. */

const EMAIL = 'fivelabssuport@gmail.com';
const PHONE_DISPLAY = '+994 10 434 38 74';
const PHONE_TEL = '+994104343874';

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/5labagency?igsh=bDh5Y2N4OWMwemNu',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fivelabsagency',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@5labagency',
    path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.73z',
  },
];

export default function ContactPage() {
  const { t } = useI18n();
  const c = t.contact;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative pt-28 pb-24 lg:pt-40 lg:pb-32">
      <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1 className="mt-4 font-display text-display font-bold">{c.title}</h1>
          <p className="mt-6 max-w-md text-muted">{c.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* All our data */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-subtle">{c.email}</div>
                <a href={`mailto:${EMAIL}`} className="mt-2 block link-underline text-lg text-ink/85 dark:text-white/85">
                  {EMAIL}
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-subtle">{c.phoneLabel}</div>
                <a href={`tel:${PHONE_TEL}`} className="mt-2 block link-underline text-lg text-ink/85 dark:text-white/85">
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-subtle">{c.socialLabel}</div>
                <div className="mt-3 flex items-center gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink/70 transition hover:border-violet hover:text-violet dark:border-white/15 dark:text-white/70 dark:hover:border-lime dark:hover:text-lime"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={s.path} fill="currentColor" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-violet/40 bg-violet/5 p-12 text-center dark:border-lime/40 dark:bg-lime/5">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-violet text-paper dark:bg-lime dark:text-ink">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10.5l3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-4 font-display text-2xl">{c.thanks}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl surface-card p-8 lg:p-10">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label={c.name} name="name" required />
                  <Field label={c.email} name="email" type="email" required />
                </div>
                <div className="mt-6">
                  <TextArea label={c.message} name="message" required />
                </div>
                <button type="submit" className="btn-primary mt-8 w-full sm:w-auto">
                  {c.submit}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', required }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-subtle">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 block w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30 dark:border-white/10 dark:bg-ink/40 dark:text-paper dark:focus:border-lime dark:focus:ring-lime/30"
      />
    </label>
  );
}

function TextArea({ label, name, required }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-subtle">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="mt-2 block w-full resize-none rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30 dark:border-white/10 dark:bg-ink/40 dark:text-paper dark:focus:border-lime dark:focus:ring-lime/30"
      />
    </label>
  );
}
