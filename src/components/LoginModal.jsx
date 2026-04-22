import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dialogRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up real auth
    console.log('login attempt', { email });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-2xl dark:border-white/10 dark:bg-ink"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/70 transition hover:bg-ink/5 hover:text-ink dark:border-white/15 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-paper"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: form */}
          <div className="p-8 md:p-10">
            <h2 id="login-title" className="font-display text-3xl font-bold leading-tight">
              Login
            </h2>
            <p className="mt-2 text-sm text-muted">
              Войдите, чтобы продолжить
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-subtle">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30 dark:border-white/15 dark:bg-white/5 dark:text-paper dark:focus:border-lime dark:focus:ring-lime/30"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-widest text-subtle">Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/30 dark:border-white/15 dark:bg-white/5 dark:text-paper dark:focus:border-lime dark:focus:ring-lime/30"
                  placeholder="••••••••"
                />
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-ink/70 dark:text-white/70">
                  <input type="checkbox" className="h-4 w-4 rounded border-ink/30 accent-violet dark:accent-lime" />
                  Remember me
                </label>
                <a href="#" className="link-underline text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Login
              </button>

              <p className="text-center text-sm text-muted">
                Нет аккаунта?{' '}
                <a href="#" className="link-underline text-ink hover:text-violet dark:text-paper dark:hover:text-lime">
                  Зарегистрироваться
                </a>
              </p>
            </form>
          </div>

          {/* Right: Lottie animation */}
          <div className="relative hidden items-center justify-center overflow-hidden bg-ink/[0.03] p-8 md:flex dark:bg-white/[0.03]">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-glow-violet opacity-60 dark:bg-glow-lime" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-glow-lime opacity-40 dark:bg-glow-violet" />
            <DotLottieReact
              src="https://lottie.host/4db68bbd-31f7-4db4-b4e3-8e35d0a0f740/0VVJ8sJjfF.lottie"
              autoplay
              loop
              className="relative h-[360px] w-[360px] lg:h-[440px] lg:w-[440px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
