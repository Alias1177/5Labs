import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Простой мок-AuthContext:
 *  - login(email) — «залогинивает» пользователя, сохраняя в localStorage.
 *  - logout() — чистит состояние и localStorage.
 *  - user — { email, name } | null.
 *
 * Нужен только чтобы прогнать пользователя через форму логина в личный кабинет.
 * Никаких настоящих токенов/сетевых запросов — это демо-логика.
 */

const STORAGE_KEY = '5labs:auth';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readFromStorage());

  // Синхронизация между вкладками (если разлогинились где-то ещё).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      setUser(readFromStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback((email) => {
    // Делаем минимальный «профиль» из email: берём часть до @ как имя.
    const safeEmail = String(email || '').trim() || 'guest@5labs.dev';
    const name = safeEmail.includes('@')
      ? safeEmail.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : safeEmail;
    const next = { email: safeEmail, name };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage off / private mode — всё равно оставляем в памяти */
    }
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
