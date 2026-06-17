import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan | SahabatKargo.id",
  description: "Halaman yang Anda cari tidak tersedia.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center p-6 text-center">

      {/* Ilustrasi angka 404 */}
      <div className="select-none text-[9rem] font-extrabold leading-none text-emerald-100">
        404
      </div>

      <div className="-mt-6 space-y-3 max-w-md">
        <h1 className="text-2xl font-bold text-slate-800">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          Periksa kembali URL yang Anda masukkan, atau kembali ke halaman utama.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
        >
          ← Kembali ke Beranda
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
        >
          Masuk / Login
        </Link>
      </div>

      <p className="mt-12 text-xs text-slate-400">© 2026 SahabatKargo.id</p>
    </main>
  );
}
