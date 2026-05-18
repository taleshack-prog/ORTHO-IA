"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";
const NAV = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/cases", icon: "📋", label: "Casos" },
  { href: "/cases/new", icon: "➕", label: "Novo Caso" },
  { href: "/reports", icon: "📄", label: "Laudos" },
  { href: "/signature-training", icon: "🧬", label: "Assinatura IA" },
];
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 min-h-screen bg-gray-950 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800"><div className="text-white font-bold text-lg">ORTO-IA</div><div className="text-gray-400 text-xs mt-0.5">Diagnóstico Ortodôntico</div></div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({href, icon, label}) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href)); return (
          <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-blue-900 text-white font-medium" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <span>{icon}</span>{label}
          </Link>
        );})}
      </nav>
      <div className="px-3 py-4 border-t border-gray-800">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-red-400 transition-colors"><span>🚪</span>Sair</button>
      </div>
    </aside>
  );
}
