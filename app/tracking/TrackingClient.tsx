"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

type TrackingResult = {
  resi: string;
  status: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  tanggal_kirim?: string;
  estimasi_tiba?: string;
  history?: {
    waktu: string;
    keterangan: string;
    lokasi: string;
  }[];
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
    step: number;
  }
> = {
  Diproses: {
    label: "Diproses",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <Clock size={16} />,
    step: 1,
  },
  Dikirim: {
    label: "Dalam Pengiriman",
    color: "text-sky-700",
    bg: "bg-sky-100",
    icon: <Truck size={16} />,
    step: 2,
  },
  Selesai: {
    label: "Terkirim",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: <CheckCircle2 size={16} />,
    step: 3,
  },
};

const STEPS = ["Pesanan Diproses", "Dalam Pengiriman", "Paket Tiba"];

export default function TrackingClient() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const doSearch = async (keyword: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/tracking?resi=${encodeURIComponent(keyword.trim())}`
      );

      const data = await res.json();
      setResult(data.result || null);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("resi");

    if (q) {
      doSearch(q);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const statusInfo = result
    ? STATUS_CONFIG[result.status] ?? STATUS_CONFIG["Diproses"]
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        {/* LOADING */}
        {loading && (
          <div className="bg-white p-6 rounded-xl animate-pulse">
            Loading...
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && !result && (
          <div className="bg-white p-6 rounded-xl text-center">
            📦 Resi tidak ditemukan
          </div>
        )}

        {/* RESULT */}
        {!loading && result && statusInfo && (
          <div className="space-y-5">

            {/* CARD */}
            <section className="bg-white rounded-xl p-6">

              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400">Resi</p>
                  <h1 className="text-xl font-bold">{result.resi}</h1>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>

              {/* STEPS */}
              <div className="flex mb-6">
                {STEPS.map((step, i) => {
                  const active = i < statusInfo.step;

                  return (
                    <div key={i} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>
                          {active ? "✓" : i + 1}
                        </div>
                        <p className="text-[10px] mt-1 text-center">{step}</p>
                      </div>

                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${i < statusInfo.step - 1 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DETAIL */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-xs text-slate-400">Pengirim</p>
                  <p>{result.alamat_pengirim}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Penerima</p>
                  <p>{result.alamat_penerima}</p>
                </div>
              </div>

            </section>

            {/* HISTORY */}
            {result.history && (
              <section className="bg-white rounded-xl p-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex justify-between"
                >
                  Riwayat
                  {showHistory ? <ChevronUp /> : <ChevronDown />}
                </button>

                {showHistory && (
                  <div className="mt-4 space-y-3">
                    {result.history.map((h, i) => (
                      <div key={i} className="text-sm border-l pl-3">
                        <p className="font-semibold">{h.keterangan}</p>
                        <p className="text-xs text-slate-400">
                          {h.lokasi} · {h.waktu}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  );
}