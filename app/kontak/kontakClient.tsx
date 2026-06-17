'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function KontakPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nama: '', email: '', topik: '', pesan: '' });
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.pesan) {
      alert('Harap isi semua field yang wajib diisi.');
      return;
    }
    setSent(true);
  };

  const contacts = [
    { icon: '📧', label: 'Email', value: '241712913@students.uajy.ac.id', href: 'mailto:241712913@students.uajy.ac.id' },
    { icon: '💬', label: 'WhatsApp', value: '+62 812-3456-7890', href: 'https://wa.me/6281234567890' },
    { icon: '📍', label: 'Kantor', value: 'Jl. Babarsari No. 37A, Yogyakarta', href: '#' },
    { icon: '🕐', label: 'Jam Operasional', value: 'Senin–Jumat, 08.00–17.00 WIB', href: null },
  ];

  const faqs = [
    { q: 'Apakah SahabatKargo menggunakan kurir pihak ketiga?', a: 'Tidak. SahabatKargo adalah perusahaan pengiriman barang mandiri dengan armada dan kurir kami sendiri. Kami tidak bergantung pada kurir eksternal seperti JNE atau J&T.' },
    { q: 'Bagaimana cara membuat pesanan pengiriman?', a: 'Kamu bisa datang langsung ke kantor kami di Jl. Babarsari No. 37A, Yogyakarta dengan membawa barang yang ingin dikirim. Staf kami akan membantu proses input data dan memberikan nomor resi untuk pelacakan.' },
    { q: 'Berapa lama estimasi pengiriman?', a: 'Estimasi tergantung jarak dan zona wilayah. Tim kami akan memberikan info waktu tiba saat kamu membuat pesanan.' },
    { q: 'Apakah bisa melacak paket secara real-time?', a: 'Ya! Setiap paket bisa dilacak menggunakan nomor resi di halaman utama kami, tanpa perlu login.' },
    { q: 'Bagaimana jika paket rusak atau hilang?', a: 'Kami bertanggung jawab penuh atas setiap paket. Ajukan klaim via email atau WhatsApp kami dan tim kami akan segera menindaklanjuti.' },
  ];

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
            <a href="/tentang" className="hover:text-emerald-600 transition-colors">Tentang</a>
            <a href="/kontak" className="text-emerald-600 font-semibold">Kontak</a>
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
                <a href="/tentang" onClick={() => setOpen(false)}>Tentang</a>
                <a href="/kontak" onClick={() => setOpen(false)} className="text-emerald-600">Kontak</a>
                <a href="/login" onClick={() => setOpen(false)}>Login</a>
              </nav>
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="py-16 text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Hubungi Kami
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Ada Pertanyaan? <br />
            <span className="text-emerald-600">Kami Siap Bantu!</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Tim SahabatKargo selalu siap menjawab pertanyaan, menangani kendala, dan mendampingi kamu kapanpun dibutuhkan.
          </p>
        </section>

        {/* CONTACT INFO CARDS */}
        <section className="pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((c) => (
            <div key={c.label} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="text-2xl">{c.icon}</div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
              {c.href && c.href !== '#' ? (
                <a href={c.href} className="text-sm font-semibold text-emerald-600 hover:underline break-all">{c.value}</a>
              ) : (
                <p className="text-sm font-semibold text-slate-700">{c.value}</p>
              )}
            </div>
          ))}
        </section>

        {/* FORM + FAQ */}
        <section className="pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* FORM */}
          <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Kirim Pesan</h2>
              <p className="text-sm text-slate-500 mt-1">Isi form di bawah, kami akan merespons dalam 1x24 jam kerja.</p>
            </div>

            {sent ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">✅</div>
                <h3 className="text-xl font-bold text-slate-900">Pesan Terkirim!</h3>
                <p className="text-slate-600 text-sm">Terima kasih, <strong>{form.nama}</strong>! Kami akan segera menghubungi kamu di <strong>{form.email}</strong>.</p>
                <button
                  onClick={() => { setSent(false); setForm({ nama: '', email: '', topik: '', pesan: '' }); }}
                  className="rounded-xl bg-emerald-600 text-white px-6 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Nama Lengkap *</label>
                    <input
                      type="text"
                      placeholder="Nama kamu"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Email *</label>
                    <input
                      type="email"
                      placeholder="email@kamu.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Topik</label>
                  <select
                    value={form.topik}
                    onChange={(e) => setForm({ ...form, topik: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Pilih topik...</option>
                    <option value="pertanyaan_umum">Pertanyaan Umum</option>
                    <option value="teknis">Kendala Teknis</option>
                    <option value="harga">Harga & Paket</option>
                    <option value="kerjasama">Kerjasama / Partnership</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Pesan *</label>
                  <textarea
                    rows={5}
                    placeholder="Tuliskan pertanyaan atau pesan kamu di sini..."
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 text-white font-semibold py-3 text-sm hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Kirim Pesan →
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Pertanyaan Umum</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="rounded-2xl bg-emerald-600 text-white p-5 space-y-3 mt-4">
              <div className="text-2xl">💬</div>
              <h4 className="font-bold">Butuh Bantuan Cepat?</h4>
              <p className="text-sm text-emerald-100">Chat langsung dengan tim support kami via WhatsApp.</p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-white text-emerald-600 text-sm font-semibold px-5 py-2 hover:bg-emerald-50 transition-colors"
              >
                Chat WhatsApp →
              </a>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <span>{q}</span>
        <span className={`text-emerald-600 transition-transform duration-200 ${expanded ? 'rotate-45' : ''}`}>+</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}
