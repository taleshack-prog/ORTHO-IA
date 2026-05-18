"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { reports, cases } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_cases: 0, cases_this_month: 0, reports_generated: 0, completion_rate: 0 });
  const [recentCases, setRecentCases] = useState<unknown[]>([]);
  useEffect(() => {
    reports.stats().then(setStats).catch(()=>{});
    cases.list({ page: 1 }).then(r => setRecentCases(r.cases.slice(0, 5))).catch(()=>{});
  }, []);
  const metrics = [
    { label: "Casos este mês", value: stats.cases_this_month, icon: "📋" },
    { label: "Total de casos", value: stats.total_cases, icon: "🗂" },
    { label: "Laudos gerados", value: stats.reports_generated, icon: "📄" },
    { label: "Taxa de conclusão", value: `${stats.completion_rate}%`, icon: "✅" },
  ];
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/cases/new" className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800">+ Novo Caso</Link>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="text-2xl font-bold text-blue-900">{m.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
      {recentCases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 font-medium text-gray-700 text-sm">Casos Recentes</div>
          {(recentCases as Array<{id:string;patient_name:string;status:string;created_at:string}>).map(c => (
            <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
              <span className="text-sm font-medium text-gray-800">{c.patient_name}</span>
              <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
