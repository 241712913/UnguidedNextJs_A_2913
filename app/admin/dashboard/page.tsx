"use client";

import { useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 mb-5 ml-3 mr-3 mt-5 rounded-2xl flex justify-between items-center shadow">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-sm opacity-90">
            Overview bisnis SahabatKargo.id hari ini
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm">Total Pendapatan</p>
          <h2 className="text-3xl font-bold">Rp 85.600</h2>
          <p className="text-xs opacity-80">20% success rate</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-5 ml-3 mr-3">

        <div className="bg-blue-100 border border-blue-300 p-5 rounded-2xl">
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-gray-600">Total Pengiriman</p>
          <p className="text-xs text-gray-400">Terkirim</p>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 p-5 rounded-2xl">
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm text-gray-600">Paket Aktif</p>
          <p className="text-xs text-gray-400">Sedang berjalan</p>
        </div>

        <div className="bg-green-100 border border-green-300 p-5 rounded-2xl">
          <p className="text-2xl font-bold">1</p>
          <p className="text-sm text-gray-600">Berhasil Terkirim</p>
          <p className="text-xs text-gray-400">20% success rate</p>
        </div>

        <div className="bg-red-100 border border-red-300 p-5 rounded-2xl">
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-600">Pengiriman Gagal</p>
          <p className="text-xs text-gray-400">Perlu tindakan</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        <div className="col-span-2 bg-white p-5 mb-5 ml-3 mr-3 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">Tren Pengiriman</h2>
          <p className="text-xs text-gray-400 mb-4">7 hari terakhir</p>

          <div className="h-48 flex items-end justify-between px-4">
            {[0, 0, 0, 0, 0, 1, 5].map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="bg-green-600 w-6 rounded-t-md"
                  style={{ height: `${val * 20}px` }}
                />
                <span className="text-xs mt-1 text-gray-400">
                  {["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 mb-5 mr-3 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Layanan</h2>

          <div className="space-y-4 text-sm">

            <div>
              <div className="flex justify-between">
                <span>Reguler</span>
                <span>40%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div className="h-2 bg-green-600 rounded-full w-[40%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Express</span>
                <span>40%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div className="h-2 bg-green-500 rounded-full w-[40%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Same Day</span>
                <span>20%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div className="h-2 bg-yellow-400 rounded-full w-[20%]" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-white p-5 ml-3 mr-3 mb-5 rounded-2xl shadow">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Daftar Pengiriman</h2>

          <div className="flex gap-2">
            <select className="border rounded-lg px-8 py-1 text-sm">
              <option>Tanggal</option>
            </select>
            <select className="border rounded-lg px-10 py-1 text-sm">
              <option>Semua Status</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th className="py-2">Nomor Resi</th>
              <th>Pengirim → Penerima</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">

            <tr className="border-b">
              <td className="py-3 text-green-600">SK-8HJ2K9XMPL</td>
              <td>Bima Pratama → Sari Wijaya</td>
              <td>
                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                  Menunggu
                </span>
              </td>
              <td>10 Apr 26</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 text-green-600">SK-5TRW82NQPZ</td>
              <td>Dewi Lestari → Rudi Hartono</td>
              <td>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  Terkirim
                </span>
              </td>
              <td>10 Apr 26</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 text-green-600">SK-9PLM67BVCK</td>
              <td>Andi Saputra → Lisa Permata</td>
              <td>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  Dijemput
                </span>
              </td>
              <td>10 Apr 26</td>
            </tr>

            <tr>
              <td className="py-3 text-green-600">SK-3FGH41RSTY</td>
              <td>Nina Safitri → Doni Prasetyo</td>
              <td>
                <span className="bg-cyan-100 text-cyan-600 px-2 py-1 rounded-full text-xs">
                  Sedang Diantar
                </span>
              </td>
              <td>10 Apr 26</td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}