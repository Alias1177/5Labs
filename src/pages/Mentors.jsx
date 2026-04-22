import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/**
 * Инициалы для плейсхолдера, если фото не подставлено.
 * «Иван Петров» -> «ИП», «Alice» -> «A».
 */
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

/**
 * Круглый аватар с плейсхолдером-инициалами.
 * photo — относительный путь из public/, например '/mentors/1.jpg'.
 * Если изображение не загружается (404 / пусто) — красиво падает в градиент+инициалы.
 */
function Avatar({ photo, name }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(photo) && !failed;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full border border-ink/10 bg-gradient-to-br from-violet/20 via-violet/5 to-lime/20 shadow-xl transition-transform duration-500 group-hover:-translate-y-1 dark:border-white/10 dark:from-violet/40 dark:via-ink dark:to-lime/30">
      {showImage ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-5xl font-bold tracking-tight text-ink/70 dark:text-white/80 sm:text-6xl">
            {getInitials(name) || '5L'}
          </span>
        </div>
      )}
      {/* Glow-кольцо на hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-0 ring-violet/0 transition-all duration-500 group-hover:ring-8 group-hover:ring-violet/20 dark:group-hover:ring-lime/20"
      />
    </div>
  );
}

export default function Mentors() {
  const { t } = useI18n();
  const m = t.mentors;

  return (
    <section className="relative pt-28 pb-24 lg:pt-40 lg:pb-36">
      {/* Декоративное пятно на фоне */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px] dark:bg-violet/30"
      />
      <div className="container-narrow">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{m.eyebrow}</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            {m.title}
          </h1>
          <p className="mt-6 text-lg text-muted">{m.subtitle}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {m.list.map((person, idx) => (
            <Reveal key={idx} as="article" delay={idx * 120} className="group flex flex-col items-center text-center">
              <div className="relative w-40 sm:w-48 lg:w-52">
                <Avatar photo={person.photo} name={person.name} />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold lg:text-2xl">
                {person.name}
              </h3>
              <p className="mt-1 text-sm uppercase tracking-[0.18em] text-violet dark:text-lime">
                {person.role}
              </p>
              <p className="mt-4 w-full max-w-xs rounded-xl border border-ink/15 px-4 py-3 text-left text-sm leading-relaxed text-muted dark:border-white/15">
                {person.bio}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Подсказка для владельца: куда закидывать фотки */}
        <p className="mt-20 text-center text-xs uppercase tracking-[0.2em] text-ink/40 dark:text-white/40">
          public/mentors/1.jpg · 2.jpg · 3.jpg · 4.jpg
        </p>
      </div>
    </section>
  );
}
