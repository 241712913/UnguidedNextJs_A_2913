"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";

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

const STEPS = [
  "Pesanan Diproses",
  "Dalam Pengiriman",
  "Paket Tiba",
];

export default function TrackingDetailPage() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const q = searchParams?.get("resi") || "";

    if (q) {
      doSearch(q);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

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

  const statusInfo = result
    ? STATUS_CONFIG[result.status] ?? STATUS_CONFIG["Diproses"]
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-4 animate-pulse">
            <div className="h-6 w-40 bg-slate-100 rounded-xl" />
            <div className="h-4 w-64 bg-slate-100 rounded-xl" />
            <div className="h-4 w-52 bg-slate-100 rounded-xl" />
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && !result && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center">
            <div className="text-5xl mb-4">📦</div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Resi tidak ditemukan
            </h2>

            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Nomor resi yang kamu buka tidak tersedia atau sudah tidak aktif.
            </p>
          </div>
        )}

        {/* RESULT */}
        {!loading && result && statusInfo && (
          <div className="space-y-5">

            {/* STATUS CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">

              {/* TOP */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
                    Nomor Resi
                  </p>

                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {result.resi}
                  </h1>
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color}`}
                >
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              {/* PROGRESS */}
              <div className="flex items-center gap-0 mb-8">
                {STEPS.map((step, i) => {
                  const active = i < statusInfo.step;
                  const current = i === statusInfo.step - 1;

                  return (
                    <div
                      key={i}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                          ${
                            active
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }
                          ${
                            current
                              ? "ring-4 ring-emerald-100"
                              : ""
                          }
                        `}
                        >
                          {active ? "✓" : i + 1}
                        </div>

                        <p
                          className={`text-[11px] md:text-xs text-center leading-tight max-w-[80px]
                          ${
                            active
                              ? "text-emerald-700 font-semibold"
                              : "text-slate-400"
                          }
                        `}
                        >
                          {step}
                        </p>
                      </div>

                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 mb-5 rounded-full
                          ${
                            i < statusInfo.step - 1
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          }
                        `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-2 gap-5 border-t border-slate-100 pt-6">

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Alamat Pengirim
                    </p>

                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {result.alamat_pengirim}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Alamat Penerima
                    </p>

                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {result.alamat_penerima}
                    </p>
                  </div>
                </div>

                {result.tanggal_kirim && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-slate-500" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        Tanggal Kirim
                      </p>

                      <p className="text-sm font-medium text-slate-700">
                        {result.tanggal_kirim}
                      </p>
                    </div>
                  </div>
                )}

                {result.estimasi_tiba && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        Estimasi Tiba
                      </p>

                      <p className="text-sm font-semibold text-emerald-700">
                        {result.estimasi_tiba}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* HISTORY */}
            {result.history && result.history.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between px-6 py-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>Riwayat Perjalanan Paket</span>

                  {showHistory ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {showHistory && (
                  <div className="px-6 pb-6 space-y-5">
                    {result.history.map((h, i) => (
                      <div key={i} className="flex gap-4">

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3.5 h-3.5 rounded-full mt-1
                            ${
                              i === 0
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }
                          `}
                          />

                          {i < result.history!.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200 mt-2" />
                          )}
                        </div>

                        <div className="pb-2">
                          <p className="text-sm font-semibold text-slate-700">
                            {h.keterangan}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {h.lokasi} · {h.waktu}
                          </p>
                        </div>
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