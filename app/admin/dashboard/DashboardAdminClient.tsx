"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tanggalFilter, setTanggalFilter] = useState("all");

  const statusMap: any = {
    1: "Menunggu",
    2: "Dijemput",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
    6: "Gagal",
  };

  const statusStyle: Record<number, string> = {
    1: "bg-slate-100 text-slate-600",
    2: "bg-violet-100 text-violet-700",
    3: "bg-amber-100 text-amber-700",
    4: "bg-sky-100 text-sky-700",
    5: "bg-emerald-100 text-emerald-700",
    6: "bg-rose-100 text-rose-700",
  };

  const dotStyle: Record<number, string> = {
    1: "bg-slate-400",
    2: "bg-violet-500",
    3: "bg-amber-400",
    4: "bg-sky-500",
    5: "bg-emerald-500",
    6: "bg-rose-500",
  };

  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      if (!u || u.role !== "admin") router.replace("/not-found");
    } catch {
      router.replace("/not-found");
    }
  }, [router]);

  useEffect(() => {
    fetch(`/api/dashboard?status=${statusFilter}&tanggal=${tanggalFilter}`)
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, [statusFilter, tanggalFilter]);

  function buildTren(trenRaw: any[]) {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
      const found = trenRaw.find((t: any) => t.tanggal === label);
      result.push({ tanggal: label, total: found ? Number(found.total) : 0 });
    }
    return result;
  }

  if (!data) {
    return (
      <div className="bg-[#F3F5F4] min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 animate-pulse">

          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white p-5 sm:p-6 lg:p-8 rounded-[30px] shadow-md flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="h-7 sm:h-8 w-48 sm:w-60 bg-white/25 rounded-xl" />
              <div className="h-4 w-40 bg-white/15 rounded mt-3" />
            </div>
            <div className="md:text-right">
              <div className="h-4 w-32 bg-white/15 rounded md:ml-auto" />
              <div className="h-9 sm:h-10 w-44 sm:w-52 bg-white/25 rounded-xl mt-3 md:ml-auto" />
              <div className="h-3 w-40 bg-white/10 rounded mt-3 md:ml-auto" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <div className="h-8 sm:h-9 w-16 sm:w-20 bg-gray-200 rounded-xl" />
                <div className="h-4 w-24 sm:w-32 bg-gray-100 rounded mt-4" />
                <div className="h-3 w-20 sm:w-24 bg-gray-100 rounded mt-2" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2 bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="mb-6">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-44 bg-gray-100 rounded mt-2" />
              </div>
              <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <div key={bar} className="flex-1 flex flex-col items-center">
                    <div className="h-3 w-5 sm:w-6 bg-gray-200 rounded mb-2" />
                    <div className="w-full max-w-[40px] sm:max-w-[45px] bg-gray-200 rounded-t-[20px]" style={{ height: `${40 + bar * 18}px` }} />
                    <div className="h-3 w-7 sm:w-8 bg-gray-100 rounded mt-3" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="h-5 w-44 bg-gray-200 rounded mb-6" />
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item}>
                    <div className="flex justify-between mb-2">
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                      <div className="h-4 w-10 bg-gray-100 rounded" />
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-3 bg-gray-200 rounded-full" style={{ width: `${30 + item * 12}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-36 bg-gray-100 rounded mt-2" />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="h-12 w-full md:w-44 bg-gray-100 rounded-2xl" />
                <div className="h-12 w-full md:w-44 bg-gray-100 rounded-2xl" />
                <div className="h-12 w-full md:w-44 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const trenData = buildTren(data.tren);
  const maxTren = Math.max(...trenData.map((t) => t.total), 1);

  return (
    <div className="bg-[#F3F5F4] min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 border border-white/10 text-white p-5 sm:p-6 lg:p-8 rounded-[30px] shadow-md flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-sm opacity-80 mt-2">Overview bisnis SahabatKargo.id</p>
          </div>
          <div className="md:text-right">
            <p className="text-sm opacity-70">Total Pendapatan</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 break-words">
              Rp {Number(data.pendapatan[0].total || 0).toLocaleString("id-ID")}
            </h2>
            <p className="text-xs opacity-70 mt-2">Seluruh transaksi pengiriman</p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{data.totalPengiriman[0].count}</p>
            <p className="text-sm text-gray-700 mt-3">Total Pengiriman</p>
            <p className="text-xs text-gray-400 mt-1">Semua pengiriman</p>
          </div>
          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-2xl sm:text-3xl font-bold text-amber-500">{data.aktif[0].count}</p>
            <p className="text-sm text-gray-700 mt-3">Paket Aktif</p>
            <p className="text-xs text-gray-400 mt-1">Sedang berjalan</p>
          </div>
          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{data.berhasil[0].count}</p>
            <p className="text-sm text-gray-700 mt-3">Berhasil Terkirim</p>
            <p className="text-xs text-gray-400 mt-1">Pengiriman sukses</p>
          </div>
          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-2xl sm:text-3xl font-bold text-red-500">{data.gagal[0].count}</p>
            <p className="text-sm text-gray-700 mt-3">Pengiriman Gagal</p>
            <p className="text-xs text-gray-400 mt-1">Perlu tindakan</p>
          </div>
        </div>

        {/* CHART + LAYANAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

          <div className="lg:col-span-2 bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800">Tren Pengiriman</h2>
              <p className="text-xs text-gray-400 mt-1">7 hari terakhir per tanggal</p>
            </div>
            <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3">
              {trenData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs text-gray-500 mb-2">
                    {item.total > 0 ? item.total : ""}
                  </span>
                  <div
                    className={`w-full max-w-[40px] sm:max-w-[45px] rounded-t-[20px] hover:scale-105 transition-all duration-500 ${
                      item.total > 0
                        ? "bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        : "bg-gray-100"
                    }`}
                    style={{
                      height: `${Math.max((item.total / maxTren) * 220, item.total > 0 ? 20 : 8)}px`,
                    }}
                  />
                  <span className="text-[9px] sm:text-[10px] text-gray-500 mt-3 text-center leading-tight">
                    {item.tanggal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-gray-800 mb-6">Layanan Terpopuler</h2>
            <div className="space-y-5">
              {data.layanan.map((item: any, i: number) => {
                const persen = (Number(item.total) / Number(data.totalPengiriman[0].count || 1)) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-2 gap-2">
                      <span className="text-sm text-gray-700 font-medium truncate">{item.layanan}</span>
                      <span className="text-sm font-semibold text-emerald-700 shrink-0">{Math.round(persen)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-full"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="font-semibold text-gray-800">5 Pengiriman Terbaru</h2>
              <p className="text-xs text-gray-400 mt-1">Data realtime database</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto bg-[#F6F7F7] border border-[#D9E1DD] rounded-2xl px-4 py-3 text-sm outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="1">Menunggu</option>
                <option value="2">Dijemput</option>
                <option value="3">Dalam perjalanan</option>
                <option value="4">Diantar</option>
                <option value="5">Terkirim</option>
                <option value="6">Gagal</option>
              </select>

              <div className="relative flex items-center w-full md:w-auto">
                <input
                  type="date"
                  value={tanggalFilter === "all" ? "" : tanggalFilter}
                  onChange={(e) => setTanggalFilter(e.target.value || "all")}
                  className="w-full md:w-auto bg-[#F6F7F7] border border-[#D9E1DD] rounded-2xl px-4 py-3 pr-10 text-sm outline-none"
                />
                {tanggalFilter !== "all" && (
                  <button
                    onClick={() => setTanggalFilter("all")}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 transition"
                  >✕</button>
                )}
              </div>

              <a
                href="/api/laporan"
                className="w-full md:w-auto bg-gradient-to-r from-emerald-700 to-emerald-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-center"
              >
                Download Laporan
              </a>
            </div>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-3">Nomor Resi</th>
                  <th>Pengirim → Penerima</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {data.terbaru.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-[#F7FAF8] transition-all duration-300"
                  >
                    <td className="py-4 text-emerald-700 font-semibold">{item.resi}</td>
                    <td>{item.nama_pengirim} → {item.nama_penerima}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${statusStyle[item.status_id] ?? "bg-slate-100 text-slate-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotStyle[item.status_id] ?? "bg-slate-400"}`} />
                        {statusMap[item.status_id] || "-"}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="sm:hidden space-y-3">
            {data.terbaru.map((item: any) => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-2xl p-4 hover:bg-[#F7FAF8] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-emerald-700 font-semibold text-sm">{item.resi}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusStyle[item.status_id] ?? "bg-slate-100 text-slate-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotStyle[item.status_id] ?? "bg-slate-400"}`} />
                    {statusMap[item.status_id] || "-"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 break-words">
                  {item.nama_pengirim} <span className="text-gray-400">→</span> {item.nama_penerima}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
