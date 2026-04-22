import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: content */}
          <div className="w-full max-w-md">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-violet dark:bg-lime" />
              {t.notFound.code}
            </span>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] lg:text-6xl">
              {t.notFound.title}
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              {t.notFound.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.notFound.home}
              </Link>
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
                {t.notFound.back}
              </button>
            </div>
          </div>

          {/* Right: Lottie animation */}
          <div className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full bg-glow-violet opacity-40 blur-3xl dark:bg-glow-lime" />
            <DotLottieReact
              src="/404-cat.json"
              autoplay
              loop
              style={{ width: '100%', maxWidth: '560px', height: '560px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
