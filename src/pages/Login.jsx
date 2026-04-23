import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(null); // 'email' | 'password' | null

  // Refs для измерения позиций полей и общий индикатор
  const wrapperRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [box, setBox] = useState({ top: 0, left: 0, width: 0, height: 0, visible: false });

  const measure = (which) => {
    const wrap = wrapperRef.current;
    const target = which === 'email' ? emailRef.current : which === 'password' ? passwordRef.current : null;
    if (!wrap || !target) {
      setBox((s) => ({ ...s, visible: false }));
      return;
    }
    const wr = wrap.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    setBox({
      top: tr.top - wr.top,
      left: tr.left - wr.left,
      width: tr.width,
      height: tr.height,
      visible: true,
    });
  };

  useLayoutEffect(() => {
    if (active) measure(active);
    else setBox((s) => ({ ...s, visible: false }));
  }, [active]);

  useEffect(() => {
    const onResize = () => active && measure(active);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  // Геометрия "змейки" — центр штриха сажаем ровно на серую рамку инпута
  const strokeW = 2;
  const borderW = 1; // rounded-xl border-1 на инпуте
  const inset = borderW / 2; // центр серой рамки = 0.5px от bounding rect
  const radius = 12; // rounded-xl
  const rectW = Math.max(0, box.width - 2 * inset);
  const rectH = Math.max(0, box.height - 2 * inset);
  const rx = Math.max(0, radius - inset);
  // Точный периметр скруглённого прямоугольника
  const perimeter = Math.max(0, 2 * (rectW + rectH) - 2 * rx * (4 - Math.PI));
  const dashLen = 70;
  const gap = Math.max(1, perimeter - dashLen);
  const loop = perimeter + dashLen;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock-аутентификация: принимаем любые данные и пускаем в кабинет.
    login(email || 'guest@5labs.dev');
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden pt-24 lg:pt-28">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] bg-glow-violet opacity-50" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] bg-glow-lime opacity-40" />

      <div className="container-narrow relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: form */}
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.login.back}
            </Link>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight lg:text-5xl">
              {t.login.title}
            </h1>
            <p className="mt-3 text-muted">{t.login.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-8">
              {/* Wrapper с общим индикатором */}
              <div ref={wrapperRef} className="relative">
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-subtle">{t.login.email}</span>
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setActive('email')}
                      onBlur={() => setActive((s) => (s === 'email' ? null : s))}
                      placeholder={t.login.emailPh}
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-ink/25 dark:border-white/15 dark:bg-white/5 dark:text-paper dark:focus:border-white/25"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-subtle">{t.login.password}</span>
                    <input
                      ref={passwordRef}
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActive('password')}
                      onBlur={() => setActive((s) => (s === 'password' ? null : s))}
                      placeholder={t.login.passwordPh}
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-ink/25 dark:border-white/15 dark:bg-white/5 dark:text-paper dark:focus:border-white/25"
                    />
                  </label>
                </div>

                {/* Анимация "змейки": зелёный сегмент бежит по периметру активного поля */}
                <style>{`
                  @keyframes snake-run {
                    to { stroke-dashoffset: var(--snake-loop); }
                  }
                `}</style>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute overflow-visible transition-[top,left,width,height,opacity] duration-500 ease-out"
                  style={{
                    top: `${box.top}px`,
                    left: `${box.left}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                    opacity: box.visible ? 1 : 0,
                  }}
                >
                  <rect
                    x={inset}
                    y={inset}
                    width={rectW}
                    height={rectH}
                    rx={rx}
                    ry={rx}
                    fill="none"
                    stroke="#c0f44f"
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: `${dashLen} ${gap}`,
                      animation: box.visible ? 'snake-run 2.2s linear infinite' : 'none',
                      filter: 'drop-shadow(0 0 6px rgba(192,244,79,0.75))',
                      '--snake-loop': `-${loop}px`,
                    }}
                  />
                </svg>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-ink/70 dark:text-white/70">
                  <input type="checkbox" className="h-4 w-4 rounded border-ink/30 accent-violet dark:accent-lime" />
                  {t.login.remember}
                </label>
                <a href="#" className="link-underline text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-paper">
                  {t.login.forgot}
                </a>
              </div>

              <button type="submit" className="btn-primary mt-5 w-full justify-center">
                {t.login.submit}
              </button>

              <p className="mt-5 text-center text-sm text-muted">
                {t.login.noAccount}{' '}
                <Link to="/signup" className="link-underline text-ink hover:text-violet dark:text-paper dark:hover:text-lime">
                  {t.login.register}
                </Link>
              </p>
            </form>
          </div>

          {/* Right: Lottie animation */}
          <div className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full bg-glow-violet opacity-40 blur-3xl dark:bg-glow-lime" />
            <DotLottieReact
              src="/marketing-telephone.json"
              autoplay
              loop
              style={{ width: '100%', maxWidth: '520px', height: '520px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
