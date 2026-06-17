"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, Package, Truck, Home, CheckCheck } from "lucide-react";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

const STATUS_MAP: Record<number, string> = {
  1: "Menunggu",
  2: "Dijemput",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
  6: "Gagal",
};

const STATUS_STYLE: Record<number, { badge: string; dot: string }> = {
  1: { badge: "bg-slate-100 text-slate-600",     dot: "bg-slate-400"   },
  2: { badge: "bg-violet-100 text-violet-700",   dot: "bg-violet-500"  },
  3: { badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-500"   },
  4: { badge: "bg-sky-100 text-sky-700",         dot: "bg-sky-500"     },
  5: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  6: { badge: "bg-rose-100 text-rose-700",       dot: "bg-rose-500"    },
};

// ── TIMELINE ─────────────────────────────────────────────────────────────────
import { CheckCircle2 } from "lucide-react";

const TIMELINE_STEPS = [
  { status_id: 1, label: "Menunggu",          desc: "Pesanan diterima, menunggu dijemput",    icon: Clock      },
  { status_id: 2, label: "Dijemput",          desc: "Paket sedang dijemput oleh kurir",       icon: Package    },
  { status_id: 3, label: "Dalam Perjalanan",  desc: "Paket sedang dikirim ke tujuan",         icon: Truck      },
  { status_id: 4, label: "Diantar",           desc: "Kurir sedang mengantar ke alamat tujuan",icon: Home       },
  { status_id: 5, label: "Terkirim",          desc: "Paket berhasil diterima",                icon: CheckCheck },
];

function TrackingTimeline({ statusId }: { statusId: number }) {
  // Jika status 6 (Gagal), timeline berhenti di step terakhir yang valid
  const effectiveId = statusId === 6 ? 0 : statusId;

  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Truck size={18} className="text-emerald-600" />
        Status Pengiriman
      </h2>

      <div className="relative">
        {/* Garis abu */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

        {/* Garis progress hijau */}
        <div
          className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-400 transition-all duration-700"
          style={{
            height: `${Math.min(((effectiveId - 1) / (TIMELINE_STEPS.length - 1)) * 100, 100)}%`,
          }}
        />

        <div className="space-y-2">
          {TIMELINE_STEPS.map((step, i) => {
            const done    = effectiveId > step.status_id;
            const active  = effectiveId === step.status_id;
            const pending = effectiveId < step.status_id;
            const Icon    = step.icon;

            return (
              <div key={step.status_id} className="relative flex items-start gap-4 pl-2">
                <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${done    ? "bg-emerald-500 shadow-lg shadow-emerald-200"           : ""}
                  ${active  ? "bg-emerald-600 shadow-xl shadow-emerald-300 scale-110" : ""}
                  ${pending ? "bg-gray-100"                                            : ""}
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

      {/* Banner status khusus */}
      {statusId === 5 && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Paket telah berhasil diterima! 🎉</p>
        </div>
      )}
      {statusId === 6 && (
        <div className="mt-4 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-rose-500 flex-shrink-0" />
          <p className="text-sm text-rose-700 font-medium">Pengiriman ini gagal atau dibatalkan.</p>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ShipmentDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<any>(null);

  useEffect(() => {
    if (!params.id) return;
    async function fetchShipment() {
      try {
        const res = await fetch(`/api/pengiriman/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        setShipment(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchShipment();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="p-3 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
          <div className="bg-white rounded-3xl p-6 shadow animate-pulse">
            <div className="h-4 w-full bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="p-6">
          <button
            onClick={() => router.push("/admin/shipment")}
            className="inline-flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          <div className="mt-8 bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-600">Data pengiriman tidak ditemukan.</p>
          </div>
        </div>
      </div>
    );
  }

  const statusText    = STATUS_MAP[Number(shipment.status_id)] ?? shipment.status ?? "Draft";
  const statusStyle   = STATUS_STYLE[Number(shipment.status_id)] ?? STATUS_STYLE[1];
  const pengirimanDate = shipment.created_at
    ? new Date(shipment.created_at).toLocaleDateString("id-ID")
    : "-";
  const pengirimPhone = shipment.no_hp_pengirim || shipment.hp_pengirim || "-";
  const penerimaPhone = shipment.no_hp_penerima || shipment.hp_penerima || "-";
  const layananText   = shipment.layanan || shipment.metode || "Reguler";
  const totalOngkir   = Number(shipment.total_ongkir ?? shipment.ongkir ?? 0);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-4">
        {/* HERO */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Detail Pengiriman</p>
          <h1 className="text-3xl font-bold mt-3">{shipment.resi || "Pengiriman"}</h1>
          <p className="mt-3 max-w-2xl text-sm opacity-90">
            Semua informasi pengiriman diambil langsung dari database. Pastikan data sudah terisi lengkap untuk setiap pengiriman.
          </p>
        </div>

        {/* BACK + STATUS */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => router.push("/admin/shipment")}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <ArrowLeft size={18} /> Kembali ke daftar
          </button>

          <div className="bg-white rounded-3xl p-6 shadow w-full md:w-auto">
            <p className="text-sm text-gray-500 mb-2">Status Pengiriman</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${statusStyle.badge}`}>
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              {statusText}
            </span>
          </div>
        </div>

        {/* TIMELINE ← BARU */}
        <TrackingTimeline statusId={Number(shipment.status_id) || 1} />

        {/* RESI + LAYANAN */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="bg-white rounded-3xl p-6 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Nomor Resi</p>
                <h2 className="text-2xl font-bold text-slate-900">{shipment.resi || "-"}</h2>
              </div>
              <div className="text-sm text-gray-500">Tanggal: {pengirimanDate}</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-xs uppercase text-emerald-600">Layanan</p>
                <p className="mt-2 text-lg font-semibold text-emerald-700">{layananText}</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-xs uppercase text-emerald-600">Ongkir</p>
                <p className="mt-2 text-lg font-semibold text-emerald-700">
                  Rp{totalOngkir.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-sm text-gray-500">Alamat Pengirim</p>
            <p className="mt-2 text-gray-900 font-semibold">{shipment.alamat_pengirim || "-"}</p>
            <p className="text-sm text-gray-500 mt-1">{pengirimPhone}</p>
            <p className="text-sm text-gray-500">{shipment.kota_pengirim || "-"}</p>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="text-sm text-gray-500">Alamat Penerima</p>
              <p className="mt-2 text-gray-900 font-semibold">{shipment.alamat_penerima || "-"}</p>
              <p className="text-sm text-gray-500 mt-1">{penerimaPhone}</p>
              <p className="text-sm text-gray-500">{shipment.kota_penerima || "-"}</p>
            </div>
          </div>
        </div>

        {/* NAMA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-sm text-gray-500">Nama Pengirim</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.nama_pengirim || "-"}</p>
            <p className="text-sm text-gray-500 mt-4">Nama Penerima</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.nama_penerima || "-"}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-sm text-gray-500">Berat Paket</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.berat ?? "-"} kg</p>
            <p className="text-sm text-gray-500 mt-4">Kode Pos</p>
            <p className="mt-2 text-gray-700">Asal: {shipment.kode_pos_pengirim || "-"}</p>
            <p className="mt-1 text-gray-700">Tujuan: {shipment.kode_pos_penerima || "-"}</p>
          </div>
        </div>

        {/* DESKRIPSI */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <p className="text-sm text-gray-500">Deskripsi Barang</p>
          <p className="mt-3 text-gray-900 leading-relaxed">
            {shipment.deskripsi_barang || "Tidak ada deskripsi tambahan"}
          </p>
        </div>
      </div>
    </div>
  );
}