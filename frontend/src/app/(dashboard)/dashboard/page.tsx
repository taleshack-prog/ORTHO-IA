"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { reports, cases } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ total_cases:0, cases_this_month:0, reports_generated:0, completion_rate:0 });
  const [recentCases, setRecentCases] = useState<Array<{id:string;patient_name:string;status:string;created_at:string;ai_diagnosis?:{skeletal_class?:string}}>>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    reports.stats().then(setStats).catch(()=>{});
    cases.list({page:1}).then(r=>setRecentCases(r.cases.slice(0,5))).catch(()=>{});
  }, []);

  const metrics = [
    {label:"Casos este mês",value:stats.cases_this_month,icon:"📋",color:"text-blue-900"},
    {label:"Total de casos",value:stats.total_cases,icon:"🗂",color:"text-gray-800"},
    {label:"Laudos gerados",value:stats.reports_generated,icon:"📄",color:"text-green-700"},
    {label:"Taxa de conclusão",value:`${stats.completion_rate}%`,icon:"✅",color:"text-blue-700"},
  ];
  const BADGE: Record<string,string> = {pending:"bg-yellow-100 text-yellow-700",analyzing:"bg-blue-100 text-blue-700",completed:"bg-green-100 text-green-700",failed:"bg-red-100 text-red-700"};
  const LABEL: Record<string,string> = {pending:"Aguardando",analyzing:"Analisando",completed:"Concluído",failed:"Falha"};

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Dashboard</h1><p className="text-sm text-gray-500">Bem-vindo ao Orto-IA</p></div>
        <button onClick={()=>setShowModal(true)} className="px-5 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">+ Novo Caso</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Iniciar Novo Caso</h2>
              <p className="text-sm text-gray-500 mt-1">O paciente já está cadastrado ou é a primeira consulta?</p>
            </div>
            <div className="p-6 space-y-3">
              <button onClick={()=>{setShowModal(false);router.push("/cases/new");}}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200">🔍</div>
                <div><div className="font-semibold text-gray-900">Paciente já cadastrado</div><div className="text-sm text-gray-500">Buscar na lista de pacientes</div></div>
              </button>
              <button onClick={()=>{setShowModal(false);router.push("/patients/new");}}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-green-200">👤</div>
                <div><div className="font-semibold text-gray-900">Novo paciente</div><div className="text-sm text-gray-500">Cadastrar e já abrir o caso</div></div>
              </button>
            </div>
            <div className="px-6 pb-5">
              <button onClick={()=>setShowModal(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m=>(
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{href:"/patients",icon:"👤",label:"Pacientes",desc:"Gerenciar cadastros"},
          {href:"/reports",icon:"📄",label:"Laudos",desc:"Ver laudos gerados"},
          {href:"/signature-training",icon:"🧬",label:"Assinatura Clínica",desc:"Treinar a IA com seus casos"}
        ].map(a=>(
          <Link key={a.href} href={a.href} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="font-semibold text-gray-800 text-sm">{a.label}</div>
            <div className="text-xs text-gray-500">{a.desc}</div>
          </Link>
        ))}
      </div>

      {recentCases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">Casos Recentes</span>
            <Link href="/cases" className="text-xs text-blue-700 hover:underline">Ver todos →</Link>
          </div>
          {recentCases.map(c=>(
            <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">{c.patient_name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.patient_name}</div>
                  {c.ai_diagnosis?.skeletal_class && <div className="text-xs text-gray-400">{c.ai_diagnosis.skeletal_class}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BADGE[c.status]}`}>{LABEL[c.status]}</span>
                <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
