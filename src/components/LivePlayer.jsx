import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

/**
 * LivePlayer — HLS-плеер для трансляции с MediaMTX.
 *
 * Пропсы:
 *   src       — URL .m3u8 манифеста (обязателен)
 *   poster    — превью до старта
 *   pollMs    — интервал проверки «живой» ли поток (мс), по умолчанию 10000
 *
 * Использует hls.js. Для Safari/iOS — нативный HLS (без библиотеки).
 */
export default function LivePlayer({ src, poster, pollMs = 10000 }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | live | offline | error

  // Инициализация плеера
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Safari умеет HLS нативно
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      const onMeta = () => setStatus('live');
      const onErr = () => setStatus('offline');
      video.addEventListener('loadedmetadata', onMeta);
      video.addEventListener('error', onErr);
      return () => {
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('error', onErr);
      };
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        backBufferLength: 30,
        maxBufferLength: 10,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus('live'));
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStatus('offline');
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          setStatus('error');
          hls.destroy();
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    setStatus('error');
  }, [src]);

  // Пинг манифеста — переключаем offline → live при появлении эфира
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(src, { method: 'GET', cache: 'no-store' });
        if (cancelled) return;
        if (res.ok && status === 'offline') {
          hlsRef.current?.loadSource(src);
          hlsRef.current?.startLoad();
          setStatus('live');
        } else if (!res.ok) {
          setStatus('offline');
        }
      } catch {
        if (!cancelled) setStatus('offline');
      }
    };
    const id = setInterval(check, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [src, pollMs, status]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black ring-1 ring-ink/10 dark:ring-white/10">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        autoPlay
        muted
        className="h-full w-full"
      />

      {/* Бэйдж статуса */}
      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
        <span
          className={
            'inline-block h-2 w-2 rounded-full ' +
            (status === 'live'
              ? 'animate-pulse bg-red-500'
              : status === 'loading'
              ? 'animate-pulse bg-yellow-400'
              : 'bg-gray-400')
          }
        />
        {status === 'live' && 'В эфире'}
        {status === 'loading' && 'Подключение…'}
        {status === 'offline' && 'Эфир ещё не начался'}
        {status === 'error' && 'Ошибка плеера'}
      </div>
    </div>
  );
}
