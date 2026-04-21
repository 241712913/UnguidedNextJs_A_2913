"use client";

import { X } from "lucide-react";

export default function ResiModal({ data, onClose }: any) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      
      {/* CARD */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 bg-white/20 p-2 rounded-full"
          >
            <X size={18} />
          </button>

          <p className="text-sm opacity-90">Nomor Resi</p>
          <h1 className="text-2xl font-bold tracking-widest font-mono">
            {data.resi}
          </h1>
          <p className="text-xs opacity-80 mt-1">
            {data.tanggal}
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* STATUS */}
          <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-emerald-600">
                {data.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Estimasi</p>
              <p className="font-semibold">{data.estimasi}</p>
            </div>
          </div>

          {/* PENGIRIM */}
          <div>
            <h2 className="font-semibold mb-3">👤 Pengirim</h2>
            <div className="text-sm space-y-1 text-gray-600">
              <p>{data.namaPengirim}</p>
              <p>{data.hpPengirim}</p>
              <p>{data.alamatPengirim}</p>
            </div>
          </div>

          {/* PENERIMA */}
          <div>
            <h2 className="font-semibold mb-3">👥 Penerima</h2>
            <div className="text-sm space-y-1 text-gray-600">
              <p>{data.namaPenerima}</p>
              <p>{data.hpPenerima}</p>
              <p>{data.alamatPenerima}</p>
            </div>
          </div>

          {/* DETAIL */}
          <div>
            <h2 className="font-semibold mb-3">📦 Detail</h2>
            <div className="text-sm space-y-2">
              <p>Berat: <b>{data.berat} kg</b></p>
              <p>Metode: <b>{data.metode}</b></p>
              <p>Barang: <b>{data.deskripsiBarang}</b></p>
            </div>
          </div>

          {/* TOTAL */}
          <div className="flex justify-between border-t pt-4 text-lg">
            <span>Total</span>
            <span className="font-bold text-emerald-600">
              Rp {data.totalOngkir.toLocaleString("id-ID")}
            </span>
          </div>

          {/* BUTTON */}
          <div className="space-y-3">
            <button
              onClick={() => window.print()}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl"
            >
              Cetak Resi
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 py-3 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}