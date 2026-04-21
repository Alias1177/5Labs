import { useI18n } from '../i18n/I18nContext.jsx';

export default function Stats() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-narrow">
        <div className="rounded-3xl border border-ink/10 bg-gradient-to-br from-violet/10 via-transparent to-lime/15 p-10 dark:border-white/10 lg:p-16">
          <h2 className="font-display text-display font-bold">{t.stats.title}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {t.stats.items.map((item, i) => (
              <div key={i} className="border-l border-ink/15 pl-6 dark:border-white/15">
                <div
                  className={`font-display text-5xl font-bold lg:text-6xl ${
                    i % 2 === 0 ? 'text-violet' : 'text-lime-700 dark:text-lime-400'
                  }`}
                >
                  {item.value}
                </div>
                <div className="mt-3 text-sm uppercase tracking-widest text-subtle">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
