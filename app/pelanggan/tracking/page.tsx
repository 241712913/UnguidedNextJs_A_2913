"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import {
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { shipments } from "@/app/data/shipment";

export default function TrackingPage() {
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [resi, setResi] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [searched, setSearched] = useState(false); 

  const handleSearch = () => {
    setSearched(true);

    const found = shipments.filter((s: any) =>
      s.resi.toLowerCase().includes(resi.toLowerCase())
    );

    setResult(found);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-3">

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl p-6">
          <h1 className="text-xl font-bold">Lacak Pengiriman</h1>
          <p className="text-sm opacity-90 mb-4">
            Masukkan nomor resi untuk melihat status paket
          </p>

          <div className="flex gap-2">
            <div className="flex items-center bg-white rounded-xl px-3 py-2 flex-1">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                placeholder="Masukkan nomor resi..."
                className="w-full outline-none text-black"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-white text-emerald-600 px-5 rounded-xl font-semibold"
            >
              Cari
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex justify-between p-4"
          >
            Cara menemukan nomor resi
            {showGuide ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showGuide && (
            <div className="px-4 pb-4 text-sm text-gray-600">
              <p>• Cek email konfirmasi</p>
              <p>• Lihat riwayat pengiriman</p>
              <p>• Cek struk pengiriman</p>
            </div>
          )}
        </div>

        {searched && (
          <div className="space-y-3">
            {result.length > 0 ? (
              result.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/pelanggan/history/${item.id}`}
                  className="block bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  <p className="font-bold text-lg">{item.resi}</p>
                  <p className="text-sm text-gray-500">
                    {item.from} → {item.to}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Status: {item.status}
                  </p>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6">
                Resi tidak ditemukan
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}