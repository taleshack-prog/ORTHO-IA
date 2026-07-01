"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { patients } from "@/lib/api";

function useSpeechTranscription(onTranscript: (text: string, final: boolean) => void) {
  const recognitionRef = useRef<unknown>(null);
  const [listening, setListening] = useState(false);

  const start = useCallback(() => {
    const SR = (window as unknown as Record<string,unknown>).SpeechRecognition || (window as unknown as Record<string,unknown>).webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome ou Edge para transcrição por voz."); return; }
    const r = new (SR as new()=>unknown)() as { lang:string; continuous:boolean; interimResults:boolean; onresult:(e:unknown)=>void; onerror:()=>void; onend:()=>void; start:()=>void; stop:()=>void; };
    r.lang = "pt-BR"; r.continuous = true; r.interimResults = true;
    r.onresult = (event: unknown) => {
      const e = event as { results: { [k:number]: { [k:number]: {transcript:string}; isFinal:boolean }; length:number } };
      let interim = "", final = "";
      for (let i=0; i<e.results.length; i++) { if (e.results[i].isFinal) final += e.results[i][0].transcript+" "; else interim += e.results[i][0].transcript; }
      if (final) onTranscript(final, true); else if (interim) onTranscript(interim, false);
    };
    r.onerror = () => setListening(false); r.onend = () => setListening(false);
    r.start(); recognitionRef.current = r; setListening(true);
  }, [onTranscript]);

  const stop = useCallback(() => { const r = recognitionRef.current as {stop:()=>void}|null; if(r) r.stop(); setListening(false); }, []);
  return { listening, start, stop };
}

function VoiceField({ label, value, onChange, placeholder, rows, hint }: { label:string; value:string; onChange:(v:string)=>void; placeholder:string; rows:number; hint?:string }) {
  const [interim, setInterim] = useState("");
  const baseRef = useRef("");
  const handleTranscript = useCallback((text:string, final:boolean) => {
    if (final) { const v = baseRef.current + text; baseRef.current = v; onChange(v); setInterim(""); }
    else setInterim(text);
  }, [onChange]);
  const { listening, start, stop } = useSpeechTranscription(handleTranscript);
  function handleChange(v:string) { baseRef.current = v; onChange(v); }
  function toggle() { if(listening){stop();}else{baseRef.current=value;start();} }
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button type="button" onClick={toggle} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${listening?"bg-red-100 text-red-700 border border-red-300 animate-pulse":"bg-gray-100 text-gray-600 border border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"}`}>
          <span>{listening?"🔴":"🎙"}</span>{listening?"Parar":"Gravar por voz"}
        </button>
      </div>
      <div className="relative">
        <textarea rows={rows} value={value+(interim||"")} onChange={e=>handleChange(e.target.value)} placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${listening?"border-red-300 focus:ring-red-300 bg-red-50":"border-gray-300 focus:ring-blue-500"}`} />
        {listening && <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-red-100 border border-red-200 text-red-700 text-xs px-2 py-1 rounded-full"><span className="w-2 h-2 bg-red-500 rounded-full animate-ping inline-block"/>Ouvindo...</div>}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState({ full_name:"", birth_date:"", sex:"", phone:"", email:"", chief_complaint:"", medical_history:"" });
  function set(k:string, v:string) { setForm(f=>({...f,[k]:v})); }

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) { setError("Nome é obrigatório"); return; }
    setLoading(true); setError(null);
    try {
      const p = await patients.create(form);
      router.push(`/cases/new?patient_id=${p.id}`);
    } catch(err:unknown) { setError(err instanceof Error ? err.message : "Erro ao cadastrar"); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button onClick={()=>router.back()} className="text-sm text-blue-700 hover:underline mb-2 block">← Voltar</button>
        <h1 className="text-xl font-bold text-gray-900">Novo Paciente</h1>
        <p className="text-sm text-gray-500 mt-1">Use 🎙 para transcrever a anamnese por voz em tempo real.</p>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Dados do Paciente</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input type="text" required value={form.full_name} onChange={e=>set("full_name",e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" value={form.birth_date} onChange={e=>set("birth_date",e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select value={form.sex} onChange={e=>set("sex",e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecionar</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="(51) 99999-9999"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" value={form.email} onChange={e=>set("email",e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-5">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Anamnese — Transcrição por Voz</div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-xs text-blue-700">
            💡 Clique em <strong>🎙 Gravar por voz</strong> — o paciente fala e o texto é transcrito automaticamente. Funciona em Chrome e Edge.
          </div>
          <div className="space-y-4">
            <VoiceField label="Queixa Principal" value={form.chief_complaint} onChange={v=>set("chief_complaint",v)} rows={3}
              placeholder="Ex: Tenho os dentes tortos e quero melhorar o sorriso..." hint="Queixa estética e funcional do paciente." />
            <VoiceField label="Histórico Médico e Odontológico" value={form.medical_history} onChange={v=>set("medical_history",v)} rows={5}
              placeholder="Ex: Pressão alta controlada, fiz extração do siso há 2 anos, sem alergias..."
              hint="Doenças sistêmicas, medicamentos, cirurgias, tratamentos anteriores, alergias, hábitos." />
          </div>
        </div>
        <div className="flex justify-between pt-2">
          <button type="button" onClick={()=>router.back()} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancelar</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50">
            {loading?"Salvando...":"Cadastrar e Abrir Caso →"}
          </button>
        </div>
      </form>
    </div>
  );
}
