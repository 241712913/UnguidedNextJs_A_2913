"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import { Clock, Truck, Package, CheckCircle, FileText, Trash2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type StatusType =
  | "Menunggu"
  | "Transit"
  | "Diantar"
  | "Selesai"
  | "Terkirim"
  | "Dalam perjalanan";

interface Shipment {
  id: number;
  resi: string;
  nama_pengirim: string;
  nama_penerima: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  status: StatusType;
  created_at: string;
}

interface Draft {
  id: number;
  nama_penerima: string;
  alamat_penerima: string;
  kota_tujuan: string;
  berat: number;
  ongkir: number;
  created_at: string;
}

const STATUS: Record<string, { color: string; icon: JSX.Element }> = {
  Menunggu:           { color: "bg-yellow-100 text-yellow-800",  icon: <Clock size={13} /> },
  Transit:            { color: "bg-blue-100 text-blue-800",      icon: <Truck size={13} /> },
  "Dalam perjalanan": { color: "bg-blue-100 text-blue-800",      icon: <Truck size={13} /> },
  Diantar:            { color: "bg-purple-100 text-purple-800",  icon: <Package size={13} /> },
  Selesai:            { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle size={13} /> },
  Terkirim:           { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle size={13} /> },
};

const STATUS_MAP: Record<number, StatusType> = {
  1: "Menunggu",
  2: "Transit",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        setUserName(user.nama ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => res.json())
      .then((result) => {
        setShipments(
          (result.shipments || []).map((item: any) => ({
            ...item,
            status: STATUS_MAP[item.status_id] || "Menunggu",
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/draft")
      .then((res) => res.json())
      .then((result) => setDrafts(result.drafts || []))
      .finally(() => setLoadingDraft(false));
  }, []);

  const handleDeleteDraft = async (id: number) => {
    if (!confirm("Hapus draft ini?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/draft?id=${id}`, { method: "DELETE" });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const menunggu = shipments.filter((s) => s.status === "Menunggu").length;
  const transit  = shipments.filter((s) => s.status === "Transit" || s.status === "Dalam perjalanan").length;
  const diantar  = shipments.filter((s) => s.status === "Diantar").length;
  const selesai  = shipments.filter((s) => s.status === "Selesai" || s.status === "Terkirim").length;

  const pengirimanAktif =
    shipments.find((s) => s.status === "Transit" || s.status === "Dalam perjalanan") ||
    shipments[0];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="px-3 py-4 space-y-3 md:px-6 md:space-y-4">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-3xl p-5 md:p-6 shadow-lg">
          <div className="relative z-10">
            <p className="text-sm opacity-90">Selamat datang 👋</p>
            <h1 className="text-xl font-bold mt-0.5 truncate">{userName || "Dashboard Pengiriman"}</h1>
            <p className="text-sm opacity-80 mt-0.5">
              {shipments.length} pengiriman · {drafts.length} draft menunggu
            </p>
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {[
            { label: "Menunggu", value: menunggu, icon: <Clock size={16} />,       color: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
            { label: "Transit",  value: transit,  icon: <Truck size={16} />,       color: "bg-blue-50 text-blue-700 border border-blue-100" },
            { label: "Diantar",  value: diantar,  icon: <Package size={16} />,     color: "bg-purple-50 text-purple-700 border border-purple-100" },
            { label: "Selesai",  value: selesai,  icon: <CheckCircle size={16} />, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
          ].map((item) => (
            <div key={item.label} className={`p-3.5 md:p-4 rounded-2xl ${item.color} shadow-sm`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium opacity-80">{item.label}</p>
                  <p className="text-2xl font-bold mt-0.5">{item.value}</p>
                </div>
                <div className="bg-white/70 p-2 rounded-xl shrink-0">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* DRAFT SECTION */}
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                <FileText size={15} className="text-amber-600" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-slate-800 text-sm">Draft Pengiriman</h2>
                <p className="text-xs text-slate-400 hidden sm:block">Edit & hapus sebelum diproses admin</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/pelanggan/create")}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl transition shrink-0"
            >
              <Plus size={13} />
              Buat Draft
            </button>
          </div>

          {loadingDraft ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-amber-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-7">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm font-semibold text-slate-600">Belum ada draft</p>
              <p className="text-xs text-slate-400 mt-1">Buat pengiriman baru atau gunakan repeat order</p>
            </div>
          ) : (
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-amber-50 border border-amber-100 rounded-2xl px-3.5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        → {draft.nama_penerima}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {draft.kota_tujuan}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          {draft.berat} kg
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          ~Rp {Number(draft.ongkir).toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(draft.created_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => router.push(`/pelanggan/create?edit=${draft.id}`)}
                        className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-50 active:scale-95 transition"
                        title="Edit draft"
                      >
                        <Pencil size={13} className="text-emerald-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        disabled={deletingId === draft.id}
                        className="w-8 h-8 rounded-xl bg-white border border-red-200 flex items-center justify-center hover:bg-red-50 active:scale-95 transition disabled:opacity-50"
                        title="Hapus draft"
                      >
                        {deletingId === draft.id ? (
                          <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={13} className="text-red-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE SHIPMENT */}
        {pengirimanAktif && (
          <div className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-1.5 gap-2">
              <p className="text-sm text-emerald-600 font-medium shrink-0">🚚 Pengiriman aktif</p>
              <span className="text-xs text-gray-400 shrink-0">Estimasi 1–2 hari</span>
            </div>
            <h2 className="font-bold text-base text-gray-800 truncate">{pengirimanAktif.resi}</h2>
            <p className="text-sm text-gray-500 mt-1 break-words leading-relaxed">
              {pengirimanAktif.alamat_pengirim} → {pengirimanAktif.alamat_penerima}
            </p>
            <div className="mt-3.5 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 w-2/3 rounded-full" />
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-2.5">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl animate-pulse">
                <div className="flex justify-between gap-3 mb-3">
                  <div className="h-4 w-36 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="h-3 w-52 bg-gray-100 rounded" />
              </div>
            ))
          ) : shipments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-semibold text-slate-700">Belum ada pengiriman</p>
              <p className="text-sm text-slate-400 mt-1">Buat pengiriman pertamamu sekarang</p>
              <button
                onClick={() => router.push("/pelanggan/create")}
                className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition"
              >
                Buat Sekarang
              </button>
            </div>
          ) : (
            shipments.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/pelanggan/history/${item.id}`)}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{item.resi}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${STATUS[item.status]?.color}`}>
                    {STATUS[item.status]?.icon}
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500 break-words leading-relaxed">
                  {item.alamat_pengirim} → {item.alamat_penerima}
                </div>
              </div>
            ))
          )}
        </div>

        {/* HELP */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 md:p-5 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-emerald-700 text-sm">Butuh Bantuan?</h3>
            <p className="text-sm text-emerald-600 mt-0.5">Tim kami siap membantu pengiriman kamu</p>
          </div>
          <button
            onClick={() => router.push("/pelanggan/hubungi")}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition w-full md:w-auto"
          >
            Hubungi Kami
          </button>
        </div>

      </div>
    </div>
  );
}
