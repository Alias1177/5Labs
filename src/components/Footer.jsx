import { useI18n } from '../i18n/I18nContext.jsx';
import Logo from './Logo.jsx';
import LangSwitcher from './LangSwitcher.jsx';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-ink/10 dark:border-white/10">
      <div className="container-narrow py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-md text-subtle">{t.footer.tagline}</p>
            <div className="mt-8 flex items-center gap-3">
              <SocialIcon href="#" label="Instagram">
                <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" />
                <path d="M8 10v7M8 7.5v.01M12 17v-4a2 2 0 0 1 4 0v4" stroke="currentColor" fill="none" strokeLinecap="round" />
              </SocialIcon>
              <SocialIcon href="#" label="YouTube">
                <rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" />
                <path d="M11 9.5l3.5 2.5L11 14.5v-5z" fill="currentColor" />
              </SocialIcon>
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-widest text-subtle">{t.footer.nav}</div>
            <ul className="mt-4 space-y-2">
              <FooterLink href="#home">{t.nav.home}</FooterLink>
              <FooterLink href="#about">{t.nav.about}</FooterLink>
              <FooterLink href="#services">{t.nav.services}</FooterLink>
              <FooterLink href="#education">{t.nav.education}</FooterLink>
              <FooterLink href="#contact">{t.nav.contact}</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-subtle">{t.footer.services}</div>
            <ul className="mt-4 space-y-2">
              <FooterLink href="#partnership">{t.nav.servicesPartnership}</FooterLink>
              <FooterLink href="#premium">{t.nav.servicesPremium}</FooterLink>
              <FooterLink href="#seminars">{t.nav.educationSeminars}</FooterLink>
              <FooterLink href="#individual">{t.nav.educationIndividual}</FooterLink>
            </ul>
          </div>

          {/* Lang */}
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-subtle">{t.footer.language}</div>
            <div className="mt-4">
              <LangSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-sm text-subtle dark:border-white/10 sm:flex-row sm:items-center">
          <div>© {year} 5 Labs Agency. {t.footer.rights}.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ink dark:hover:text-paper">Privacy</a>
            <a href="#" className="hover:text-ink dark:hover:text-paper">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a href={href} className="text-ink/75 transition hover:text-violet dark:text-white/75 dark:hover:text-lime">
        {children}
      </a>
    </li>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink/70 transition hover:border-violet hover:text-violet dark:border-white/15 dark:text-white/70 dark:hover:border-lime dark:hover:text-lime"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
