"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import {
  ArrowLeft,
  MapPin,
  Package,
  Star,
} from "lucide-react";
import { shipments } from "@/app/data/shipment";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [ulasan, setUlasan] = useState("");

  const shipment = shipments.find(
    (item) => item.id === params.id
  );

  if (!shipment) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="p-3 md:p-3 space-y-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Nomor resi</p>
          <h1 className="text-xl font-bold mt-1">
            {shipment.resi}
          </h1>

          <span className="inline-block mt-3 bg-white/20 px-3 py-1 rounded-full text-xs">
            {shipment.status}
          </span>

          <p className="text-xs opacity-80 mt-2">
            Tanggal: {shipment.date}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border">
          <div className="grid grid-cols-3 text-center text-sm">
            <div>
              <MapPin className="mx-auto text-emerald-500 mb-1" size={18} />
              <p className="text-gray-400 text-xs">Asal</p>
              <p className="font-semibold">{shipment.from}</p>
            </div>

            <div>
              <Package className="mx-auto text-gray-400 mb-1" size={18} />
              <p className="text-gray-400 text-xs">Berat</p>
              <p className="font-semibold">{shipment.weight}</p>
            </div>

            <div>
              <MapPin className="mx-auto text-yellow-500 mb-1" size={18} />
              <p className="text-gray-400 text-xs">Tujuan</p>
              <p className="font-semibold">{shipment.to}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border">
            <p className="text-xs text-gray-400">Pengirim</p>
            <p className="font-semibold">{shipment.sender}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border">
            <p className="text-xs text-gray-400">Penerima</p>
            <p className="font-semibold">{shipment.receiver}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border">
          <h2 className="font-semibold mb-6">
            Riwayat Pengiriman
          </h2>

          <div className="space-y-6 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-[2px] before:bg-gray-200">
            {shipment.logs.map((log, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-6 h-6 bg-emerald-500 rounded-full z-10 mt-1"></div>

                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {log.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.desc}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between text-sm">
            <span className="text-gray-500">
              Ongkos Kirim
            </span>
            <span className="font-semibold text-emerald-600">
              {shipment.price}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h2 className="font-semibold text-lg mb-2">
            Beri Ulasan SahabatKargo
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Bagaimana pengalaman pengiriman kamu?
          </p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                key={item}
                onClick={() => setRating(item)}
                className="transition hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    item <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            placeholder="Tulis pengalaman kamu..."
            className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500"
          />

          <button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-medium transition">
            Kirim Ulasan
          </button>
        </div>

      </div>
    </div>
  );
}