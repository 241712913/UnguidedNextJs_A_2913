'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const services = [
  {
    icon: '📦',
    title: 'Manajemen Pengiriman',
    desc: 'Kelola semua pesanan pengiriman dari satu dashboard terpusat. Buat, edit, dan monitor status pengiriman dengan mudah dan cepat.',
    highlights: ['Multi-kurir terintegrasi', 'Input massal (bulk)', 'Label otomatis'],
    color: 'emerald',
  },
  {
    icon: '🔍',
    title: 'Pelacakan Real-Time',
    desc: 'Pantau posisi paket secara langsung. Pelanggan kamu juga bisa lacak sendiri hanya dengan nomor resi — tanpa perlu login.',
    highlights: ['Update otomatis', 'Notifikasi status', 'Lacak untuk pelanggan'],
    color: 'sky',
  },
  {
    icon: '📊',
    title: 'Laporan & Analitik',
    desc: 'Dapatkan insight mendalam tentang performa pengirimanmu. Dari volume harian, biaya ongkir, hingga tingkat keberhasilan.',
    highlights: ['Grafik interaktif', 'Export PDF / Excel', 'Rekap bulanan'],
    color: 'amber',
  },
  {
    icon: '🤝',
    title: 'Integrasi Marketplace',
    desc: 'Sambungkan toko online kamu di Tokopedia, Shopee, Lazada, atau platform lain langsung ke SahabatKargo tanpa repot.',
    highlights: ['Sync otomatis', 'Multi-toko', 'Webhook tersedia'],
    color: 'violet',
  },
  {
    icon: '💬',
    title: 'Notifikasi WhatsApp',
    desc: 'Kirim update status pengiriman otomatis ke pelanggan via WhatsApp. Tingkatkan kepercayaan dan kurangi komplain.',
    highlights: ['Template pesan kustom', 'Blast ke banyak nomor', 'Log pengiriman pesan'],
    color: 'green',
  },
  {
    icon: '🏪',
    title: 'Khusus UMKM',
    desc: 'Dirancang untuk kebutuhan bisnis kecil dan menengah Indonesia. Harga terjangkau, fitur lengkap, dukungan 24/7.',
    highlights: ['Harga mulai gratis', 'Onboarding mudah', 'Support responsif'],
    color: 'rose',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  sky: 'bg-sky-50 border-sky-200 text-sky-600',
  amber: 'bg-amber-50 border-amber-200 text-amber-600',
  violet: 'bg-violet-50 border-violet-200 text-violet-600',
  green: 'bg-green-50 border-green-200 text-green-600',
  rose: 'bg-rose-50 border-rose-200 text-rose-600',
};

const badgeMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  violet: 'bg-violet-100 text-violet-700',
  green: 'bg-green-100 text-green-700',
  rose: 'bg-rose-100 text-rose-700',
};

export default function LayananPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-emerald-50">

      {/* NAVBAR */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <Image src="/logo.png" alt="logo" width={80} height={28} className="object-cover" />
            <p className="text-lg font-bold text-slate-900">SahabatKargo<span className="text-emerald-600">.id</span></p>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 ml-auto mr-6">
            <a href="/" className="hover:text-emerald-600 transition-colors">Beranda</a>
            <a href="/layanan" className="text-emerald-600 font-semibold">Layanan</a>
            <a href="/tentang" className="hover:text-emerald-600 transition-colors">Tentang</a>
            <a href="/kontak" className="hover:text-emerald-600 transition-colors">Kontak</a>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="hidden md:block rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            Login
          </button>

          <button onClick={() => setOpen(true)} className="md:hidden text-2xl text-slate-700">☰</button>
        </header>

        {open && (
          <div className="fixed inset-0 z-[9999] md:hidden flex">
            <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
            <div className="w-64 bg-white h-full shadow-xl p-6 space-y-6">
              <button onClick={() => setOpen(false)} className="text-right w-full text-slate-500 text-lg">✕</button>
              <nav className="flex flex-col gap-5 text-slate-700 font-medium">
                <a href="/" onClick={() => setOpen(false)}>Beranda</a>
                <a href="/layanan" onClick={() => setOpen(false)} className="text-emerald-600">Layanan</a>
                <a href="/tentang" onClick={() => setOpen(false)}>Tentang</a>
                <a href="/kontak" onClick={() => setOpen(false)}>Kontak</a>
                <a href="/login" onClick={() => setOpen(false)}>Login</a>
              </nav>
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Layanan Kami
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Semua yang Kamu Butuhkan<br />
            <span className="text-emerald-600">Ada di Sini</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
            SahabatKargo hadir dengan fitur lengkap untuk membantu UMKM Indonesia mengelola logistik
            dengan lebih efisien, hemat waktu, dan profesional.
          </p>
        </section>

        {/* SERVICES GRID */}
        <section className="pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className={`rounded-2xl border p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow ${colorMap[s.color]}`}
            >
              <div className="text-4xl">{s.icon}</div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {s.highlights.map((h) => (
                  <span
                    key={h}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeMap[s.color]}`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="pb-20 text-center space-y-4">
          <div className="rounded-3xl bg-emerald-600 p-12 text-white space-y-5 max-w-3xl mx-auto shadow-xl">
            <h2 className="text-3xl font-extrabold">Siap Mulai Sekarang?</h2>
            <p className="text-emerald-100 text-base">
              Daftar gratis dan nikmati semua fitur selama 14 hari tanpa kartu kredit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="rounded-xl bg-white text-emerald-600 font-semibold px-7 py-3 shadow hover:bg-emerald-50 transition-colors"
              >
                Mulai Gratis →
              </button>
              <button
                onClick={() => router.push('/kontak')}
                className="rounded-xl border border-white/50 text-white font-semibold px-7 py-3 hover:bg-white/10 transition-colors"
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
