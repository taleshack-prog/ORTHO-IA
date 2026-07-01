"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { signatures } from "@/lib/api";

interface ExcellenceCase {
  id: string;
  patient_age: number;
  patient_sex: string;
  initial_docs: File[];
  final_docs: File[];
  facial_pattern: string;
  skeletal_class: string;
  dental_class: string;
  extractions: boolean;
  extracted_teeth: string;
  mechanics: string;
  anchorage: string;
  appliance_type: string;
  treatment_duration_months: number;
  notes: string;
}

function emptyCase(id: string): ExcellenceCase {
  return {
    id, patient_age: 0, patient_sex: "",
    initial_docs: [], final_docs: [],
    facial_pattern: "", skeletal_class: "", dental_class: "",
    extractions: false, extracted_teeth: "", mechanics: "",
    anchorage: "", appliance_type: "",
    treatment_duration_months: 0, notes: "",
  };
}

function CaseCard({ c, index, onChange, onRemove }: { c: ExcellenceCase; index: number; onChange: (id: string, k: string, v: unknown) => void; onRemove: (id: string) => void }) {
  const onDropI = useCallback((files: File[]) => onChange(c.id, "initial_docs", [...c.initial_docs, ...files]), [c]);
  const onDropF = useCallback((files: File[]) => onChange(c.id, "final_docs", [...c.final_docs, ...files]), [c]);
  const { getRootProps: getRootI, getInputProps: getInputI, isDragActive: isDragI } = useDropzone({ onDrop: onDropI, accept: { "image/*": [], "application/octet-stream": [".dcm"] } });
  const { getRootProps: getRootF, getInputProps: getInputF, isDragActive: isDragF } = useDropzone({ onDrop: onDropF, accept: { "image/*": [], "application/octet-stream": [".dcm"] } });
  const f = (k: string, v: unknown) => onChange(c.id, k, v);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b">
        <span className="font-semibold text-gray-800 text-sm">Caso de Excelência #{index + 1}</span>
        <button onClick={() => onRemove(c.id)} className="text-red-400 hover:text-red-600 text-sm">× Remover</button>
      </div>
      <div className="p-5 space-y-4">

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dados do Paciente</div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs text-gray-600 mb-1">Idade</label>
              <input type="number" min="1" max="99" value={c.patient_age || ""} onChange={e=>f("patient_age",Number(e.target.value))} placeholder="Ex: 14"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Sexo</label>
              <select value={c.patient_sex} onChange={e=>f("patient_sex",e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Selecionar</option><option value="F">Feminino</option><option value="M">Masculino</option>
              </select></div>
            <div><label className="block text-xs text-gray-600 mb-1">Duração (meses)</label>
              <input type="number" min="1" value={c.treatment_duration_months || ""} onChange={e=>f("treatment_duration_months",Number(e.target.value))} placeholder="Ex: 24"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documentação Fotográfica e Radiográfica</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Documentação Inicial ({c.initial_docs.length} arquivo(s))</label>
              <div {...getRootI()} className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer text-xs transition-colors ${isDragI?"border-blue-500 bg-blue-50":"border-gray-300 hover:border-blue-400"}`}>
                <input {...getInputI()} />
                {c.initial_docs.length > 0 ? <span className="text-green-600 font-medium">{c.initial_docs.length} arquivo(s) adicionado(s)</span>
                  : <span className="text-gray-500">Radiografias, fotos iniciais, modelos</span>}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Documentação Final ({c.final_docs.length} arquivo(s))</label>
              <div {...getRootF()} className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer text-xs transition-colors ${isDragF?"border-blue-500 bg-blue-50":"border-gray-300 hover:border-blue-400"}`}>
                <input {...getInputF()} />
                {c.final_docs.length > 0 ? <span className="text-green-600 font-medium">{c.final_docs.length} arquivo(s) adicionado(s)</span>
                  : <span className="text-gray-500">Radiografias, fotos finais, contenção</span>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Diagnóstico</div>
          <div className="grid grid-cols-3 gap-3">
            {[["Padrão Facial","facial_pattern","Ex: Dolicofacial"],["Classe Esquelética","skeletal_class","Ex: Classe II"],["Classe Dentária","dental_class","Ex: Classe II Div 1"]].map(([l,k,p])=>(
              <div key={k}><label className="block text-xs text-gray-600 mb-1">{l}</label>
                <input type="text" value={(c as Record<string,unknown>)[k] as string} onChange={e=>f(k,e.target.value)} placeholder={p}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Planejamento Executado</div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-600 mb-1">Tipo de Aparelho</label>
              <input type="text" value={c.appliance_type} onChange={e=>f("appliance_type",e.target.value)} placeholder="Ex: Aparelho fixo MBT 0.022"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Mecânica Principal</label>
              <input type="text" value={c.mechanics} onChange={e=>f("mechanics",e.target.value)} placeholder="Ex: Retração em dois tempos"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Ancoragem</label>
              <select value={c.anchorage} onChange={e=>f("anchorage",e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Selecionar</option>
                <option value="mínima">Mínima</option>
                <option value="moderada">Moderada</option>
                <option value="máxima">Máxima (mini-implante)</option>
              </select></div>
            <div className="flex items-center gap-3 pt-4">
              <input type="checkbox" id={`ext-${c.id}`} checked={c.extractions} onChange={e=>f("extractions",e.target.checked)} className="rounded"/>
              <label htmlFor={`ext-${c.id}`} className="text-sm text-gray-700">Houve extrações</label>
            </div>
            {c.extractions && (
              <div className="col-span-2"><label className="block text-xs text-gray-600 mb-1">Dentes Extraídos</label>
                <input type="text" value={c.extracted_teeth} onChange={e=>f("extracted_teeth",e.target.value)} placeholder="Ex: 14, 24, 34, 44"
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            )}
          </div>
        </div>

        <div><label className="block text-xs text-gray-600 mb-1">Observações / Particularidades</label>
          <textarea rows={2} value={c.notes} onChange={e=>f("notes",e.target.value)} placeholder="Detalhes relevantes do tratamento, dificuldades, resultados..."
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
      </div>
    </div>
  );
}

export default function SignatureTrainingPage() {
  const [cases, setCases] = useState<ExcellenceCase[]>([emptyCase("1")]);
  const [sigStatus, setSigStatus] = useState<{ status: string; confidence: number; cases_count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { signatures.status().then(setSigStatus).catch(() => {}); }, []);

  function addCase() { setCases(prev => [...prev, emptyCase(String(Date.now()))]); }
  function removeCase(id: string) { if (cases.length <= 1) return; setCases(prev => prev.filter(c => c.id !== id)); }
  function updateCase(id: string, k: string, v: unknown) { setCases(prev => prev.map(c => c.id === id ? { ...c, [k]: v } : c)); }

  async function handleTrain() {
    setLoading(true); setError(null);
    try {
      const payload = cases.map(c => ({
        patient_age: c.patient_age, patient_sex: c.patient_sex,
        facial_pattern: c.facial_pattern, skeletal_class: c.skeletal_class,
        dental_class: c.dental_class, extractions: c.extractions,
        extracted_teeth: c.extracted_teeth, mechanics: c.mechanics,
        anchorage: c.anchorage, appliance_type: c.appliance_type,
        treatment_duration_months: c.treatment_duration_months, notes: c.notes,
        has_initial_docs: c.initial_docs.length > 0,
        has_final_docs: c.final_docs.length > 0,
      }));
      await signatures.train(payload);
      const s = await signatures.status();
      setSigStatus(s);
      setSuccess(true);
    } catch(e: unknown) { setError(e instanceof Error ? e.message : "Erro ao treinar"); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Assinatura Clínica</h1>
        <p className="text-sm text-gray-500 mt-1">Adicione casos de excelência resolvidos para que a IA aprenda seu método diagnóstico e de planejamento. Não há número mínimo — adicione quantos casos quiser.</p>
      </div>

      {sigStatus && (
        <div className={`mb-6 p-4 rounded-xl border ${sigStatus.status === "trained" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 text-sm">{sigStatus.status === "trained" ? "✅ Assinatura ativa" : "⚠ Assinatura não treinada"}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {sigStatus.status === "trained" ? `Baseada em ${sigStatus.cases_count} caso(s) · Confiança: ${Math.round(sigStatus.confidence * 100)}%` : "Adicione casos de excelência e treine a assinatura"}
              </div>
            </div>
            {sigStatus.status === "trained" && (
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width:`${sigStatus.confidence*100}%`}}/></div>
                <span className="text-xs font-medium text-green-700">{Math.round(sigStatus.confidence*100)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">✅ Assinatura treinada! A IA agora incorpora seu método em todos os diagnósticos.</div>}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="space-y-5">
        {cases.map((c, i) => <CaseCard key={c.id} c={c} index={i} onChange={updateCase} onRemove={removeCase} />)}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button onClick={addCase} className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
          + Adicionar Caso de Excelência
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{cases.length} caso(s) para treinamento</span>
          <button onClick={handleTrain} disabled={loading}
            className="px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Treinando..." : "🧬 Treinar Assinatura"}
          </button>
        </div>
      </div>
    </div>
  );
}
