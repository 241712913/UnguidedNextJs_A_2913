"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";  
import { LogOut } from "lucide-react";

export default function Sidebar({ open, onClose }: any) {
  const router = useRouter();  

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-green-900 to-green-700 text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="p-5 flex justify-between items-center border-b border-white/20">
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">SahabatKargo.id</h1>
            <p className="text-sm opacity-70">Admin Panel</p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="px-5 space-y-3 mt-5">
          <p className="text-sm opacity-70">Menu</p>
          <Link href="/admin/dashboard" onClick={onClose}>
            <div className="px-4 py-2 rounded-xl hover:bg-green-600 cursor-pointer">
              Dashboard
            </div>
          </Link>
          <Link href="/admin/create" onClick={onClose}>
            <div className="px-4 py-2 rounded-xl hover:bg-green-600 cursor-pointer">
              Input Pengiriman
            </div>
          </Link>
          <Link href="/admin/shipment" onClick={onClose}>
            <div className="px-4 py-2 rounded-xl hover:bg-green-600 cursor-pointer">
              Daftar Pengiriman
            </div>
          </Link>
          <Link href="/admin/profile" onClick={onClose}>
            <div className="px-4 py-2 rounded-xl hover:bg-green-600 cursor-pointer">
              Profil
            </div>
          </Link>
        </div>

        <div className="absolute bottom-12 left-5 right-5">
          <button
            onClick={() => {
              onClose();
              router.push("/");   
            }}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-red-300 hover:text-red-400 hover:bg-red-700/10 transition"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>

        <div className="absolute bottom-5 left-5 text-white/70 text-sm">
          © 2026 SahabatKargo
        </div>
      </div>
    </>
  );
}