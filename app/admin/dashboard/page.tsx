"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const statusMap: any = {
    1: "Menunggu",
    2: "Dijemput",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
    6: "Gagal",
  };

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!data) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      <div className="p-3 space-y-3">

        {/* HEADER SKELETON */}
        <div className="bg-white rounded-2xl p-6 shadow animate-pulse">
          <div className="h-6 w-52 bg-gray-200 rounded mb-3"></div>

          <div className="h-4 w-72 bg-gray-100 rounded"></div>
        </div>

        {/* CARD SKELETON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-5 shadow animate-pulse"
            >
              <div className="h-8 w-16 bg-gray-200 rounded mb-3"></div>

              <div className="h-4 w-28 bg-gray-100 rounded mb-2"></div>

              <div className="h-3 w-20 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* GRAFIK */}
        <div className="bg-white rounded-2xl p-5 shadow animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-6"></div>

          <div className="flex items-end justify-between h-52">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <div
                key={bar}
                className="w-10 bg-gray-200 rounded-t-xl"
                style={{
                  height: `${40 + bar * 15}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* TABLE SKELETON */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="animate-pulse space-y-4">

            <div className="h-5 w-52 bg-gray-200 rounded"></div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </th>

                    <th>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </th>

                    <th>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </th>

                    <th>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr
                      key={row}
                      className="border-b"
                    >
                      <td className="py-4">
                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                      </td>

                      <td>
                        <div className="h-4 w-48 bg-gray-100 rounded"></div>
                      </td>

                      <td>
                        <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
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
    </div>
  );
}

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4 sm:p-6 m-3 mt-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 shadow">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">
            Dashboard Admin
          </h1>

          <p className="text-xs sm:text-sm opacity-90">
            Overview bisnis SahabatKargo.id hari ini
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs sm:text-sm">
            Total Pendapatan
          </p>

          <h2 className="text-xl sm:text-2xl font-bold">
            Rp{" "}
            {Number(
              data.pendapatan[0].total || 0
            ).toLocaleString("id-ID")}
          </h2>

          <p className="text-xs opacity-80">
            Dari seluruh transaksi pengiriman
          </p>
        </div>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-3">
        <div className="bg-blue-100 border border-blue-300 p-4 rounded-2xl">
          <p className="text-xl font-bold">
            {data.totalPengiriman[0].count}
          </p>

          <p className="text-sm text-gray-600">
            Total Pengiriman
          </p>

          <p className="text-xs text-gray-400">
            Semua pengiriman
          </p>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-2xl">
          <p className="text-xl font-bold">
            {data.aktif[0].count}
          </p>

          <p className="text-sm text-gray-600">
            Paket Aktif
          </p>

          <p className="text-xs text-gray-400">
            Sedang berjalan
          </p>
        </div>

        <div className="bg-green-100 border border-green-300 p-4 rounded-2xl">
          <p className="text-xl font-bold">
            {data.berhasil[0].count}
          </p>

          <p className="text-sm text-gray-600">
            Berhasil Terkirim
          </p>

          <p className="text-xs text-gray-400">
            Pengiriman sukses
          </p>
        </div>

        <div className="bg-red-100 border border-red-300 p-4 rounded-2xl">
          <p className="text-xl font-bold">
            {data.gagal[0].count}
          </p>

          <p className="text-sm text-gray-600">
            Pengiriman Gagal
          </p>

          <p className="text-xs text-gray-400">
            Perlu tindakan
          </p>
        </div>
      </div>

      {/* GRAFIK + LAYANAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">
        {/* GRAFIK */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Tren Pengiriman
          </h2>

          <p className="text-xs text-gray-400 mb-4">
            7 hari terakhir
          </p>

          <div className="h-48 flex items-end justify-between px-2 sm:px-4">
            {data.tren.map((item: any, i: number) => (
              <div
                key={i}
                className="flex flex-col items-center"
              >
                <div
                  className="bg-green-600 w-5 sm:w-7 rounded-t-md"
                  style={{
                    height: `${Number(item.total) * 20}px`,
                  }}
                />

                <span className="text-[10px] sm:text-xs mt-2 text-gray-400">
                  {new Date(item.tanggal).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "short",
                    }
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LAYANAN */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">
            Layanan Terpopuler
          </h2>

          <div className="space-y-4 text-sm">
            {data.layanan.map((item: any, i: number) => {
              const persen =
                (Number(item.total) /
                  Number(
                    data.totalPengiriman[0].count || 1
                  )) *
                100;

              return (
                <div key={i}>
                  <div className="flex justify-between">
                    <span>{item.layanan}</span>

                    <span>
                      {Math.round(persen)}%
                    </span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-2 bg-green-600 rounded-full"
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
      <div className="bg-white p-4 m-3 rounded-2xl shadow">
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center mb-4">
          <h2 className="font-semibold">
            5 Pengiriman Terbaru
          </h2>

          <div className="text-sm text-gray-500">
            Data realtime dari database
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="py-2">Nomor Resi</th>
                <th>Pengirim → Penerima</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {data.terbaru.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="py-3 text-green-600 font-medium">
                    {item.resi}
                  </td>

                  <td>
                    {item.nama_pengirim} →{" "}
                    {item.nama_penerima}
                  </td>

                  <td>
                    {statusMap[item.status_id] || "-"}
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