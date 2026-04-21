import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function Contact() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up to your backend / mail service
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h2 className="mt-4 font-display text-display font-bold">{t.contact.title}</h2>
            <p className="mt-6 max-w-md text-muted">{t.contact.subtitle}</p>

            <div className="mt-10 space-y-4 text-sm">
              <a href="mailto:hello@5labs.agency" className="block link-underline text-ink/80 dark:text-white/80">
                hello@5labs.agency
              </a>
              <a href="tel:+10000000000" className="block link-underline text-ink/80 dark:text-white/80">
                +1 (000) 000-00-00
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-violet/40 bg-violet/5 p-12 text-center dark:border-lime/40 dark:bg-lime/5">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-violet text-paper dark:bg-lime dark:text-ink">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10.5l3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-4 font-display text-2xl">{t.contact.thanks}</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl surface-card p-8 lg:p-10"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label={t.contact.name} name="name" required />
                  <Field label={t.contact.email} name="email" type="email" required />
                </div>
                <div className="mt-6">
                  <TextArea label={t.contact.message} name="message" required />
                </div>
                <button type="submit" className="btn-primary mt-8 w-full sm:w-auto">
                  {t.contact.submit}
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
