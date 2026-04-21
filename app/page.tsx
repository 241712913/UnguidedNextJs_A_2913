'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-emerald-50 font-[&_*]:font-poppins">

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <header className="flex items-center justify-between py-6">

          {/* LOGO */}
          <div className="flex items-center mt-0 gap-3">
              <Image
                src="/logo.png"
                alt="logo"
                width={80}
                height={28}
                className="object-cover"
              />
            <p className="text-lg font-bold text-slate-900 mt-0">
              SahabatKargo<span className="text-emerald-600">.id</span>
            </p>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 ml-auto mr-6">
            <a href="#">Layanan</a>
            <a href="#">Tentang</a>
            <a href="#">Kontak</a>
          </div>

          <button className="hidden md:block rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700">
            Login
          </button>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-2xl text-slate-700"
          >
            ☰
          </button>

        </header>

        {open && (
          <div className="fixed inset-0 z-[9999] md:hidden flex">

            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpen(false)}
            />

            <div className="w-64 bg-white h-full shadow-xl p-6 space-y-6">

              <button
                onClick={() => setOpen(false)}
                className="text-right w-full text-slate-500 text-lg"
              >
                ✕
              </button>

              <nav className="flex flex-col gap-5 text-slate-700 font-medium">
                <a href="#" onClick={() => setOpen(false)}>Layanan</a>
                <a href="#" onClick={() => setOpen(false)}>Tentang</a>
                <a href="#" onClick={() => setOpen(false)}>Kontak</a>
                <a href="#" onClick={() => setOpen(false)}>Login</a>
              </nav>

            </div>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-1">

          <div className="space-y-8 text-center lg:text-left">

            <div className="inline-flex mx-auto lg:mx-0 items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              ⚡ Solusi Logistik UMKM Modern
            </div>

            <div className="space-y-4">

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

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0 w-full">

              <input
                type="text"
                placeholder="Masukkan nomor resi..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700">
                Lacak
              </button>

            </div>

            <button className="w-full sm:w-auto rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700">
              Mulai Sekarang →
            </button>

            <div className="grid grid-cols-3 gap-6 pt-1 -mt-3 text-left">

              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">10K+</p>
                <p className="text-xs sm:text-sm text-slate-500">Paket</p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">500+</p>
                <p className="text-xs sm:text-sm text-slate-500">UMKM</p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">99%</p>
                <p className="text-xs sm:text-sm text-slate-500">Aman</p>
              </div>

            </div>

          </div>

          <div className="flex justify-center lg:justify-end px-4 lg:px-10">

            <div className="relative w-full max-w-[420px] mx-auto lg:mx-0 rounded-3xl bg-white p-6 shadow-xl space-y-6">

              <div className="absolute -top-6 left-6 bg-white px-4 py-2 rounded-xl shadow-md text-xs text-slate-700">
                📦 Paket SBK-042 sedang dikirim
              </div>

              <div className="absolute top-20 -right-6 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md text-xs">
                ✔ Terkirim
              </div>

              <div>
                <p className="text-sm text-slate-500">Pengiriman Hari Ini</p>
                <h2 className="text-lg font-bold text-slate-900">
                  Pantau Pengiriman
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">

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

              <div className="relative h-32 w-full">
                <Image
                  src="/truck.png"
                  alt="truck"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">

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