"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import Sidebar from "@/app/pelanggan/ui/sidebar";

import {
  ArrowLeft,
  MapPin,
  Package,
  Star,
  Wallet,
  User,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const STATUS_MAP: Record<number, string> = {
  1: "Menunggu",
  2: "Transit",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
};

const STATUS_STYLE: Record<string, string> = {
  Menunggu:           "bg-amber-100 text-amber-700 border border-amber-200",
  Transit:            "bg-sky-100 text-sky-700 border border-sky-200",
  "Dalam perjalanan": "bg-blue-100 text-blue-700 border border-blue-200",
  Diantar:            "bg-violet-100 text-violet-700 border border-violet-200",
  Terkirim:           "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

// Ganti dengan session user kalau sudah ada auth
const PELANGGAN_ID = 1;

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State ulasan
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ulasan, setUlasan] = useState("");
  const [ulasanSudahAda, setUlasanSudahAda] = useState(false);
  const [ulasanLama, setUlasanLama] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch data pengiriman
  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/pengiriman/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        setShipment({
          ...result,
          status: result?.status ?? STATUS_MAP[result?.status_id] ?? "Menunggu",
        });
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [params.id]);

  // Fetch ulasan yang sudah ada (kalau pernah submit)
  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/ulasan?pengiriman_id=${params.id}&pelanggan_id=${PELANGGAN_ID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ulasan) {
          setUlasanLama(data.ulasan);
          setUlasanSudahAda(true);
          setRating(data.ulasan.rating);
          setUlasan(data.ulasan.komentar ?? "");
        }
      })
      .catch(console.log);
  }, [params.id]);

  const handleSubmitUlasan = async () => {
    if (rating === 0) {
      setSubmitError("Pilih bintang dulu ya!");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/ulasan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pengiriman_id: Number(params.id),
          pelanggan_id:  PELANGGAN_ID,
          rating,
          komentar: ulasan.trim() || null,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSubmitSuccess(true);
        setUlasanSudahAda(true);
        setUlasanLama(result.data);
      } else {
        setSubmitError(result.message || "Gagal mengirim ulasan");
      }
    } catch {
      setSubmitError("Terjadi kesalahan, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 p-4 space-y-4">
        <div className="bg-white rounded-3xl p-7 animate-pulse border border-emerald-100">
          <div className="h-4 w-32 bg-emerald-100 rounded-xl mb-3"></div>
          <div className="h-8 w-56 bg-emerald-100 rounded-xl mb-3"></div>
          <div className="h-5 w-28 bg-emerald-50 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-emerald-100 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 mb-4"></div>
              <div className="h-4 w-20 bg-emerald-100 rounded mb-2"></div>
              <div className="h-5 w-28 bg-emerald-50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!shipment) return <div className="p-6">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="p-4 space-y-4">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition text-sm font-medium"
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        {/* HERO */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-100">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-300/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-emerald-100 text-xs font-medium mb-2">Detail Pengiriman</p>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{shipment.resi}</h1>
                <p className="text-sm text-emerald-50/80 mt-2">
                  {new Date(shipment.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md ${STATUS_STYLE[shipment.status] || "bg-white/20 text-white border border-white/20"}`}>
                {shipment.status}
              </span>
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <MapPin size={20} className="text-emerald-600" />
            </div>
            <p className="text-xs text-slate-400 mb-1">Alamat Pengirim</p>
            <p className="font-semibold text-slate-800 leading-relaxed">{shipment.alamat_pengirim}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-4">
              <Package size={20} className="text-sky-600" />
            </div>
            <p className="text-xs text-slate-400 mb-1">Berat Paket</p>
            <p className="font-semibold text-slate-800">{shipment.berat} kg</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <MapPin size={20} className="text-amber-600" />
            </div>
            <p className="text-xs text-slate-400 mb-1">Alamat Penerima</p>
            <p className="font-semibold text-slate-800 leading-relaxed">{shipment.alamat_penerima}</p>
          </div>
        </div>

        {/* PENGIRIM / PENERIMA */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <User size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Pengirim</p>
                <p className="font-semibold text-slate-800">{shipment.nama_pengirim}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                <User size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Penerima</p>
                <p className="font-semibold text-slate-800">{shipment.nama_penerima}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ONGKIR */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Wallet size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Ongkos Kirim</p>
                <p className="font-semibold text-slate-800">Total Pembayaran</p>
              </div>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              Rp{Number(shipment.ongkir).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* REPEAT ORDER */}
        <button
          onClick={() => router.push(`/pelanggan/create?repeat=${shipment.id}`)}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-3xl font-bold text-base transition shadow-lg shadow-emerald-100"
        >
          <RotateCcw size={18} />
          Repeat Order — Kirim Lagi ke {shipment.nama_penerima}
        </button>

        {/* ULASAN */}
        <div className="bg-white rounded-[32px] p-6 border border-emerald-100 shadow-sm">

          {/* Sudah submit & sukses */}
          {submitSuccess ? (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <p className="font-bold text-lg text-slate-800">Ulasan Terkirim!</p>
              <p className="text-sm text-slate-400">Terima kasih sudah memberikan penilaian.</p>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={24} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                ))}
              </div>
              {ulasan && <p className="text-sm text-slate-600 italic bg-slate-50 rounded-2xl px-4 py-2 mt-1">"{ulasan}"</p>}
            </div>

          ) : ulasanSudahAda && ulasanLama ? (
            // Sudah pernah ulasan sebelumnya — tampilkan + bisa edit
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-slate-800">Ulasanmu</h2>
                <span className="text-xs text-slate-400">
                  {new Date(ulasanLama.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={28} className={i <= ulasanLama.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                ))}
              </div>
              {ulasanLama.komentar && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-2xl px-4 py-3 mb-4">
                  "{ulasanLama.komentar}"
                </p>
              )}

              {/* Tombol edit ulasan */}
              <button
                onClick={() => { setUlasanSudahAda(false); setSubmitSuccess(false); }}
                className="text-sm text-emerald-600 font-semibold hover:underline"
              >
                ✏️ Ubah Ulasan
              </button>
            </div>

          ) : (
            // Form ulasan baru / edit
            <>
              <h2 className="font-bold text-xl text-slate-800 mb-1">Beri Ulasan</h2>
              <p className="text-sm text-slate-400 mb-5">Bagaimana pengalaman pengiriman kamu?</p>

              {/* Bintang interaktif */}
              <div className="flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRating(item)}
                    onMouseEnter={() => setHoverRating(item)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      size={36}
                      className={
                        item <= (hoverRating || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>

              {/* Label rating */}
              {(hoverRating || rating) > 0 && (
                <p className="text-sm font-semibold text-emerald-700 -mt-3 mb-4">
                  {["", "Sangat Buruk 😞", "Buruk 😕", "Cukup 😐", "Baik 😊", "Sangat Baik! 🌟"][hoverRating || rating]}
                </p>
              )}

              <textarea
                value={ulasan}
                onChange={(e) => setUlasan(e.target.value)}
                placeholder="Tulis pengalaman kamu... (opsional)"
                className="w-full min-h-[120px] rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5 text-sm outline-none focus:border-emerald-300 resize-none"
              />

              {submitError && (
                <p className="text-sm text-red-500 mt-2">{submitError}</p>
              )}

              <button
                onClick={handleSubmitUlasan}
                disabled={submitting || rating === 0}
                className="mt-5 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-3xl font-semibold shadow-lg shadow-emerald-200 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
                ) : (
                  "Kirim Ulasan"
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
