"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cases, type Case } from "@/lib/api";
const BADGE: Record<string,string> = { pending:"bg-yellow-100 text-yellow-800", analyzing:"bg-blue-100 text-blue-800", completed:"bg-green-100 text-green-800", failed:"bg-red-100 text-red-800" };
const LABEL: Record<string,string> = { pending:"Aguardando", analyzing:"Analisando", completed:"Concluído", failed:"Falha" };
export default function CasesPage() {
  const [data, setData] = useState<{ total: number; cases: Case[] }>({ total: 0, cases: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { cases.list().then(setData).finally(() => setLoading(false)); }, []);
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-gray-900">Casos</h1><p className="text-sm text-gray-500">{data.total} casos</p></div>
        <Link href="/cases/new" className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800">+ Novo Caso</Link>
      </div>
      {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"/></div>
      : data.cases.length === 0 ? <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">📋</div><p>Nenhum caso.</p><Link href="/cases/new" className="mt-3 inline-block text-blue-700 text-sm hover:underline">Criar primeiro caso →</Link></div>
      : <div className="space-y-2">{data.cases.map(c => (
          <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-sm">{c.patient_name?.charAt(0)}</div>
              <div><div className="font-medium text-gray-900 text-sm">{c.patient_name}</div><div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString("pt-BR")}</div></div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${BADGE[c.status]}`}>{LABEL[c.status]}</span>
          </Link>
        ))}</div>}
    </div>
  );
}
