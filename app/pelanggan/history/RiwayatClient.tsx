"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";

import {
  Search,
  Clock,
  Truck,
  Package,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

type Shipment = {
  id: number;
  resi: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  status: string;
  created_at: string;
};

const STATUS: Record<string, { color: string; icon: JSX.Element }> = {
  Menunggu:           { color: "bg-amber-100 text-amber-800",    icon: <Clock size={13} /> },
  Transit:            { color: "bg-sky-100 text-sky-800",        icon: <Truck size={13} /> },
  "Dalam perjalanan": { color: "bg-sky-100 text-sky-800",        icon: <Truck size={13} /> },
  Diantar:            { color: "bg-violet-100 text-violet-800",  icon: <Package size={13} /> },
  Selesai:            { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle size={13} /> },
  Terkirim:           { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle size={13} /> },
  Gagal:              { color: "bg-red-100 text-red-800",         icon: <Package size={13} /> },
};

const STATUS_MAP: Record<number, string> = {
  1: "Menunggu",
  2: "Transit",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
};

export default function RiwayatPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/home");
        const result = await res.json();
        setShipments(
          (result.shipments || []).map((item: any) => ({
            ...item,
            status: STATUS_MAP[item.status_id] || "Menunggu",
          }))
        );
      } catch (error) {
        console.log("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = shipments.filter((item) =>
    item.resi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="px-3 py-4 space-y-3 md:px-6 md:space-y-4">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-5 md:p-6 shadow-lg shadow-emerald-100">
          <div className="relative z-10">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Riwayat Pengiriman
            </h1>
            <p className="text-emerald-50/80 mt-1.5 text-sm">
              Pantau semua aktivitas pengirimanmu di sini
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2">
          <div className="flex items-center bg-white rounded-2xl px-4 py-3 flex-1 shadow-sm border border-emerald-100 min-w-0">
            <Search size={16} className="text-emerald-400 mr-2.5 shrink-0" />
            <input
              placeholder="Cari nomor resi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-0 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-md shadow-emerald-200 transition shrink-0">
            Cari
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm animate-pulse"
                >
                  <div className="flex justify-between mb-4 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-36 bg-emerald-100 rounded-xl mb-2.5" />
                      <div className="h-3 w-24 bg-emerald-50 rounded-xl" />
                    </div>
                    <div className="h-6 w-20 bg-emerald-100 rounded-full shrink-0" />
                  </div>
                  <div className="h-3 w-52 bg-emerald-50 rounded-xl" />
                </div>
              ))}
            </>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-lg hover:shadow-emerald-100 hover:border-emerald-200 transition-all duration-300"
              >
                {/* Baris atas: resi + badge status */}
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base text-slate-800 group-hover:text-emerald-700 transition truncate">
                      {item.resi}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                      STATUS[item.status]?.color || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {STATUS[item.status]?.icon}
                    {item.status}
                  </span>
                </div>

                {/* Alamat */}
                <div className="mt-2.5 text-sm text-slate-500 leading-relaxed break-words">
                  {item.alamat_pengirim} → {item.alamat_penerima}
                </div>

                {/* Tombol aksi */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/pelanggan/history/${item.id}`}
                    className="flex-1 text-center py-2.5 rounded-2xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 active:scale-95 transition"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => router.push(`/pelanggan/create?repeat=${item.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition"
                  >
                    <RotateCcw size={13} />
                    Repeat Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-slate-700 font-semibold text-base">
                Tidak ada riwayat pengiriman
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Pengiriman yang kamu cari belum tersedia
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
