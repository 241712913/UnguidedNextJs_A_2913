'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const team = [
  { name: 'Yemima Riafe Saragih', role: 'Developer', email: '241712913@students.uajy.ac.id', emoji: '👩‍💻' },
  { name: 'Tiffany Manihuruk', role: 'Developer', email: '241712987@students.uajy.ac.id', emoji: '👩‍🎨' },
  { name: 'Humaidaah Az Zahra J.', role: 'Developer', email: '231712653@students.uajy.ac.id', emoji: '👩‍🔧' },
];

const milestones = [
  { year: '2021', event: 'SahabatKargo berdiri di Yogyakarta dengan visi membantu UMKM lokal.' },
  { year: '2022', event: 'Mencapai 100+ UMKM aktif dan meluncurkan fitur pelacakan real-time.' },
  { year: '2023', event: 'Integrasi dengan marketplace besar: Tokopedia, Shopee, dan Lazada.' },
  { year: '2024', event: 'Melewati 500+ UMKM mitra dan 10.000+ paket berhasil terkirim.' },
  { year: '2025', event: 'Ekspansi ke seluruh Indonesia dengan jaringan kurir lebih dari 20 mitra.' },
];

const values = [
  { icon: '🌱', title: 'Pro-UMKM', desc: 'Kami ada untuk pelaku usaha kecil. Setiap fitur kami dirancang dengan kebutuhan UMKM Indonesia sebagai prioritas.' },
  { icon: '🔒', title: 'Terpercaya', desc: 'Data dan transaksi kamu aman bersama kami. Keamanan dan transparansi adalah fondasi layanan kami.' },
  { icon: '⚡', title: 'Efisien', desc: 'Kami percaya waktu adalah aset berharga. Platform kami memangkas proses manual menjadi otomatis.' },
  { icon: '💛', title: 'Humanis', desc: 'Di balik teknologi, ada manusia. Tim kami siap mendampingi setiap langkah perjalanan bisnis kamu.' },
];

export default function TentangPage() {
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
            <a href="/layanan" className="hover:text-emerald-600 transition-colors">Layanan</a>
            <a href="/tentang" className="text-emerald-600 font-semibold">Tentang</a>
            <a href="/kontak" className="hover:text-emerald-600 transition-colors">Kontak</a>
          </div>

          <button onClick={() => router.push('/login')} className="hidden md:block rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors">Login</button>
          <button onClick={() => setOpen(true)} className="md:hidden text-2xl text-slate-700">☰</button>
        </header>

        {open && (
          <div className="fixed inset-0 z-[9999] md:hidden flex">
            <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
            <div className="w-64 bg-white h-full shadow-xl p-6 space-y-6">
              <button onClick={() => setOpen(false)} className="text-right w-full text-slate-500 text-lg">✕</button>
              <nav className="flex flex-col gap-5 text-slate-700 font-medium">
                <a href="/" onClick={() => setOpen(false)}>Beranda</a>
                <a href="/layanan" onClick={() => setOpen(false)}>Layanan</a>
                <a href="/tentang" onClick={() => setOpen(false)} className="text-emerald-600">Tentang</a>
                <a href="/kontak" onClick={() => setOpen(false)}>Kontak</a>
                <a href="/login" onClick={() => setOpen(false)}>Login</a>
              </nav>
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="py-16 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Tentang Kami
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Kami Hadir untuk <br />
            <span className="text-emerald-600">UMKM Indonesia</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            SahabatKargo lahir dari keresahan nyata: betapa sulitnya pelaku UMKM mengelola pengiriman
            yang makin kompleks. Kami hadir sebagai sahabat logistik yang menemani pertumbuhan bisnis kamu.
          </p>
        </section>

        {/* STATS */}
        <section className="pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '2021', label: 'Tahun Berdiri' },
              { value: '500+', label: 'UMKM Mitra' },
              { value: '10K+', label: 'Paket Terkirim' },
              { value: '99%', label: 'Tingkat Keberhasilan' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 text-center">
                <p className="text-3xl font-extrabold text-emerald-600">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VISI MISI */}
        <section className="pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-emerald-600 text-white p-8 space-y-3 shadow-lg">
            <div className="text-3xl">🎯</div>
            <h3 className="text-xl font-bold">Visi</h3>
            <p className="text-emerald-100 leading-relaxed">
              Menjadi platform logistik terpercaya nomor satu untuk UMKM di seluruh Indonesia,
              yang memberdayakan jutaan pelaku usaha dengan teknologi pengiriman yang mudah dan terjangkau.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 space-y-3">
            <div className="text-3xl">🚀</div>
            <h3 className="text-xl font-bold text-slate-900">Misi</h3>
            <ul className="text-slate-600 leading-relaxed space-y-2 text-sm">
              <li>✅ Menyederhanakan pengelolaan pengiriman untuk UMKM</li>
              <li>✅ Memberikan visibilitas penuh atas setiap paket</li>
              <li>✅ Membangun ekosistem logistik yang inklusif</li>
              <li>✅ Terus berinovasi demi kepuasan pengguna</li>
            </ul>
          </div>
        </section>

        {/* NILAI */}
        <section className="pb-16 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
                <div className="text-3xl">{v.icon}</div>
                <h4 className="font-bold text-slate-900">{v.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MILESTONE */}
        <section className="pb-16 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center">Perjalanan Kami</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-full bg-emerald-200 mt-1 min-h-[24px]" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-bold text-emerald-600">{m.year}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="pb-16 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center">Tim Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 text-center space-y-2 hover:shadow-md transition-shadow">
                <div className="text-5xl">{t.emoji}</div>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
                <a href={`mailto:${t.email}`} className="block text-xs text-emerald-600 hover:underline break-all">{t.email}</a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 text-center">
          <div className="rounded-3xl bg-emerald-600 p-12 text-white space-y-5 max-w-3xl mx-auto shadow-xl">
            <h2 className="text-3xl font-extrabold">Bergabunglah Bersama Kami</h2>
            <p className="text-emerald-100 text-base">Jadilah bagian dari komunitas UMKM yang terus berkembang bersama SahabatKargo.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => router.push('/login')} className="rounded-xl bg-white text-emerald-600 font-semibold px-7 py-3 shadow hover:bg-emerald-50 transition-colors">
                Daftar Sekarang →
              </button>
              <button onClick={() => router.push('/kontak')} className="rounded-xl border border-white/50 text-white font-semibold px-7 py-3 hover:bg-white/10 transition-colors">
                Hubungi Kami
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
