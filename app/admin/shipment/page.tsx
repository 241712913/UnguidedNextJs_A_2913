"use client";

import { useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";
import { Search } from "lucide-react";

export default function ShipmentPage() {
  const [open, setOpen] = useState(false);
  const [shipments] = useState([]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-3">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 flex items-center justify-between shadow">
          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-xl font-bold">
                Daftar Pengiriman
              </h1>
              <p className="text-green-100 mt-1 text-sm">
                {shipments.length} total pengiriman
              </p>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/create")}
            className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm"
          >
            + Tambah
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari resi, pengirim, penerima..."
              className="w-full border border-gray-200 rounded-xl px-5 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select className="border border-gray-200 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Terbaru</option>
            <option>Terlama</option>
          </select>

          <select className="border border-gray-200 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Semua Lokasi</option>
          </select>

          <select className="border border-gray-200 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Semua Status</option>
            <option>Dijemput</option>
            <option>Menunggu</option>
            <option>Terkirim</option>
          </select>
        </div>

        {shipments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mb-6 text-3xl">
              📦
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum Ada Pengiriman
            </h3>

            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Kamu belum memiliki pengiriman apapun saat ini.
              Mulai buat pengiriman baru dengan menekan tombol Tambah di atas.
            </p>

          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Resi</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Pengirim</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Penerima</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>

              <tbody>
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}