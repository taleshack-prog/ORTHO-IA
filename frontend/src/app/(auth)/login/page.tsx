"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try { await login(email, password); router.push("/dashboard"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Erro"); }
    finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><div className="text-white font-bold text-3xl">ORTO-IA</div><div className="text-gray-400 text-sm mt-1">Diagnóstico Ortodôntico</div></div>
        <div className="bg-white rounded-2xl p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-6">Entrar</h1>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">{loading ? "Entrando..." : "Entrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
