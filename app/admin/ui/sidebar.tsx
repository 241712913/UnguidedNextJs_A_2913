"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, PlusCircle, Package, User } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ open, onClose }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "pelanggan">("admin");

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Input Pengiriman",
      href: "/admin/create",
      icon: PlusCircle,
    },
    {
      name: "Daftar Pengiriman",
      href: "/admin/shipment",
      icon: Package,
    },
    {
      name: "Profil",
      href: "/admin/profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="p-5 flex justify-between items-center border-b border-emerald-400/20">
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">SahabatKargo.id</h1>
            <p className="text-sm opacity-70">Admin Panel</p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MENU */}
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
                    ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white shadow-lg"
                    : "text-white/80 hover:bg-emerald-700/60"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* BOTTOM ACTION */}
        <div className="absolute bottom-12 left-5 right-5 space-y-3">

          {/* LOGOUT */}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              sessionStorage.removeItem("user"); // ← tambahkan ini
              onClose();
              router.push("/");
            }}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-red-300 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-5 left-5 text-white/70 text-sm">
          © 2026 SahabatKargo
        </div>
      </div>
    </>
  );
}