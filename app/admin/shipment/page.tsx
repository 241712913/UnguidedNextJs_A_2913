"use client";

import { useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";
import { Search } from "lucide-react";

export default function ShipmentPage() {
  const [open, setOpen] = useState(false);

  const [shipments] = useState([
    {
      resi: "SK-8HJ2K9XMPL",
      sender_name: "Bima Pratama",
      receiver_name: "Sari Wijaya",
      status: "Menunggu",
      date: "22 Apr 26",
    },
    {
      resi: "SK-5TRW82NQPZ",
      sender_name: "Dewi Lestari",
      receiver_name: "Rudi Hartono",
      status: "Terkirim",
      date: "22 Apr 26",
    },
    {
      resi: "SK-9PLM67BVCK",
      sender_name: "Andi Saputra",
      receiver_name: "Lisa Permata",
      status: "Dijemput",
      date: "22 Apr 26",
    },
    {
      resi: "SK-3FGH41RSTY",
      sender_name: "Nina Safitri",
      receiver_name: "Doni Prasetyo",
      status: "Sedang Diantar",
      date: "22 Apr 26",
    },
    {
      resi: "SK-NEW001",
      sender_name: "Rina Putri",
      receiver_name: "Agus Salim",
      status: "Menunggu",
      date: "22 Apr 26",
    },
  ]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-3">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 flex items-center justify-between shadow">
          <div>
            <h1 className="text-xl font-bold">Daftar Pengiriman</h1>
            <p className="text-green-100 mt-1 text-sm">
              {shipments.length} total pengiriman
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/admin/create")}
            className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm"
          >
            + Tambah
          </button>
        </div>

        {/* FILTER */}
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

          <select className="border border-gray-200 rounded-xl px-10 py-3">
            <option>Tanggal</option>
          </select>

          <select className="border border-gray-200 rounded-xl px-10 py-3">
            <option>Semua Status</option>
            <option>Menunggu</option>
            <option>Dijemput</option>
            <option>Dalam Perjalanan</option>
            <option>Sedang Diantar</option>
            <option>Terkirim</option>
            <option>Gagal</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Resi</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Pengirim</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Penerima</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Tanggal</th>
                <th className="px-6 py-4 text-center text-sm text-gray-600">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-green-600 font-medium">
                    {item.resi}
                  </td>

                  <td className="px-6 py-4">{item.sender_name}</td>

                  <td className="px-6 py-4">{item.receiver_name}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Menunggu"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "Terkirim"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Dijemput"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-cyan-100 text-cyan-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {item.date}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="text-green-600 hover:underline text-sm">
                      Detail
                    </button>
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