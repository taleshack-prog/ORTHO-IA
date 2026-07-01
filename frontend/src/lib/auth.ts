import { auth, type User } from "./api";

// Usar cookie para persistir token entre navegações (SSR-safe)
export function saveToken(t: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("orto_token", t);
  document.cookie = `orto_token=${t}; path=/; max-age=86400; SameSite=Lax`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // Tentar localStorage primeiro
  const ls = localStorage.getItem("orto_token");
  if (ls) return ls;
  // Fallback: ler do cookie
  const match = document.cookie.match(/(?:^|;\s*)orto_token=([^;]+)/);
  return match ? match[1] : null;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("orto_token");
  document.cookie = "orto_token=; path=/; max-age=0";
}

export function isAuthenticated(): boolean { return !!getToken(); }

export async function getCurrentUser(): Promise<User | null> {
  if (!isAuthenticated()) return null;
  try { return await auth.me(); }
  catch { clearToken(); return null; }
}

export async function login(email: string, password: string): Promise<User> {
  const { access_token } = await auth.login(email, password);
  saveToken(access_token);
  return auth.me();
}

export function logout() { clearToken(); window.location.href = "/login"; }
