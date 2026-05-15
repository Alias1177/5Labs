import { Link } from 'react-router-dom';
import LivePlayer from '../components/LivePlayer.jsx';

/**
 * /education/seminars/free — страница бесплатной live-трансляции.
 *
 * URL HLS-манифеста — из Vite env:
 *   .env.local
 *   VITE_HLS_FREE_URL=http://localhost:8888/free/index.m3u8
 *
 * (для прода через cloudflared — пропиши свой https-URL)
 */
export default function EducationSeminarsLive() {
  const hlsUrl =
    import.meta.env.VITE_HLS_FREE_URL || 'http://localhost:8888/free/index.m3u8';

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-glow-violet opacity-25"
      />

      <div className="container-narrow relative">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/55 dark:text-white/55">
          <Link to="/education" className="link-underline hover:text-ink dark:hover:text-paper">
            Образование
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/education/seminars" className="link-underline hover:text-ink dark:hover:text-paper">
            Семинары
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-violet dark:text-lime">Бесплатные</span>
        </div>

        <span className="eyebrow">Бесплатно · Live</span>
        <h1 className="mt-5 font-display font-bold leading-[1.04] text-[clamp(2.25rem,5vw,3.75rem)]">
          Бесплатный семинар
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Открытая прямая трансляция. Если эфир ещё не начался — плеер сам подхватит поток, как только он появится.
        </p>

        <div className="mt-10">
          <LivePlayer src={hlsUrl} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-paper/70 p-5 text-sm dark:border-white/10 dark:bg-ink/40">
            <h2 className="font-display text-base font-bold">Как смотреть</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>Обновлять страницу не нужно — поток подключится сам.</li>
              <li>Задержка ~2–5 секунд (LL-HLS).</li>
              <li>Если видео не идёт — проверь интернет или перезагрузи.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper/70 p-5 text-sm dark:border-white/10 dark:bg-ink/40">
            <h2 className="font-display text-base font-bold">Вопросы в эфире</h2>
            <p className="mt-3 text-muted">
              Пиши в Telegram / WhatsApp прямо во время трансляции — ссылки внизу страницы.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
