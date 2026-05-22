"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [tanggalFilter, setTanggalFilter] =
    useState("all");

  const statusMap: any = {
    1: "Menunggu",
    2: "Dijemput",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
    6: "Gagal",
  };

  useEffect(() => {
    fetch(
      `/api/dashboard?status=${statusFilter}&tanggal=${tanggalFilter}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [statusFilter, tanggalFilter]);

  // LOADING
if (!data) {

  return (
    <div className="bg-[#F3F5F4] min-h-screen">

      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      <div className="p-3 space-y-4 animate-pulse">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 border border-white/10 text-white p-6 rounded-[30px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row justify-between gap-4">

          <div>

            <div className="h-8 w-60 bg-white/25 rounded-xl"></div>

            <div className="h-4 w-40 bg-white/15 rounded mt-3"></div>

          </div>

          <div className="sm:text-right">

            <div className="h-4 w-32 bg-white/15 rounded ml-auto"></div>

            <div className="h-10 w-52 bg-white/25 rounded-xl mt-3 ml-auto"></div>

            <div className="h-3 w-40 bg-white/10 rounded mt-3 ml-auto"></div>

          </div>

        </div>

        {/* CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {[1,2,3,4].map((item)=>(
            <div
              key={item}
              className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >

              <div className="h-9 w-20 bg-gray-200 rounded-xl"></div>

              <div className="h-4 w-32 bg-gray-100 rounded mt-4"></div>

              <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>

            </div>
          ))}

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* GRAFIK */}
          <div className="lg:col-span-2 bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

            <div className="mb-6">

              <div className="h-5 w-40 bg-gray-200 rounded"></div>

              <div className="h-3 w-44 bg-gray-100 rounded mt-2"></div>

            </div>

            <div className="h-64 flex items-end justify-between gap-3">

              {[1,2,3,4,5,6,7].map((bar)=>(
                <div
                  key={bar}
                  className="flex-1 flex flex-col items-center"
                >

                  <div className="h-3 w-6 bg-gray-200 rounded mb-2"></div>

                  <div
                    className="w-full max-w-[45px] bg-gray-200 rounded-t-[20px]"
                    style={{
                      height: `${40 + bar * 18}px`,
                    }}
                  />

                  <div className="h-3 w-8 bg-gray-100 rounded mt-3"></div>

                </div>
              ))}

            </div>

          </div>

          {/* LAYANAN */}
          <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

            <div className="h-5 w-44 bg-gray-200 rounded mb-6"></div>

            <div className="space-y-5">

              {[1,2,3,4].map((item)=>(
                <div key={item}>

                  <div className="flex justify-between mb-2">

                    <div className="h-4 w-28 bg-gray-200 rounded"></div>

                    <div className="h-4 w-10 bg-gray-100 rounded"></div>

                  </div>

                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-3 bg-gray-200 rounded-full"
                      style={{
                        width: `${30 + item * 12}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

            <div>

              <div className="h-5 w-48 bg-gray-200 rounded"></div>

              <div className="h-3 w-36 bg-gray-100 rounded mt-2"></div>

            </div>

            <div className="flex flex-col md:flex-row gap-3">

              <div className="h-12 w-44 bg-gray-100 rounded-2xl"></div>

              <div className="h-12 w-44 bg-gray-100 rounded-2xl"></div>

              <div className="h-12 w-44 bg-gray-200 rounded-2xl"></div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-gray-100">

                  {[1,2,3,4].map((i)=>(
                    <th
                      key={i}
                      className="py-3"
                    >
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {[1,2,3,4,5].map((row)=>(
                  <tr
                    key={row}
                    className="border-b border-gray-50"
                  >

                    <td className="py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>

                    <td>
                      <div className="h-4 w-52 bg-gray-100 rounded"></div>
                    </td>

                    <td>
                      <div className="h-8 w-28 bg-green-100 rounded-full"></div>
                    </td>

                    <td>
                      <div className="h-4 w-24 bg-gray-100 rounded"></div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}
  return (
    <div className="bg-[#F3F5F4] min-h-screen">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 border border-white/10 text-white p-6 m-3 mt-5 rounded-[30px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">
            Dashboard Admin
          </h1>

          <p className="text-sm opacity-80 mt-2">
            Overview bisnis SahabatKargo.id
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm opacity-70">
            Total Pendapatan
          </p>

          <h2 className="text-3xl font-bold mt-1">
            Rp{" "}
            {Number(
              data.pendapatan[0].total || 0
            ).toLocaleString("id-ID")}
          </h2>

          <p className="text-xs opacity-70 mt-2">
            Seluruh transaksi pengiriman
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-3">

        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <p className="text-3xl font-bold text-[#214038]">
            {data.totalPengiriman[0].count}
          </p>

          <p className="text-sm text-gray-700 mt-3">
            Total Pengiriman
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Semua pengiriman
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <p className="text-3xl font-bold text-[#B08930]">
            {data.aktif[0].count}
          </p>

          <p className="text-sm text-gray-700 mt-3">
            Paket Aktif
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Sedang berjalan
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <p className="text-3xl font-bold text-[#18352D]">
            {data.berhasil[0].count}
          </p>

          <p className="text-sm text-gray-700 mt-3">
            Berhasil Terkirim
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Pengiriman sukses
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <p className="text-3xl font-bold text-red-600">
            {data.gagal[0].count}
          </p>

          <p className="text-sm text-gray-700 mt-3">
            Pengiriman Gagal
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Perlu tindakan
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">

        {/* GRAFIK */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800">
              Tren Pengiriman
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Statistik mingguan Senin - Minggu
            </p>
          </div>

          <div className="h-64 flex items-end justify-between gap-3">

            {data.tren.map((item: any, i: number) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center"
              >

                <span className="text-xs text-gray-500 mb-2">
                  {item.total}
                </span>

                <div
                  className="w-full max-w-[45px] bg-gradient-to-t from-green-700 to-green-500 rounded-t-[20px] hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(33,64,56,0.2)]"
                  style={{
                    height: `${Math.max(
                      Number(item.total) * 18,
                      20
                    )}px`,
                  }}
                />

                <span className="text-xs text-gray-500 mt-3">
                  {item.hari}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* LAYANAN */}
        <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

          <h2 className="font-semibold text-gray-800 mb-6">
            Layanan Terpopuler
          </h2>

          <div className="space-y-5">

            {data.layanan.map((item: any, i: number) => {

              const persen =
                (Number(item.total) /
                  Number(
                    data.totalPengiriman[0].count || 1
                  )) * 100;

              return (
                <div key={i}>

                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {item.layanan}
                    </span>

                    <span className="text-sm text-[#18352D] font-semibold">
                      {Math.round(persen)}%
                    </span>
                  </div>

                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-3 bg-gradient-to-r from-green-700 to-green-500 rounded-full"
                      style={{
                        width: `${persen}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[28px] p-5 m-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

          <div>
            <h2 className="font-semibold text-gray-800">
              5 Pengiriman Terbaru
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Data realtime database
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="bg-[#F6F7F7] border border-[#D9E1DD] rounded-2xl px-4 py-3 text-sm outline-none"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="1">
                Menunggu
              </option>

              <option value="2">
                Dijemput
              </option>

              <option value="3">
                Dalam perjalanan
              </option>

              <option value="4">
                Diantar
              </option>

              <option value="5">
                Terkirim
              </option>

              <option value="6">
                Gagal
              </option>
            </select>

            <input
              type="date"
              value={
                tanggalFilter === "all"
                  ? ""
                  : tanggalFilter
              }
              onChange={(e) =>
                setTanggalFilter(
                  e.target.value || "all"
                )
              }
              className="bg-[#F6F7F7] border border-[#D9E1DD] rounded-2xl px-4 py-3 text-sm outline-none"
            />

            <a
              href="/api/laporan"
              className="bg-gradient-to-r from-green-700 to-green-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              Download Laporan
            </a>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-sm">

            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">

                <th className="py-3">
                  Nomor Resi
                </th>

                <th>
                  Pengirim → Penerima
                </th>

                <th>
                  Status
                </th>

                <th>
                  Tanggal
                </th>

              </tr>
            </thead>

            <tbody>

              {data.terbaru.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#F7FAF8] transition-all duration-300"
                >

                  <td className="py-4 text-green-700 font-semibold">
                    {item.resi}
                  </td>

                  <td>
                    {item.nama_pengirim} →{" "}
                    {item.nama_penerima}
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {statusMap[
                        item.status_id
                      ] || "-"}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString("id-ID")}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}