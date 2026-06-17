"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Clock, Truck, CheckCircle2, Package, Home, CheckCheck,
  ArrowLeft, ChevronDown, ChevronUp, MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

type TrackingResult = {
  resi: string;
  status: string;
  status_id: number;
  nama_pengirim: string;
  nama_penerima: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  kota_penerima?: string;
  kecamatan_penerima?: string;
  berat?: number;
  ongkir?: number;
  created_at?: string;
};

const STATUS_ID_MAP: Record<string, number> = {
  Menunggu: 1,
  Dijemput: 2,
  "Dalam Perjalanan": 3,
  Diantar: 4,
  Terkirim: 5,
  Gagal: 6,
};

const TIMELINE_STEPS = [
  {
    status_id: 1,
    label: "Menunggu",
    desc: "Pesanan telah dibuat",
    icon: Clock,
  },
  {
    status_id: 2,
    label: "Dijemput",
    desc: "Paket telah dijemput kurir",
    icon: Package,
  },
  {
    status_id: 3,
    label: "Dalam Perjalanan",
    desc: "Paket sedang menuju kota tujuan",
    icon: Truck,
  },
  {
    status_id: 4,
    label: "Diantar",
    desc: "Kurir sedang mengantar paket",
    icon: Home,
  },
  {
    status_id: 5,
    label: "Terkirim",
    desc: "Paket berhasil diterima",
    icon: CheckCheck,
  },
];

function TrackingTimeline({ statusId }: { statusId: number }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
      <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Truck size={18} className="text-emerald-600" />
        Status Pengiriman
      </h2>

      <div className="relative">
        {/* Garis vertikal background */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

        {/* Garis vertikal progress */}
        <div
          className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-400 transition-all duration-700"
          style={{
            height: `${Math.min(((statusId - 1) / (TIMELINE_STEPS.length - 1)) * 100, 100)}%`,
          }}
        />

        <div className="space-y-2">
          {TIMELINE_STEPS.map((step, i) => {
            const done    = statusId > step.status_id;
            const active  = statusId === step.status_id;
            const pending = statusId < step.status_id;
            const Icon    = step.icon;

            return (
              <div key={step.status_id} className="relative flex items-start gap-4 pl-2">
                <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${done    ? "bg-emerald-500 shadow-lg shadow-emerald-200"            : ""}
                  ${active  ? "bg-emerald-600 shadow-xl shadow-emerald-300 scale-110"  : ""}
                  ${pending ? "bg-gray-100"                                             : ""}
                `}>
                  <Icon size={16} className={done || active ? "text-white" : "text-gray-400"} />
                  {active && (
                    <span className="absolute inset-0 rounded-2xl bg-emerald-400 animate-ping opacity-30" />
                  )}
                </div>

                <div className={`pb-6 flex-1 ${i === TIMELINE_STEPS.length - 1 ? "pb-0" : ""}`}>
                  <p className={`text-sm font-bold leading-tight
                    ${done    ? "text-emerald-600" : ""}
                    ${active  ? "text-emerald-700" : ""}
                    ${pending ? "text-gray-400"    : ""}
                  `}>
                    {step.label}
                    {done   && <span className="ml-2 text-xs font-normal text-emerald-400">✓ Selesai</span>}
                    {active && <span className="ml-2 text-xs font-normal text-emerald-500 animate-pulse">● Sekarang</span>}
                  </p>
                  <p className={`text-xs mt-0.5 ${pending ? "text-gray-300" : "text-gray-400"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {statusId === 5 && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Paket telah berhasil diterima! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default function TrackingClient() {
  const [result, setResult]     = useState<TrackingResult | null>(null);
  const [loading, setLoading]   = useState(true);

  const searchParams = useSearchParams();
  const router       = useRouter();

  useEffect(() => {
    const q = searchParams.get("resi");
    if (!q) { setLoading(false); return; }

    setLoading(true);
    fetch(`/api/tracking?resi=${encodeURIComponent(q.trim())}`)
      .then((r) => r.json())
      .then((data) => setResult(data.result || null))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const statusId = result
    ? (result.status_id ?? STATUS_ID_MAP[result.status] ?? 1)
    : 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 space-y-4 animate-pulse">
            <div className="h-6 w-40 bg-gray-100 rounded" />
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-3 w-48 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && !result && (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-slate-700">Resi tidak ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">Pastikan nomor resi yang kamu masukkan benar</p>
          </div>
        )}

        {/* RESULT */}
        {!loading && result && (
          <>
            {/* HERO */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-100">
              <p className="text-emerald-100 text-xs font-medium mb-2">Tracking Pengiriman</p>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{result.resi}</h1>
                  {result.created_at && (
                    <p className="text-sm text-emerald-50/80 mt-2">
                      {new Date(result.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <span className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md">
                  {result.status}
                </span>
              </div>
            </div>

            {/* TIMELINE */}
            <TrackingTimeline statusId={statusId} />

            {/* DETAIL */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-800">Info Pengiriman</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> Pengirim</p>
                  <p className="font-semibold text-slate-800 text-sm">{result.nama_pengirim}</p>
                  <p className="text-xs text-slate-500">{result.alamat_pengirim}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> Penerima</p>
                  <p className="font-semibold text-slate-800 text-sm">{result.nama_penerima}</p>
                  <p className="text-xs text-slate-500">{result.alamat_penerima}</p>
                  {result.kecamatan_penerima && (
                    <p className="text-xs text-slate-400">{result.kecamatan_penerima}, {result.kota_penerima}</p>
                  )}
                </div>
              </div>
              {result.berat && (
                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-500">Berat</span>
                  <span className="font-semibold text-slate-800">{result.berat} kg</span>
                </div>
              )}
              {result.ongkir && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Ongkir</span>
                  <span className="font-semibold text-emerald-600">Rp {Number(result.ongkir).toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}