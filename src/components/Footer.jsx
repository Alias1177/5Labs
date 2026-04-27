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
              <SocialIcon href="https://www.instagram.com/5labagency?igsh=bDh5Y2N4OWMwemNu" label="Instagram">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/company/fivelabsagency" label="LinkedIn">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
              </SocialIcon>
              <SocialIcon href="https://www.tiktok.com/@5labagency" label="TikTok">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.73z" fill="currentColor" />
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
