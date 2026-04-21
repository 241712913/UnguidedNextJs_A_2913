"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import { Search, Clock, Truck, Package, CheckCircle } from "lucide-react";
import { shipments, StatusType } from "@/app/data/shipment";

const STATUS: Record<
  StatusType,
  { color: string; icon: JSX.Element }
> = {
  Menunggu: {
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={14} />,
  },
  Transit: {
    color: "bg-blue-100 text-blue-700",
    icon: <Truck size={14} />,
  },
  Diantar: {
    color: "bg-purple-100 text-purple-700",
    icon: <Package size={14} />,
  },
  Selesai: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
};

export default function RiwayatPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = shipments.filter((s) =>
    s.resi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 md:p-3 space-y-3 mx-auto">

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <h1 className="text-2xl font-bold">Riwayat Pengiriman</h1>
          <p className="text-sm opacity-90 mt-1">
            Semua aktivitas pengiriman kamu
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center bg-white px-4 py-3 rounded-2xl flex-1 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-400">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              placeholder="Cari nomor resi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium transition">
            Cari
          </button>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/pelanggan/history/${item.id}`}
              className="block bg-white p-5 rounded-2xl border hover:shadow-lg hover:-translate-y-[2px] transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{item.resi}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${STATUS[item.status].color}`}
                >
                  {STATUS[item.status].icon}
                  {item.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                {item.from} → {item.to}
              </div>

              {item.courier && (
                <p className="text-xs text-gray-400 mt-1">
                  Kurir: {item.courier}
                </p>
              )}
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Tidak ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}