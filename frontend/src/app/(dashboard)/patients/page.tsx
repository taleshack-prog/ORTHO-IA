"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { patients, type Patient } from "@/lib/api";

export default function PatientsPage() {
  const [data, setData] = useState<{ total: number; patients: Patient[] }>({ total: 0, patients: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patients.list({ search: search || undefined }).then(setData).finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500">{data.total} pacientes cadastrados</p>
        </div>
        <Link href="/patients/new" className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800">
          + Novo Paciente
        </Link>
      </div>
      <input type="text" placeholder="Buscar por nome..." value={search}
        onChange={e => { setSearch(e.target.value); setLoading(true); }}
        className="w-full mb-4 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" /></div>
      ) : data.patients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">👤</div>
          <p>Nenhum paciente encontrado.</p>
          <Link href="/patients/new" className="mt-3 inline-block text-blue-700 text-sm hover:underline">Cadastrar primeiro paciente →</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Nome", "Sexo", "Telefone", "Queixa Principal", "Ações"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.patients.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.sex === "F" ? "Feminino" : p.sex === "M" ? "Masculino" : "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{p.phone || "-"}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.chief_complaint || "-"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/cases/new?patient_id=${p.id}`} className="text-blue-700 text-xs font-medium hover:underline">
                      + Novo Caso
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
