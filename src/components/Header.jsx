import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Logo from './Logo.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

function ChevronDown({ className = 'h-3 w-3' }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Умная ссылка на якорь:
 *  - Если мы на главной — обычный #anchor с плавным скроллом.
 *  - Если на другой странице (например /mentors) — навигируем на / + hash,
 *    ScrollToHash сам прокрутит к секции после смены роута.
 */
function HashLink({ to, className, children, onClick }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hash = to.startsWith('#') ? to : `#${to}`;

  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    if (pathname === '/') {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.history.replaceState(null, '', hash);
    } else {
      navigate({ pathname: '/', hash });
    }
  };

  return (
    <a href={hash} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { href: '#about', label: t.nav.about },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-paper/70 border-b border-ink/5 dark:bg-ink/70 dark:border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between lg:h-20">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {navLinks.map((l) => (
            <HashLink
              key={l.href}
              to={l.href}
              className="link-underline text-ink/80 hover:text-ink dark:text-white/80 dark:hover:text-paper"
            >
              {l.label}
            </HashLink>
          ))}

          {/* Services dropdown */}
          <div className="group relative">
            <HashLink
              to="#services"
              className="flex items-center gap-1.5 text-ink/80 hover:text-ink dark:text-white/80 dark:hover:text-paper"
            >
              {t.nav.services}
              <ChevronDown />
            </HashLink>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mt-3 w-52 overflow-hidden rounded-xl border border-ink/10 bg-paper/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-ink/95">
                <HashLink to="#partnership" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-violet/15 hover:text-ink dark:text-white/80 dark:hover:text-paper">
                  <span>{t.nav.servicesPartnership}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                </HashLink>
                <HashLink to="#premium" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-lime/20 hover:text-ink dark:text-white/80 dark:hover:text-paper">
                  <span>{t.nav.servicesPremium}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                </HashLink>
              </div>
            </div>
          </div>

          {/* Education dropdown */}
          <div className="group relative">
            <HashLink
              to="#education"
              className="flex items-center gap-1.5 text-ink/80 hover:text-ink dark:text-white/80 dark:hover:text-paper"
            >
              {t.nav.education}
              <ChevronDown />
            </HashLink>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mt-3 w-52 overflow-hidden rounded-xl border border-ink/10 bg-paper/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-ink/95">
                <HashLink to="#seminars" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-violet/15 hover:text-ink dark:text-white/80 dark:hover:text-paper">
                  <span>{t.nav.educationSeminars}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                </HashLink>
                <HashLink to="#individual" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-lime/20 hover:text-ink dark:text-white/80 dark:hover:text-paper">
                  <span>{t.nav.educationIndividual}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                </HashLink>
              </div>
            </div>
          </div>

          <Link
            to="/mentors"
            className="link-underline text-ink/80 hover:text-ink dark:text-white/80 dark:hover:text-paper"
          >
            {t.nav.mentors}
          </Link>

          <HashLink
            to="#contact"
            className="link-underline text-ink/80 hover:text-ink dark:text-white/80 dark:hover:text-paper"
          >
            {t.nav.contact}
          </HashLink>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LangSwitcher className="hidden md:inline-flex" />
          <ThemeToggle />
          <Link to="/login" className="hidden lg:inline-flex btn-primary">
            Login
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink dark:border-white/15 dark:text-paper"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-1 block h-[2px] w-full bg-current transition-transform ${
                  mobileOpen ? 'translate-y-1 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] block h-[2px] w-full bg-current transition-opacity ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 bottom-1 block h-[2px] w-full bg-current transition-transform ${
                  mobileOpen ? '-translate-y-1 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden border-t border-ink/5 bg-paper/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 dark:border-white/5 dark:bg-ink/95 ${
          mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-narrow flex flex-col gap-1 py-6 text-base">
          {navLinks.map((l) => (
            <HashLink
              key={l.href}
              to={l.href}
              onClick={closeMobile}
              className="rounded-lg px-3 py-3 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5"
            >
              {l.label}
            </HashLink>
          ))}
          <div className="mt-2 rounded-xl border border-ink/10 bg-ink/5 p-2 dark:border-white/10 dark:bg-white/5">
            <div className="px-3 pb-1 pt-2 text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">
              {t.nav.services}
            </div>
            <HashLink to="#partnership" onClick={closeMobile} className="block rounded-lg px-3 py-2 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5">
              {t.nav.servicesPartnership}
            </HashLink>
            <HashLink to="#premium" onClick={closeMobile} className="block rounded-lg px-3 py-2 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5">
              {t.nav.servicesPremium}
            </HashLink>
          </div>
          <div className="mt-2 rounded-xl border border-ink/10 bg-ink/5 p-2 dark:border-white/10 dark:bg-white/5">
            <div className="px-3 pb-1 pt-2 text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">
              {t.nav.education}
            </div>
            <HashLink to="#seminars" onClick={closeMobile} className="block rounded-lg px-3 py-2 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5">
              {t.nav.educationSeminars}
            </HashLink>
            <HashLink to="#individual" onClick={closeMobile} className="block rounded-lg px-3 py-2 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5">
              {t.nav.educationIndividual}
            </HashLink>
          </div>
          <Link
            to="/mentors"
            onClick={closeMobile}
            className="rounded-lg px-3 py-3 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5"
          >
            {t.nav.mentors}
          </Link>
          <HashLink
            to="#contact"
            onClick={closeMobile}
            className="rounded-lg px-3 py-3 text-ink/85 hover:bg-ink/5 dark:text-white/85 dark:hover:bg-white/5"
          >
            {t.nav.contact}
          </HashLink>
          <div className="mt-4 flex items-center justify-between">
            <LangSwitcher />
            <Link to="/login" onClick={closeMobile} className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
