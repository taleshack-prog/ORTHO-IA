"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { patients, cases, analysis, type Patient } from "@/lib/api";

type DocType = "teleradiografia" | "panoramica" | "foto_perfil" | "foto_frontal" | "foto_intraoral" | "outro";
const DOC_TYPES = [
  { value: "teleradiografia" as DocType, label: "Telerradiografia Lateral", icon: "🦷" },
  { value: "panoramica" as DocType, label: "Radiografia Panorâmica", icon: "📸" },
  { value: "foto_perfil" as DocType, label: "Foto de Perfil", icon: "👤" },
  { value: "foto_frontal" as DocType, label: "Foto Frontal", icon: "🙂" },
  { value: "foto_intraoral" as DocType, label: "Foto Intraoral", icon: "🦷" },
  { value: "outro" as DocType, label: "Outro Documento", icon: "📄" },
];

interface UploadedFile { file: File; type: DocType; preview?: string; }

export default function NewCasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("patient_id");

  const [step, setStep] = useState<1|2|3>(1);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient|null>(null);
  const [complaint, setComplaint] = useState("");
  const [anamnesis, setAnamnesis] = useState("");
  const [caseId, setCaseId] = useState<string|null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [docType, setDocType] = useState<DocType>("teleradiografia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  // Carregar paciente pré-selecionado via query param
  useEffect(() => {
    if (preselectedId) {
      patients.get(preselectedId)
        .then(p => { setSelected(p); setStep(2); })
        .catch(() => {});
    }
  }, [preselectedId]);

  async function handleSearch(q: string) {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    try {
      const r = await patients.list({ search: q });
      setResults(r.patients);
    } catch { setResults([]); }
  }

  function selectPatient(p: Patient) {
    setSelected(p);
    setSearch(p.full_name);
    setResults([]);
  }

  async function handleCreateCase() {
    if (!selected) { setError("Selecione um paciente"); return; }
    setLoading(true); setError(null);
    try {
      const c = await cases.create({ patient_id: selected.id, chief_complaint: complaint });
      setCaseId(c.id);
      setStep(2);
    } catch(e: unknown) { setError(e instanceof Error ? e.message : "Erro ao criar caso"); }
    finally { setLoading(false); }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const accepted = Array.from(e.target.files || []);
    const newFiles = accepted.map(f => ({
      file: f, type: docType,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = "";
  }

  async function handleUpload() {
    if (!caseId) return;
    setLoading(true);
    try {
      if (files.length > 0) {
        await cases.uploadImages(caseId, files.map(f => f.file));
      }
      setStep(3);
    } catch(e: unknown) { setError(e instanceof Error ? e.message : "Erro no upload"); }
    finally { setLoading(false); }
  }

  async function handleStart() {
    if (!caseId) return;
    setLoading(true);
    try {
      await analysis.start(caseId);
      router.push(`/cases/${caseId}`);
    } catch(e: unknown) { setError(e instanceof Error ? e.message : "Erro ao iniciar análise"); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[{n:1,l:"Paciente"},{n:2,l:"Documentação"},{n:3,l:"Confirmar"}].map(({n,l},i)=>(
          <div key={n} className="flex items-center">
            {i>0&&<div className={`h-0.5 w-12 mx-2 ${step>n-1?"bg-blue-900":"bg-gray-200"}`}/>}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step>=n?"bg-blue-900 text-white":"bg-gray-200 text-gray-500"}`}>{n}</div>
              <span className="text-xs mt-1 text-gray-500">{l}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Step 1 — Paciente */}
      {step===1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Selecionar Paciente</h2>
          <div className="relative mb-4">
            <input type="text" placeholder="Buscar paciente por nome..." value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            {results.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {results.map(p => (
                  <button key={p.id} onClick={() => selectPatient(p)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b last:border-0">
                    <div className="font-medium">{p.full_name}</div>
                    {p.chief_complaint && <div className="text-xs text-gray-500">{p.chief_complaint}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900">✓ {selected.full_name}</div>
              {selected.chief_complaint && <div className="text-xs text-blue-700 mt-0.5">{selected.chief_complaint}</div>}
            </div>
          )}

          <textarea rows={2} value={complaint} onChange={e=>setComplaint(e.target.value)}
            placeholder="Queixa principal do caso..." 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"/>

          <div className="flex justify-between items-center">
            <Link href="/patients/new" className="text-sm text-blue-700 hover:underline">
              + Cadastrar novo paciente
            </Link>
            <button onClick={handleCreateCase} disabled={!selected || loading}
              className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Criando..." : selected ? "Continuar →" : "Selecione um paciente"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Upload */}
      {step===2 && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-1">Upload de Documentação</h2>
            <p className="text-sm text-gray-500 mb-4">Selecione o tipo e adicione os arquivos. Aceito: JPG, PNG, WEBP, DICOM.</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {DOC_TYPES.map(dt => (
                <button key={dt.value} onClick={() => setDocType(dt.value)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${docType===dt.value?"border-blue-500 bg-blue-50 text-blue-900":"border-gray-200 hover:border-blue-300 text-gray-600"}`}>
                  <div className="text-lg mb-1">{dt.icon}</div>
                  {dt.label}
                  {files.filter(f=>f.type===dt.value).length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center bg-green-500 text-white text-xs rounded-full w-4 h-4">
                      {files.filter(f=>f.type===dt.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors border-gray-300 hover:border-blue-400`}>
              <input type="file" multiple accept="image/*,.dcm" className="hidden" onChange={handleFileInput}/>
              <div className="text-3xl mb-2">{DOC_TYPES.find(d=>d.value===docType)?.icon}</div>
              <p className="text-sm font-medium text-gray-700">Clique para selecionar {DOC_TYPES.find(d=>d.value===docType)?.label}</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, DICOM</p>
            </label>
          </div>

          {DOC_TYPES.filter(dt => files.filter(f=>f.type===dt.value).length > 0).map(dt => (
            <div key={dt.value} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span>{dt.icon}</span>
                <span className="font-medium text-sm">{dt.label}</span>
                <span className="text-xs text-gray-400">({files.filter(f=>f.type===dt.value).length})</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {files.filter(f=>f.type===dt.value).map((f,i) => (
                  <div key={i} className="relative group">
                    {f.preview
                      ? <img src={f.preview} alt="" className="w-full h-20 object-cover rounded-lg border"/>
                      : <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">DICOM</div>}
                    <button onClick={() => setFiles(prev => { const idx = prev.findIndex(p => p === files.filter(x=>x.type===dt.value)[i]); return prev.filter((_,ii)=>ii!==idx); })}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">×</button>
                    <div className="text-xs text-gray-500 truncate mt-1">{f.file.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">← Voltar</button>
            <button onClick={handleUpload} disabled={loading}
              className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">
              {loading ? "Enviando..." : files.length > 0 ? `Enviar ${files.length} arquivo(s) →` : "Pular →"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Confirmar */}
      {step===3 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="text-lg font-semibold mb-2">Pronto para análise</h2>
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Paciente</span><span className="font-medium">{selected?.full_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Documentos</span><span className="font-medium">{files.length} arquivo(s)</span></div>
            {DOC_TYPES.filter(dt=>files.filter(f=>f.type===dt.value).length>0).map(dt=>(
              <div key={dt.value} className="flex justify-between text-xs ml-4">
                <span className="text-gray-400">{dt.icon} {dt.label}</span>
                <span className="text-gray-600">{files.filter(f=>f.type===dt.value).length}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-left text-sm mb-6">
            <div className="font-medium text-blue-900 mb-2">Pipeline de análise:</div>
            <div className="text-blue-700 space-y-1">
              <div>① Extração cefalométrica (WebCeph/CephX)</div>
              <div>② Raciocínio clínico com Knowledge Base</div>
              <div>③ Consulta à Assinatura Clínica</div>
              <div>④ Validação pelas 8 regras clínicas</div>
              <div>⑤ Geração do laudo PDF</div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">← Voltar</button>
            <button onClick={handleStart} disabled={loading}
              className="px-8 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50">
              {loading ? "Iniciando..." : "🚀 Iniciar Análise"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
