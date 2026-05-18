"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { patients, cases, analysis, type Patient } from "@/lib/api";
export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState<1|2|3>(1);
  const [search, setSearch] = useState(""); const [results, setResults] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient|null>(null);
  const [complaint, setComplaint] = useState(""); const [caseId, setCaseId] = useState<string|null>(null);
  const [files, setFiles] = useState<File[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);
  async function handleSearch(q: string) { setSearch(q); if (q.length < 2) { setResults([]); return; } const r = await patients.list({ search: q }); setResults(r.patients); }
  async function handleCreate() { if (!selected) return; setLoading(true); setError(null); try { const c = await cases.create({ patient_id: selected.id, chief_complaint: complaint }); setCaseId(c.id); setStep(2); } catch(e:unknown){setError(e instanceof Error?e.message:"Erro");} finally{setLoading(false);} }
  async function handleUpload() { if (caseId && files.length > 0) { setLoading(true); await cases.uploadImages(caseId, files).catch(()=>{}); setLoading(false); } setStep(3); }
  async function handleStart() { if (!caseId) return; setLoading(true); await analysis.start(caseId); router.push(`/cases/${caseId}`); }
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center mb-8">{[1,2,3].map(s=><div key={s} className="flex items-center">{s>1&&<div className={`h-0.5 w-16 mx-1 ${step>s-1?"bg-blue-900":"bg-gray-200"}`}/>}<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step>=s?"bg-blue-900 text-white":"bg-gray-200 text-gray-500"}`}>{s}</div></div>)}</div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {step===1&&<div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Selecionar Paciente</h2>
        <div className="relative mb-4"><input type="text" placeholder="Buscar paciente..." value={search} onChange={e=>handleSearch(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          {results.length>0&&<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">{results.map(p=><button key={p.id} onClick={()=>{setSelected(p);setSearch(p.full_name);setResults([]);}} className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b last:border-0">{p.full_name}</button>)}</div>}
        </div>
        {selected&&<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"><span className="font-medium text-blue-900">Selecionado: </span><span className="text-blue-700">{selected.full_name}</span></div>}
        <textarea rows={3} value={complaint} onChange={e=>setComplaint(e.target.value)} placeholder="Queixa principal..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"/>
        <div className="flex justify-end"><button onClick={handleCreate} disabled={!selected||loading} className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">{loading?"Criando...":"Continuar →"}</button></div>
      </div>}
      {step===2&&<div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Upload de Imagens</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400" onClick={()=>document.getElementById("file-input")?.click()}>
          <input id="file-input" type="file" multiple accept="image/*,.dcm" className="hidden" onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
          <div className="text-4xl mb-2">📁</div><p className="text-sm text-gray-600">Clique para selecionar imagens</p>
        </div>
        {files.length>0&&<div className="mt-3 space-y-1">{files.map((f,i)=><div key={i} className="text-sm text-gray-700 bg-gray-50 rounded p-2 flex justify-between"><span>{f.name}</span><span className="text-gray-400">{(f.size/1024).toFixed(0)} KB</span></div>)}</div>}
        <div className="flex justify-between mt-6"><button onClick={()=>setStep(1)} className="text-sm text-gray-600 px-4 py-2">← Voltar</button><button onClick={handleUpload} disabled={loading} className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">{loading?"Enviando...":files.length>0?"Enviar →":"Pular →"}</button></div>
      </div>}
      {step===3&&<div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-5xl mb-4">🧠</div><h2 className="text-lg font-semibold mb-2">Pronto para Analisar</h2>
        <p className="text-sm text-gray-500 mb-6">A IA irá gerar o laudo diagnóstico completo em 2-3 minutos.</p>
        <div className="flex justify-between"><button onClick={()=>setStep(2)} className="text-sm text-gray-600 px-4 py-2">← Voltar</button><button onClick={handleStart} disabled={loading} className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-600 disabled:opacity-50">{loading?"Iniciando...":"🚀 Iniciar Análise"}</button></div>
      </div>}
    </div>
  );
}
