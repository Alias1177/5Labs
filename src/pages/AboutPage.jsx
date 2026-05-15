import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/Reveal.jsx';

/* ─── Mentors section ──────────────────────────────────────────────────────
   Карточки менторов в горизонтальной раскладке:
     - круглое фото слева;
     - имя + роль (фиолетовый/lime) + описание справа.
   Hover-эффект:
     - круг увеличивается (scale-110), внутри фото — лёгкий зум (scale-105);
     - появляется glow-кольцо в фирменном цвете;
     - в углу аватара всплывает иконка Instagram.
   Клик по фото ведёт в Instagram (target="_blank").
*/

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

function Avatar({ photo, name, objectPosition, instagram }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(photo) && !failed;

  const inner = (
    <div className="relative h-full w-full overflow-hidden rounded-full border border-ink/10 bg-gradient-to-br from-violet/20 via-violet/5 to-lime/20 shadow-xl transition-transform duration-500 ease-out group-hover:scale-110 dark:border-white/10 dark:from-violet/40 dark:via-ink dark:to-lime/30">
      {showImage ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          // objectPosition позволяет смещать фокус кропа: '50% 20%' оставит лицо
          // в кадре на портретах, где голова не по центру.
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-4xl font-bold tracking-tight text-ink/70 dark:text-white/80 sm:text-5xl">
            {getInitials(name) || '5L'}
          </span>
        </div>
      )}

      {/* Instagram-бейдж в углу, появляется на hover */}
      {instagram && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 right-1 grid h-7 w-7 translate-y-1 place-items-center rounded-full bg-paper text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-ink dark:text-paper"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </span>
      )}

      {/* Glow-кольцо на hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-0 ring-violet/0 transition-all duration-500 group-hover:ring-8 group-hover:ring-violet/25 dark:group-hover:ring-lime/25"
      />
    </div>
  );

  return (
    <div className="relative aspect-square w-28 shrink-0 sm:w-32 lg:w-36">
      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — Instagram`}
          className="group block h-full w-full"
        >
          {inner}
        </a>
      ) : (
        <div className="group block h-full w-full">{inner}</div>
      )}
    </div>
  );
}

function MentorCard({ person }) {
  return (
    <article className="surface-card flex items-start gap-5 rounded-2xl border border-ink/10 bg-paper/80 p-5 backdrop-blur-sm transition hover:border-violet/40 hover:shadow-[0_18px_40px_-20px_rgba(124,58,237,0.35)] dark:border-white/10 dark:bg-ink/40 dark:hover:border-lime/40 sm:p-6 lg:gap-7 lg:p-7">
      <Avatar
        photo={person.photo}
        name={person.name}
        objectPosition={person.objectPosition}
        instagram={person.instagram}
      />

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-bold leading-tight lg:text-2xl">
          {person.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-violet dark:text-lime lg:text-base">
          {person.role}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted lg:text-[15px]">
          {person.bio}
        </p>
      </div>
    </article>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const { t } = useI18n();
  const m = t.mentors;

  return (
    <>
      {/* Mentors */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px] dark:bg-violet/30"
        />
        <div className="container-narrow">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">{m.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              {m.title}
            </h2>
            <p className="mt-6 text-lg text-muted">{m.subtitle}</p>
          </Reveal>

          {/* Сетка карточек: 1 колонка на мобиле, 2 — на десктопе.
              Сами карточки горизонтальные (фото слева, текст справа). */}
          <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-2 lg:gap-6">
            {m.list.map((person, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <MentorCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
