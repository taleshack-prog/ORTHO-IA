import { auth, type User } from "./api";
export const saveToken = (t: string) => typeof window !== "undefined" && localStorage.setItem("orto_token", t);
export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("orto_token") : null;
export const clearToken = () => typeof window !== "undefined" && localStorage.removeItem("orto_token");
export const isAuthenticated = () => !!getToken();
export async function getCurrentUser(): Promise<User | null> { if (!isAuthenticated()) return null; try { return await auth.me(); } catch { clearToken(); return null; } }
export async function login(email: string, password: string): Promise<User> { const { access_token } = await auth.login(email, password); saveToken(access_token); return auth.me(); }
export function logout() { clearToken(); window.location.href = "/login"; }
