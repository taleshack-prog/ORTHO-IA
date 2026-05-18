"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cases, analysis, type Case } from "@/lib/api";
const SBADGE: Record<string,string> = { pending:"bg-yellow-100 text-yellow-800", analyzing:"bg-blue-100 text-blue-800", completed:"bg-green-100 text-green-800", failed:"bg-red-100 text-red-800" };
const SLABEL: Record<string,string> = { pending:"Aguardando", analyzing:"Analisando", completed:"Concluído", failed:"Falha" };
export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case|null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState(false);
  useEffect(() => {
    cases.get(id).then(d => { setCaseData(d); if (d.status === "analyzing") { const i = setInterval(() => cases.get(id).then(u => { setCaseData(u); if (u.status !== "analyzing") clearInterval(i); }), 4000); } }).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"/></div>;
  if (!caseData) return <div className="p-8 text-center text-gray-500">Caso não encontrado.</div>;
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-5">
      <div className="flex items-start justify-between">
        <div><Link href="/cases" className="text-sm text-blue-700 hover:underline mb-2 block">← Voltar</Link>
          <h1 className="text-xl font-bold text-gray-900">{caseData.patient_name}</h1>
          <p className="text-sm text-gray-500">#{id.slice(0,8).toUpperCase()} · {new Date(caseData.created_at).toLocaleDateString("pt-BR")}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${SBADGE[caseData.status]}`}>{SLABEL[caseData.status]}</span>
      </div>
      {caseData.status === "analyzing" && <div className="bg-blue-50 border border-blue-200 rounded-xl p-5"><div className="flex items-center gap-3 mb-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"/><span className="font-medium text-blue-900 text-sm">Processando...</span></div><p className="text-sm text-blue-700">{caseData.processing_stage || "Iniciando pipeline..."}</p></div>}
      {(caseData.clinical_warnings?.length ?? 0) > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-5"><h3 className="font-semibold text-amber-900 mb-2">⚠ Alertas Clínicos</h3><ul className="space-y-1">{caseData.clinical_warnings!.map((w,i) => <li key={i} className="text-sm text-amber-800">• {w}</li>)}</ul></div>}
      {caseData.ai_diagnosis && <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><h3 className="font-semibold text-gray-900 mb-3">Diagnóstico</h3><div className="grid grid-cols-3 gap-3">{[["Classe Esquelética","skeletal_class"],["Padrão Facial","facial_pattern"],["Classe Dentária","dental_class"]].map(([l,k]) => (caseData.ai_diagnosis as Record<string,string>)?.[k] ? <div key={k} className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">{l}</div><div className="font-semibold text-blue-900 text-sm">{(caseData.ai_diagnosis as Record<string,string>)[k]}</div></div> : null)}</div></div>}
      {caseData.status === "completed" && <div className="flex gap-4">
        {caseData.pdf_report_url && <a href={caseData.pdf_report_url} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-4 bg-blue-900 text-white text-sm font-medium rounded-xl text-center hover:bg-blue-800">📄 Baixar Laudo PDF</a>}
        {!feedbackSent && <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center"><div className="text-xs text-gray-500 mb-2">Avaliar diagnóstico</div><div className="flex justify-center gap-2">{[1,2,3,4,5].map(r => <button key={r} onClick={async()=>{ await analysis.feedback(id,r); setFeedbackSent(true); }} className="text-2xl hover:scale-110 transition-transform">⭐</button>)}</div></div>}
        {feedbackSent && <div className="flex-1 py-3 px-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center rounded-xl">✓ Feedback enviado</div>}
      </div>}
    </div>
  );
}
