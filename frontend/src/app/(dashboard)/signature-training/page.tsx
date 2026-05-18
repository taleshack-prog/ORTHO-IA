"use client";
import { useState } from "react";
import { signatures } from "@/lib/api";
const EMPTY = { patient_age: 25, patient_sex: "F", facial_pattern: "mesofacial", skeletal_class: "Classe I", extractions: false, mechanics: "MBT", anchorage: "moderada", treatment_duration_months: 18 };
export default function SignatureTrainingPage() {
  const [historicalCases, setHistoricalCases] = useState([EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]);
  const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState<string|null>(null);
  async function handleTrain() {
    setLoading(true); setError(null);
    try { await signatures.train(historicalCases); setSuccess(true); }
    catch(e:unknown){setError(e instanceof Error?e.message:"Erro ao treinar");}
    finally{setLoading(false);}
  }
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6"><h1 className="text-xl font-bold text-gray-900">Treinamento da Assinatura Clínica</h1><p className="text-sm text-gray-500 mt-1">Adicione casos históricos para personalizar a IA ao seu perfil clínico.</p></div>
      {success&&<div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">✅ Assinatura treinada com sucesso! A IA agora conhece seu perfil clínico.</div>}
      {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      <div className="space-y-4">
        {historicalCases.map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="font-medium text-gray-700 mb-3 text-sm">Caso Histórico #{i+1}</div>
            <div className="grid grid-cols-4 gap-3">
              {[["Idade","patient_age","number"],["Sexo","patient_sex","text"],["Padrão","facial_pattern","text"],["Classe","skeletal_class","text"]].map(([l,k,t])=>(
                <div key={k}><label className="block text-xs text-gray-500 mb-1">{l}</label>
                  <input type={t} value={(c as Record<string,unknown>)[k] as string} onChange={e=>{const u=[...historicalCases];(u[i] as Record<string,unknown>)[k]=t==="number"?Number(e.target.value):e.target.value;setHistoricalCases(u);}} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                </div>
              ))}
              <div><label className="block text-xs text-gray-500 mb-1">Mecânica</label><input type="text" value={c.mechanics} onChange={e=>{const u=[...historicalCases];u[i].mechanics=e.target.value;setHistoricalCases(u);}} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
              <div><label className="block text-xs text-gray-500 mb-1">Duração (meses)</label><input type="number" value={c.treatment_duration_months} onChange={e=>{const u=[...historicalCases];u[i].treatment_duration_months=Number(e.target.value);setHistoricalCases(u);}} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
              <div className="flex items-center gap-2 pt-5"><input type="checkbox" checked={c.extractions} onChange={e=>{const u=[...historicalCases];u[i].extractions=e.target.checked;setHistoricalCases(u);}} className="rounded"/><label className="text-sm text-gray-700">Extrações</label></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={()=>setHistoricalCases([...historicalCases,{...EMPTY}])} className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50">+ Adicionar Caso</button>
        <button onClick={handleTrain} disabled={loading||historicalCases.length<5} className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">{loading?"Treinando...":"🧬 Treinar Assinatura"}</button>
      </div>
    </div>
  );
}
