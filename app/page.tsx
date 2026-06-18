"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [resi, setResi] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    const keyword = resi.trim();
    if (!keyword) {
      alert("Masukkan nomor resi");
      return;
    }
    router.push(`/tracking?resi=${encodeURIComponent(keyword)}`);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-emerald-50">

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="flex items-center justify-between py-5">

          {/* LOGO */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => router.push('/')}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={72}
              height={26}
              className="object-cover"
            />
            <p className="text-base font-bold text-slate-900">
              SahabatKargo<span className="text-emerald-600">.id</span>
            </p>
          </div>

          {/* NAV desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600 ml-auto mr-6">
            <a href="/"        className="hover:text-emerald-600 transition-colors">Beranda</a>
            <a href="/layanan" className="hover:text-emerald-600 transition-colors">Layanan</a>
            <a href="/tentang" className="hover:text-emerald-600 transition-colors">Tentang</a>
            <a href="/kontak"  className="hover:text-emerald-600 transition-colors">Kontak</a>
          </nav>

          <button
            onClick={() => router.push("/login")}
            className="hidden md:block rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
          >
            Login
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-slate-700 text-xl leading-none"
            aria-label="Buka menu"
          >
            ☰
          </button>
        </header>

        {/* MOBILE MENU */}
        {open && (
          <div className="fixed inset-0 z-[9999] md:hidden flex">
            <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
            <div className="w-64 bg-white h-full shadow-xl p-6 flex flex-col gap-6">
              <button
                onClick={() => setOpen(false)}
                className="self-end text-slate-500 text-lg leading-none"
                aria-label="Tutup menu"
              >
                ✕
              </button>
              <nav className="flex flex-col gap-5 text-slate-700 font-medium text-sm">
                <a href="/"        onClick={() => setOpen(false)}>Beranda</a>
                <a href="/layanan" onClick={() => setOpen(false)}>Layanan</a>
                <a href="/tentang" onClick={() => setOpen(false)}>Tentang</a>
                <a href="/kontak"  onClick={() => setOpen(false)}>Kontak</a>
                <a href="/login"   onClick={() => setOpen(false)} className="text-emerald-600 font-semibold">Login</a>
              </nav>
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-4 md:py-8">

          {/* LEFT */}
          <div className="space-y-6 text-center lg:text-left">

            <div className="inline-flex mx-auto lg:mx-0 items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-700">
              ⚡ Solusi Logistik UMKM Modern
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                Kirim Tanpa Ribet,
                <br />
                <span className="text-emerald-600">Pantau Semua</span>
                <br />
                Dalam Satu Platform.
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-lg text-slate-600 leading-relaxed">
                Satu platform untuk kelola dan pantau semua pengiriman barang kamu secara real-time.
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex gap-2 max-w-xl mx-auto lg:mx-0 w-full">
              <div className="flex-1 flex items-center rounded-2xl bg-white px-4 py-3 shadow-md min-w-0">
                <input
                  type="text"
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Masukkan nomor resi..."
                  className="w-full min-w-0 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition shrink-0"
              >
                Lacak
              </button>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition"
            >
              Mulai Sekarang →
            </button>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 pt-1 text-left">
              {[
                { value: "10K+", label: "Paket" },
                { value: "500+", label: "UMKM" },
                { value: "99%",  label: "Aman" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT — card */}
          <div className="flex justify-center lg:justify-end px-2 lg:px-10">
            <div className="relative w-full max-w-[380px] mx-auto lg:mx-0 rounded-3xl bg-white p-5 shadow-xl space-y-5">

              {/* floating badges — clipped agar tidak overflow di mobile */}
              <div className="absolute -top-5 left-5 bg-white px-3 py-1.5 rounded-xl shadow-md text-xs text-slate-700 whitespace-nowrap">
                📦 Paket SBK-042 sedang dikirim
              </div>
              <div className="absolute top-16 -right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-md text-xs whitespace-nowrap">
                ✔ Terkirim
              </div>

              <div className="mt-2">
                <p className="text-sm text-slate-500">Pengiriman Hari Ini</p>
                <h2 className="text-base font-bold text-slate-900">Pantau Pengiriman</h2>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-amber-500">12</p>
                  <p className="text-xs text-slate-500">Diproses</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-sky-500">38</p>
                  <p className="text-xs text-slate-500">Dikirim</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">89</p>
                  <p className="text-xs text-slate-500">Selesai</p>
                </div>
              </div>

              <div className="relative h-28 w-full">
                <Image src="/truck.png" alt="truck" fill className="object-contain" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Perjalanan Paket</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full">
                  <div className="h-2 bg-emerald-500 rounded-full w-[75%]" />
                </div>
              </div>

              <div className="rounded-xl bg-emerald-600 p-3 text-white text-sm">
                <p className="text-xs opacity-80">10K+ Paket</p>
                <p className="font-bold">Berhasil terkirim</p>
              </div>

            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
