"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/lib/api";
export function TopBar() {
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => { getCurrentUser().then(setUser); }, []);
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">{new Date().toLocaleDateString("pt-BR", {weekday:"long",day:"numeric",month:"long"})}</div>
      {user && <div className="flex items-center gap-3">
        <div className="text-sm text-right"><div className="font-medium text-gray-800">{user.full_name}</div><div className="text-xs text-gray-500">CRM {user.crm}</div></div>
        <div className="w-8 h-8 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">{user.full_name.charAt(0)}</div>
      </div>}
    </header>
  );
}
