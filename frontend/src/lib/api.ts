const API = process.env.NEXT_PUBLIC_API_URL || "https://ortho-ia-production.up.railway.app/api/v1";

class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const ls = localStorage.getItem("orto_token");
  if (ls) return ls;
  const match = document.cookie.match(/(?:^|;\s*)orto_token=([^;]+)/);
  return match ? match[1] : null;
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, { ...opts, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) } });
  if (!res.ok) {
    const b = await res.json().catch(() => ({ detail: "Erro" }));
    const msg = res.status === 401 ? "Sessão expirada. Faça login novamente." : (b.detail || "Erro na requisição");
    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return null as T;
  return res.json();
}

export const auth = {
  login: (email: string, password: string) => req<{ access_token: string }>("/auth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ username: email, password }) }),
  register: (d: { email: string; full_name: string; cro: string; password: string }) => req("/auth/register", { method: "POST", body: JSON.stringify(d) }),
  me: () => req<User>("/auth/me"),
};

export const patients = {
  list: (p?: { search?: string; page?: number }) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(p||{}).filter(([,v])=>v!==undefined&&v!=="")) as Record<string,string>).toString();
    return req<{ total: number; patients: Patient[] }>(`/patients${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => req<Patient>(`/patients/${id}`),
  create: (d: Partial<Patient>) => req<Patient>("/patients", { method: "POST", body: JSON.stringify(d) }),
};

export const cases = {
  list: (p?: { patient_id?: string; page?: number }) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(p||{}).filter(([,v])=>v!==undefined)) as Record<string,string>).toString();
    return req<{ total: number; cases: Case[] }>(`/cases${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => req<Case>(`/cases/${id}`),
  create: (d: { patient_id: string; chief_complaint?: string }) => req<Case>("/cases", { method: "POST", body: JSON.stringify(d) }),
  uploadImages: (caseId: string, files: File[]) => {
    const fd = new FormData(); files.forEach(f => fd.append("files", f));
    const token = getToken();
    return fetch(`${API}/cases/${caseId}/images`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd }).then(r => r.json());
  },
};

export const analysis = {
  start: (id: string) => req(`/analysis/cases/${id}/analyze`, { method: "POST" }),
  status: (id: string) => req<{ status: string; stage: string }>(`/analysis/cases/${id}/status`),
  feedback: (id: string, rating: number) => req(`/analysis/cases/${id}/feedback?rating=${rating}`, { method: "POST" }),
};

export const signatures = {
  train: (cases: unknown[]) => req("/signatures/train", { method: "POST", body: JSON.stringify({ historical_cases: cases }) }),
  status: () => req<{ status: string; confidence: number; cases_count: number }>("/signatures/status"),
};

export const reports = {
  list: (page = 1) => req<{ total: number; reports: Report[] }>(`/reports?page=${page}`),
  stats: () => req<ReportStats>("/reports/stats"),
};

export interface User { id: string; email: string; full_name: string; cro: string; subscription_tier: string; }
export interface Patient { id: string; full_name: string; sex?: string; phone?: string; email?: string; chief_complaint?: string; }
export interface Case { id: string; patient_id: string; patient_name?: string; status: string; processing_stage?: string; chief_complaint?: string; ai_diagnosis?: { skeletal_class?: string; facial_pattern?: string; dental_class?: string; summary?: string }; treatment_plan?: Record<string, unknown>; clinical_warnings?: string[]; pdf_report_url?: string; image_urls?: string[]; created_at: string; analyzed_at?: string; }
export interface Report { case_id: string; patient_name: string; patient_age?: number; analyzed_at: string; pdf_url: string; skeletal_class?: string; warnings_count: number; }
export interface ReportStats { total_cases: number; cases_this_month: number; reports_generated: number; completion_rate: number; }
export { ApiError };
