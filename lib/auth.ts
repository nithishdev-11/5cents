export interface UserSession {
  email: string;
  loggedInAt: number;
}

const SESSION_KEY = '5cents_session';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse session:', err);
    return null;
  }
}

export function setSession(email: string): UserSession {
  const session: UserSession = {
    email,
    loggedInAt: Date.now()
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isLoggedIn(): boolean {
  return !!getSession();
}
