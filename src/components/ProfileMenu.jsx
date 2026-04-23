import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

// Двухбуквенные инициалы из имени/имейла.
function makeInitials(nameOrEmail = '') {
  const src = String(nameOrEmail || '').trim();
  if (!src) return '5L';
  const base = src.includes('@') ? src.split('@')[0] : src;
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return '5L';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Детерминированный HSL-цвет — чтобы аватар всегда был одинаковым.
function colorFromString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 55%)`;
}

/**
 * Кнопка-аватар в хедере + выпадающее меню с замокированным профилем.
 * Показывается только для залогиненного пользователя.
 */
export default function ProfileMenu() {
  const { t } = useI18n();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!isAuthenticated) return null;

  const displayName = user?.name || user?.email || 'Guest';
  const displayEmail = user?.email || 'guest@5labs.dev';
  const initials = makeInitials(user?.name || user?.email);
  const avatarColor = colorFromString(displayEmail);
  const profile = t.dashboard?.profile || {};

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={profile.openMenu || 'Open profile'}
        className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border transition ${
          open
            ? 'border-violet dark:border-lime ring-2 ring-violet/30 dark:ring-lime/30'
            : 'border-ink/15 hover:border-violet dark:border-white/15 dark:hover:border-lime'
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${avatarColor}, rgba(169,235,83,0.85))`,
          }}
        />
        <span className="relative font-display text-[13px] font-semibold tracking-wide text-white">
          {initials}
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-lime dark:border-ink" />
      </button>

      {/* Dropdown */}
      <div
        role="menu"
        className={`absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-2xl border border-ink/10 bg-paper/95 p-5 shadow-2xl backdrop-blur-xl transition-all dark:border-white/10 dark:bg-ink/95 ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(135deg, ${avatarColor}, rgba(169,235,83,0.85))`,
            }}
          >
            <span className="font-display text-base font-semibold text-white">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-semibold text-ink dark:text-paper">
              {displayName}
            </div>
            <div className="truncate text-xs text-muted">{displayEmail}</div>
          </div>
        </div>

        {/* Role + plan chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 text-[11px] uppercase tracking-widest text-ink dark:text-paper">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            {profile.role}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-1 text-[11px] uppercase tracking-widest text-ink dark:text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            {profile.plan}
          </span>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{profile.bio}</p>
        )}

        {/* Stats grid */}
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <dt className="text-[10px] uppercase tracking-widest text-subtle">
              {profile.level}
            </dt>
            <dd className="mt-1 font-display text-sm font-semibold text-ink dark:text-paper">
              {profile.levelValue}
            </dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <dt className="text-[10px] uppercase tracking-widest text-subtle">
              {profile.xp}
            </dt>
            <dd className="mt-1 font-display text-sm font-semibold text-ink dark:text-paper">
              {profile.xpValue}
            </dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <dt className="text-[10px] uppercase tracking-widest text-subtle">
              {profile.streak}
            </dt>
            <dd className="mt-1 font-display text-sm font-semibold text-ink dark:text-paper">
              {profile.streakValue}
            </dd>
          </div>
          <div className="rounded-xl border border-ink/10 bg-ink/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <dt className="text-[10px] uppercase tracking-widest text-subtle">
              {profile.memberSince}
            </dt>
            <dd className="mt-1 font-display text-sm font-semibold text-ink dark:text-paper">
              {profile.memberSinceValue}
            </dd>
          </div>
        </dl>

        {/* Location line */}
        {profile.locationValue && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 14s5-4.5 5-8.5A5 5 0 003 5.5C3 9.5 8 14 8 14z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span>{profile.locationValue}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-1">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-violet/15 hover:text-ink dark:text-white/80 dark:hover:text-paper"
          >
            <span>{t.dashboard?.eyebrow || 'Dashboard'}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            to="/roadmap"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-violet/15 hover:text-ink dark:text-white/80 dark:hover:text-paper"
          >
            <span>{profile.viewRoadmap}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink/80 hover:bg-ink/5 hover:text-ink dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-paper"
          >
            <span>{profile.settings}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M13 8a5 5 0 00-.08-.9l1.3-1-1.5-2.6-1.55.54a5 5 0 00-1.56-.9L9.4 1.5h-3l-.2 1.65a5 5 0 00-1.57.9l-1.55-.55L1.58 6.1l1.3 1a5 5 0 000 1.8l-1.3 1L3.08 12.5l1.55-.54c.47.38 1 .68 1.57.9l.2 1.64h3l.2-1.65a5 5 0 001.56-.9l1.55.55 1.5-2.6-1.3-1A5 5 0 0013 8z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-red-500/10 hover:text-red-500 dark:text-paper"
          >
            <span>{t.dashboard?.logout || 'Log out'}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 11l3-3-3-3M13 8H6M9 3H4a1 1 0 00-1 1v8a1 1 0 001 1h5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
