"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Clock, User, LogOut } from "lucide-react";

export default function Sidebar({ open, onClose }: any) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Home", href: "/pelanggan/home", icon: Home },
    { name: "Lacak Pengiriman", href: "/pelanggan/tracking", icon: Search },
    { name: "Riwayat", href: "/pelanggan/history", icon: Clock },
    { name: "Profil", href: "/pelanggan/profile", icon: User },
  ];

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
          <div>
            <h1 className="font-bold text-lg">SahabatKargo.id</h1>
            <p className="text-sm opacity-70">Customer Panel</p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="px-5 space-y-3 mt-5">
          <p className="text-sm opacity-70">Menu</p>

          {menus.map((item, i) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={i}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-white/80 hover:bg-green-600"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
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