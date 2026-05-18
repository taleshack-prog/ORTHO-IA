"use client";
import { useEffect, useState } from "react";
import { reports, type Report, type ReportStats } from "@/lib/api";
export default function ReportsPage() {
  const [data, setData] = useState<Report[]>([]); const [stats, setStats] = useState<ReportStats|null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([reports.list(), reports.stats()]).then(([r,s])=>{setData(r.reports);setStats(s);}).finally(()=>setLoading(false)); }, []);
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6"><h1 className="text-xl font-bold text-gray-900">Laudos</h1></div>
      {stats&&<div className="grid grid-cols-4 gap-4 mb-6">{[["Total de Casos",stats.total_cases],["Este Mês",stats.cases_this_month],["Laudos Gerados",stats.reports_generated],["Conclusão",`${stats.completion_rate}%`]].map(([l,v])=><div key={l as string} className="bg-white border border-gray-200 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">{l}</div><div className="text-2xl font-bold text-blue-900">{v}</div></div>)}</div>}
      {loading?<div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"/></div>
      :data.length===0?<div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">📄</div><p>Nenhum laudo.</p></div>
      :<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"><table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{["Paciente","Idade","Data","Diagnóstico","Alertas","PDF"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{data.map(r=><tr key={r.case_id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{r.patient_name}</td><td className="px-4 py-3 text-gray-500">{r.patient_age?`${r.patient_age}a`:"-"}</td><td className="px-4 py-3 text-gray-500">{new Date(r.analyzed_at).toLocaleDateString("pt-BR")}</td><td className="px-4 py-3">{r.skeletal_class&&<span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{r.skeletal_class}</span>}</td><td className="px-4 py-3">{r.warnings_count>0?<span className="text-amber-700 text-xs">⚠ {r.warnings_count}</span>:<span className="text-green-600 text-xs">✓</span>}</td><td className="px-4 py-3"><a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-xs hover:underline">Baixar ↗</a></td></tr>)}</tbody></table></div>}
    </div>
  );
}
