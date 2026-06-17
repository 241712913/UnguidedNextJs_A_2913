"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

// ─── WILAYAH ─────────────────────────────────────────────────────────────────
const WILAYAH: Record<string, Record<string, string>> = {
  "Kota Yogyakarta": {
    "Danurejan": "55212", "Gedongtengen": "55272", "Gondokusuman": "55221",
    "Gondomanan": "55122", "Jetis": "55231", "Kotagede": "55172",
    "Kraton": "55132", "Mantrijeron": "55141", "Mergangsan": "55151",
    "Ngampilan": "55261", "Pakualaman": "55166", "Tegalrejo": "55242",
    "Umbulharjo": "55161", "Wirobrajan": "55251",
  },
  "Kabupaten Sleman": {
    "Berbah": "55573", "Cangkringan": "55583", "Depok": "55281",
    "Gamping": "55294", "Godean": "55564", "Kalasan": "55571",
    "Minggir": "55562", "Mlati": "55284", "Moyudan": "55563",
    "Ngaglik": "55581", "Ngemplak": "55584", "Pakem": "55582",
    "Prambanan": "55572", "Seyegan": "55561", "Sleman": "55511",
    "Tempel": "55552", "Turi": "55551",
  },
  "Kabupaten Bantul": {
    "Bambanglipuro": "55764", "Banguntapan": "55191", "Bantul": "55711",
    "Dlingo": "55783", "Imogiri": "55782", "Jetis": "55781",
    "Kasihan": "55181", "Kretek": "55771", "Pajangan": "55751",
    "Pandak": "55761", "Piyungan": "55792", "Pleret": "55791",
    "Pundong": "55771", "Sanden": "55763", "Sedayu": "55752",
    "Sewon": "55185", "Srandakan": "55762",
  },
  "Kota Surakarta (Solo)": {
    "Banjarsari": "57132", "Jebres": "57126", "Laweyan": "57144",
    "Pasar Kliwon": "57116", "Serengan": "57155",
  },
  "Kabupaten Klaten": {
    "Bayat": "57462", "Cawas": "57463", "Ceper": "57465",
    "Delanggu": "57471", "Gantiwarno": "57454", "Juwiring": "57472",
    "Kalikotes": "57452", "Karanganom": "57475", "Karangdowo": "57464",
    "Klaten Selatan": "57423", "Klaten Tengah": "57411", "Klaten Utara": "57436",
    "Prambanan": "57454", "Trucuk": "57467", "Wedi": "57461",
  },
  "Kabupaten Magelang": {
    "Borobudur": "56553", "Mertoyudan": "56172", "Mungkid": "56511",
    "Muntilan": "56413", "Salaman": "56161", "Sawangan": "56481",
    "Salam": "56484", "Secang": "56195", "Srumbung": "56483",
    "Tempuran": "56161",
  },
};

const KANTOR = {
  alamat: "Jl. Babarsari No. 37A",
  kota: "Kabupaten Sleman",
  kecamatan: "Depok",
  kodePos: "55281",
};

const TIER_LABEL: Record<string, string> = {
  "Kota Yogyakarta":       "🟢 Tier 1 — Jogja Lokal",
  "Kabupaten Sleman":      "🟢 Tier 1 — Jogja Lokal",
  "Kabupaten Bantul":      "🟢 Tier 1 — Jogja Lokal",
  "Kota Surakarta (Solo)": "🟡 Tier 2 — Solo & Sekitar",
  "Kabupaten Klaten":      "🟡 Tier 2 — Solo & Sekitar",
  "Kabupaten Magelang":    "🟡 Tier 2 — Solo & Sekitar",
};

const STEPS = ["Penerima", "Barang & Biaya", "Konfirmasi"];
const TIER2 = ["Kota Surakarta (Solo)", "Kabupaten Klaten", "Kabupaten Magelang"];

const LAYANAN_MAP: Record<number, string> = { 1: "Reguler", 2: "Express", 3: "Same Day" };

function generateResi() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "";
  for (let i = 0; i < 10; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return "SK-" + r;
}

function hitungHarga(kotaTujuan: string, berat: number, metode: string) {
  if (!kotaTujuan || berat <= 0) return 0;
  const base = TIER2.includes(kotaTujuan) ? 12000 : 8000;
  const mult = metode === "Express" ? 1.5 : metode === "Same Day" ? 2.5 : 1;
  if (metode === "Same Day" && TIER2.includes(kotaTujuan)) return 0;
  return Math.ceil(berat * base * mult);
}

function estimasiTiba(metode: string, kotaTujuan: string) {
  if (metode === "Same Day") return TIER2.includes(kotaTujuan) ? "❌ Tidak tersedia Tier 2" : "Hari ini (4–8 jam)";
  if (metode === "Express")  return TIER2.includes(kotaTujuan) ? "1–2 hari kerja" : "Hari ini atau besok";
  return TIER2.includes(kotaTujuan) ? "2–3 hari kerja" : "1–2 hari kerja";
}

type Step0Errors    = { nama?: string; hp?: string; alamat?: string; kota?: string; kecamatan?: string };
type Step1Errors    = { berat?: string; kategori?: string; mudahPecah?: string; metode?: string };
type PengirimErrors = { nama?: string; hp?: string };

type DraftPelanggan = {
  id: number;
  resi: string;
  nama_pengirim: string;
  no_hp_pengirim: string;
  alamat_pengirim: string;
  nama_penerima: string;
  no_hp_penerima: string;
  alamat_penerima: string;
  kota_penerima: string;
  kecamatan_penerima: string;
  kode_pos_penerima: string;
  berat: number;
  ongkir: number;
  layanan_id: number;
  kategori_barang: string;
  mudah_pecah: string;
  created_at: string;
  nama_pelanggan: string;
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {msg}</p>;
}

function PhoneInput({ value, onChange, placeholder, error }: {
  value: string; onChange: (v: string) => void; placeholder: string; error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className={`flex items-center border rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition ${error ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}>
        <span className="bg-gray-100 px-3 py-3 text-sm font-semibold text-gray-600 border-r border-gray-200 whitespace-nowrap select-none">+62</span>
        <input
          type="tel" placeholder={placeholder} value={value} maxLength={13}
          onChange={(e) => { const r = e.target.value.replace(/\D/g, ""); if (r.length <= 13) onChange(r); }}
          className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
        />
        <span className={`px-3 text-xs font-medium ${value.length >= 12 ? "text-orange-500" : "text-gray-400"}`}>{value.length}/13</span>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between px-1">
      {STEPS.map((label, i) => {
        const done = i < step; const active = i === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${done ? "bg-emerald-600 text-white" : active ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : "bg-gray-100 text-gray-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${active ? "text-emerald-600" : done ? "text-emerald-500" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all duration-500 ${done ? "bg-emerald-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DRAFT SECTION (PELANGGAN + ADMIN) ───────────────────────────────────────
function DraftCard({
  draft,
  onPrefill,
  onDelete,
  deletingId,
  expandedId,
  setExpandedId,
}: {
  draft: DraftPelanggan;
  onPrefill: (d: DraftPelanggan) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
}) {
  const expanded = expandedId === draft.id;
  const layanan  = LAYANAN_MAP[draft.layanan_id] ?? "Reguler";

  return (
    <div className="bg-white">
      {/* Row utama */}
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-amber-50/50 transition"
        onClick={() => setExpandedId(expanded ? null : draft.id)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {draft.nama_pelanggan || draft.nama_pengirim}
            </span>
            <span className="text-gray-400 text-xs">→</span>
            <span className="text-sm text-gray-700 truncate">{draft.nama_penerima}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">
              {draft.kecamatan_penerima
                ? `${draft.kecamatan_penerima}, ${draft.kota_penerima}`
                : draft.kota_penerima || "—"}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{layanan}</span>
            <span className="text-xs text-gray-400">{draft.berat} kg</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className="text-sm font-bold text-emerald-700">
            Rp {Number(draft.ongkir).toLocaleString("id-ID")}
          </span>
          {expanded
            ? <ChevronUp size={14} className="text-gray-400" />
            : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-4 pt-1 bg-amber-50/40 space-y-3 border-t border-amber-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white rounded-xl p-3 space-y-1 border border-amber-100">
              <p className="font-bold text-emerald-600 uppercase tracking-wide mb-1">Pengirim</p>
              <p><span className="text-gray-400">Nama:</span> {draft.nama_pengirim}</p>
              <p><span className="text-gray-400">HP:</span> +{draft.no_hp_pengirim}</p>
              <p><span className="text-gray-400">Alamat:</span> {draft.alamat_pengirim}</p>
            </div>
            <div className="bg-white rounded-xl p-3 space-y-1 border border-amber-100">
              <p className="font-bold text-emerald-600 uppercase tracking-wide mb-1">Penerima</p>
              <p><span className="text-gray-400">Nama:</span> {draft.nama_penerima}</p>
              <p><span className="text-gray-400">HP:</span> +{draft.no_hp_penerima}</p>
              <p><span className="text-gray-400">Alamat:</span> {draft.alamat_penerima}</p>
              {draft.kecamatan_penerima && (
                <p><span className="text-gray-400">Kecamatan:</span> {draft.kecamatan_penerima}, {draft.kota_penerima}</p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-xs border border-amber-100 flex flex-wrap gap-x-6 gap-y-1">
            <p><span className="text-gray-400">Berat:</span> <strong>{draft.berat} kg</strong></p>
            <p><span className="text-gray-400">Layanan:</span> <strong>{layanan}</strong></p>
            {draft.kategori_barang && <p><span className="text-gray-400">Kategori:</span> {draft.kategori_barang}</p>}
            {draft.mudah_pecah && <p><span className="text-gray-400">Mudah Pecah:</span> {draft.mudah_pecah}</p>}
            <p><span className="text-gray-400">Tanggal:</span> {new Date(draft.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onPrefill(draft); setExpandedId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition"
            >
              ✅ Lanjutkan — Isi ke Form
            </button>
            <button
              onClick={() => onDelete(draft.id)}
              disabled={deletingId === draft.id}
              className="border-2 border-rose-200 text-rose-500 hover:bg-rose-50 py-2.5 px-4 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"
            >
              {deletingId === draft.id
                ? <span className="w-3 h-3 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                : <Trash2 size={13} />}
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DraftPelangganSection({ onPrefill }: { onPrefill: (draft: DraftPelanggan) => void }) {
  const [draftsPelanggan, setDraftsPelanggan] = useState<DraftPelanggan[]>([]);
  const [draftsAdmin,     setDraftsAdmin]     = useState<DraftPelanggan[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [expandedId,      setExpandedId]      = useState<number | null>(null);
  const [deletingId,      setDeletingId]      = useState<number | null>(null);
  const [collapsedCust,   setCollapsedCust]   = useState(false);
  const [collapsedAdmin,  setCollapsedAdmin]  = useState(false);
  const [toastMsg,        setToastMsg]        = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/pengiriman?owner=customer").then(r => r.json()),
      fetch("/api/admin/pengiriman?owner=admin").then(r => r.json()),
    ])
      .then(([resCust, resAdmin]) => {
        if (resCust.success)  setDraftsPelanggan(resCust.data);
        if (resAdmin.success) setDraftsAdmin(resAdmin.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus draft ini?")) return;
    setDeletingId(id);
    try {
      const res    = await fetch("/api/admin/pengiriman", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        setDraftsPelanggan(prev => prev.filter(d => d.id !== id));
        setDraftsAdmin(prev => prev.filter(d => d.id !== id));
        setExpandedId(null);
        showToast("✅ Draft dihapus");
      } else {
        showToast("❌ Gagal menghapus");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const sharedCardProps = { onPrefill, onDelete: handleDelete, deletingId, expandedId, setExpandedId };

  return (
    <div className="space-y-3">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50">
          {toastMsg}
        </div>
      )}

      {/* ── Draft dari Pelanggan ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setCollapsedCust(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-sm">📋</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">Draft dari Pelanggan</p>
              <p className="text-xs text-gray-400">
                {loading ? "Memuat..." : `${draftsPelanggan.length} draft menunggu diproses`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {draftsPelanggan.length > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {draftsPelanggan.length}
              </span>
            )}
            {collapsedCust ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
          </div>
        </button>

        {!collapsedCust && (
          <div className="border-t border-gray-100">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : draftsPelanggan.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">Belum ada draft dari pelanggan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {draftsPelanggan.map(draft => (
                  <DraftCard key={draft.id} draft={draft} {...sharedCardProps} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Draft dari Admin ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setCollapsedAdmin(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-sm">📝</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">Draft Admin</p>
              <p className="text-xs text-gray-400">
                {loading ? "Memuat..." : `${draftsAdmin.length} draft belum diaktifkan`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {draftsAdmin.length > 0 && (
              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {draftsAdmin.length}
              </span>
            )}
            {collapsedAdmin ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
          </div>
        </button>

        {!collapsedAdmin && (
          <div className="border-t border-gray-100">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : draftsAdmin.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">Belum ada draft yang disimpan admin</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {draftsAdmin.map(draft => (
                  <DraftCard key={draft.id} draft={draft} {...sharedCardProps} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INNER ────────────────────────────────────────────────────────────────────
function CreateAdminInner() {
  const [open,          setOpen]          = useState(false);
  const [pageLoading,   setPageLoading]   = useState(true);
  const [repeatLoading, setRepeatLoading] = useState(false);
  const [step,          setStep]          = useState(0);
  const [resi]                            = useState(generateResi);
  const [showModal,     setShowModal]     = useState(false);
  const [savingDraft,   setSavingDraft]   = useState(false);
  const [isRepeat,      setIsRepeat]      = useState(false);

  // Simpan editId draft pelanggan yang sedang diproses
  const [activeDraftId, setActiveDraftId] = useState<number | null>(null);

  const router       = useRouter();
  const searchParams = useSearchParams();

  const repeatId = searchParams?.get("repeat");
  const draftId  = searchParams?.get("draft");

  const [namaPengirim, setNamaPengirim] = useState("");
  const [hpPengirim,   setHpPengirim]   = useState("");
  const [errPengirim,  setErrPengirim]  = useState<PengirimErrors>({});

  const [penerima, setPenerima] = useState({
    nama: "", hp: "", alamat: "", kota: "", kecamatan: "", kodePos: "",
  });

  const [berat,      setBerat]      = useState<number>(0);
  const [kategori,   setKategori]   = useState("");
  const [mudahPecah, setMudahPecah] = useState("");
  const [deskripsi,  setDeskripsi]  = useState("");
  const [metode,     setMetode]     = useState("Reguler");

  const [errors0, setErrors0] = useState<Step0Errors>({});
  const [errors1, setErrors1] = useState<Step1Errors>({});

  const kecamatanList  = penerima.kota ? Object.keys(WILAYAH[penerima.kota] ?? {}) : [];
  const harga          = hitungHarga(penerima.kota, berat, metode);
  const estimasi       = estimasiTiba(metode, penerima.kota);
  const isSameDayTier2 = metode === "Same Day" && TIER2.includes(penerima.kota);

  // ── Prefill dari draft pelanggan (tombol "Proses") ──────────────────────
  const handlePrefillFromDraft = (draft: DraftPelanggan) => {
    const stripHp = (hp: string) => hp?.startsWith("62") ? hp.slice(2) : (hp ?? "");
    setActiveDraftId(draft.id); // ← simpan id draft yang sedang diproses
    setNamaPengirim(draft.nama_pengirim ?? "");
    setHpPengirim(stripHp(draft.no_hp_pengirim));
    setPenerima({
      nama:      draft.nama_penerima      ?? "",
      hp:        stripHp(draft.no_hp_penerima),
      alamat:    draft.alamat_penerima    ?? "",
      kota:      draft.kota_penerima      ?? "",
      kecamatan: draft.kecamatan_penerima ?? "",
      kodePos:   draft.kode_pos_penerima  ?? "",
    });
    setBerat(Number(draft.berat)       || 0);
    setKategori(draft.kategori_barang  ?? "");
    setMudahPecah(draft.mudah_pecah    ?? "");
    setMetode(LAYANAN_MAP[draft.layanan_id] ?? "Reguler");
    setIsRepeat(true);
    setStep(0);
  };

  // ── Prefill dari ?repeat=id atau ?draft=id ───────────────────────────────
  useEffect(() => {
    const loadId = draftId || repeatId;
    if (!loadId) return;
    setRepeatLoading(true);
    setIsRepeat(true);
    fetch(`/api/pengiriman/${loadId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        const stripHp = (hp: string) => hp?.startsWith("62") ? hp.slice(2) : (hp ?? "");
        setNamaPengirim(data.nama_pengirim   ?? "");
        setHpPengirim(stripHp(data.no_hp_pengirim));
        setPenerima({
          nama:      data.nama_penerima      ?? "",
          hp:        stripHp(data.no_hp_penerima),
          alamat:    data.alamat_penerima    ?? "",
          kota:      data.kota_penerima      ?? "",
          kecamatan: data.kecamatan_penerima ?? "",
          kodePos:   data.kode_pos_penerima  ?? "",
        });
        setBerat(Number(data.berat)        || 0);
        setKategori(data.kategori_barang   ?? "");
        setMudahPecah(data.mudah_pecah     ?? "");
        setDeskripsi(data.deskripsi_barang ?? "");
        setMetode(data.layanan             ?? "Reguler");
      })
      .catch(console.error)
      .finally(() => setRepeatLoading(false));
  }, [draftId, repeatId]);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const updatePenerima = (f: string, v: string) => {
    setPenerima((p) => ({ ...p, [f]: v }));
    setErrors0((e) => ({ ...e, [f]: undefined }));
  };

  const handleKota = (v: string) => {
    setPenerima((p) => ({ ...p, kota: v, kecamatan: "", kodePos: "" }));
    setErrors0((e) => ({ ...e, kota: undefined, kecamatan: undefined }));
  };

  const handleKecamatan = (v: string) => {
    const kp = penerima.kota && v ? WILAYAH[penerima.kota]?.[v] ?? "" : "";
    setPenerima((p) => ({ ...p, kecamatan: v, kodePos: kp }));
    setErrors0((e) => ({ ...e, kecamatan: undefined }));
  };

  const validatePengirim = (): boolean => {
    const e: PengirimErrors = {};
    if (!namaPengirim.trim())        e.nama = "Nama pengirim wajib diisi";
    if (!hpPengirim)                 e.hp   = "Nomor HP pengirim wajib diisi";
    else if (hpPengirim.length < 7)  e.hp   = "Nomor HP minimal 7 digit";
    setErrPengirim(e);
    return Object.keys(e).length === 0;
  };

  const validateStep0 = (): boolean => {
    const pengirimOk = validatePengirim();
    const e: Step0Errors = {};
    if (!penerima.nama.trim())       e.nama      = "Nama penerima wajib diisi";
    if (!penerima.hp)                e.hp        = "Nomor HP wajib diisi";
    else if (penerima.hp.length < 7) e.hp        = "Nomor HP minimal 7 digit";
    if (!penerima.alamat.trim())     e.alamat    = "Alamat lengkap wajib diisi";
    if (!penerima.kota)              e.kota      = "Pilih kabupaten/kota tujuan";
    if (!penerima.kecamatan)         e.kecamatan = "Pilih kecamatan tujuan";
    setErrors0(e);
    return pengirimOk && Object.keys(e).length === 0;
  };

  const validateStep1 = (): boolean => {
    const e: Step1Errors = {};
    if (!berat || berat <= 0) e.berat      = "Berat harus lebih dari 0 kg";
    if (!kategori)            e.kategori   = "Pilih kategori barang";
    if (!mudahPecah)          e.mudahPecah = "Pilih apakah barang mudah pecah";
    if (isSameDayTier2)       e.metode     = "Same Day tidak tersedia untuk wilayah Solo/Klaten/Magelang";
    setErrors1(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, 2));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ GANTI 3: buildPayload sekarang kirim ke /api/admin/pengiriman
  // dengan editId (kalau proses draft pelanggan) dan finalize flag
  const buildPayload = (isDraft: boolean) => ({
    ...(activeDraftId ? { editId: activeDraftId } : {}),
    finalize:           !isDraft,
    nama_pengirim:      namaPengirim,
    no_hp_pengirim:     `62${hpPengirim}`,
    alamat_pengirim:    KANTOR.alamat,
    kota_pengirim:      KANTOR.kota,
    kecamatan_pengirim: KANTOR.kecamatan,
    kode_pos_pengirim:  KANTOR.kodePos,
    nama_penerima:      penerima.nama,
    no_hp_penerima:     `62${penerima.hp}`,
    alamat_penerima:    penerima.alamat,
    kota_penerima:      penerima.kota,
    kecamatan_penerima: penerima.kecamatan,
    kode_pos_penerima:  penerima.kodePos,
    berat,
    deskripsi_barang:   deskripsi,
    kategori_barang:    kategori,
    mudah_pecah:        mudahPecah,
    layanan:            metode,
    total_ongkir:       harga,
    status_id:          1,
  });

  const handleSubmit = async () => {
    try {
      const res    = await fetch("/api/admin/pengiriman", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(buildPayload(false)),
      });
      const result = await res.json();
      if (result.success) setShowModal(true);
      else alert(result.error || "Gagal menyimpan data");
    } catch (e: any) {
      alert("Terjadi kesalahan: " + e.message);
    }
  };

  const handleSaveDraft = async () => {
    if (!namaPengirim && !penerima.nama) {
      setErrPengirim({ nama: "Isi minimal nama pengirim untuk menyimpan draft" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSavingDraft(true);
    try {
      const res    = await fetch("/api/admin/pengiriman", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(buildPayload(true)),
      });
      const result = await res.json();
      if (result.success) {
        const toast       = document.createElement("div");
        toast.className   = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50";
        toast.textContent = "✅ Draft berhasil disimpan!";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
      } else {
        alert(result.error || "Gagal menyimpan draft");
      }
    } catch (e: any) {
      alert("Terjadi kesalahan: " + e.message);
    } finally {
      setSavingDraft(false);
    }
  };

  if (pageLoading || repeatLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 space-y-4 animate-pulse">
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 p-6 rounded-2xl">
            <div className="h-6 w-48 bg-white/25 rounded-xl" />
            <div className="h-4 w-32 bg-white/15 rounded mt-3" />
          </div>
          <div className="bg-white rounded-2xl p-5 space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
          </div>
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div className="h-2 w-12 bg-gray-100 rounded hidden sm:block" />
                  </div>
                  {i < 3 && <div className="flex-1 h-0.5 mx-2 mb-4 bg-gray-200 rounded" />}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 space-y-3">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />
      <div className="p-4 space-y-4">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                {isRepeat ? "🔁 Proses Draft Pelanggan" : "Input Pengiriman"}
              </h1>
              <p className="text-sm opacity-80 mt-0.5">{STEPS[step]} — Langkah {step + 1} dari {STEPS.length}</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider">{resi}</div>
          </div>
        </div>

        {/* ── DRAFT PELANGGAN SECTION ── */}
        <DraftPelangganSection onPrefill={handlePrefillFromDraft} />

        {/* BANNER ketika sedang proses draft */}
        {isRepeat && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">🔁</span>
            <div>
              <p className="text-sm font-bold text-emerald-800">Data draft sudah terisi ke form</p>
              <p className="text-xs text-emerald-600">Periksa, sesuaikan jika perlu, lalu aktifkan pengiriman.</p>
            </div>
          </div>
        )}

        {/* STEP INDICATOR */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <StepIndicator step={step} />
        </div>

        {/* PENGIRIM */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">📍 Pengirim</span>
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Babarsari</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Nama Pengirim *</label>
              <input
                value={namaPengirim}
                onChange={(e) => { setNamaPengirim(e.target.value); setErrPengirim(v => ({ ...v, nama: undefined })); }}
                placeholder="Nama lengkap pengirim"
                className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition
                  ${errPengirim.nama ? "border-red-400 bg-red-50/30" : "border-emerald-200"}`}
              />
              <FieldError msg={errPengirim.nama} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">No. HP Pengirim *</label>
              <PhoneInput
                value={hpPengirim}
                onChange={(v) => { setHpPengirim(v); setErrPengirim(e => ({ ...e, hp: undefined })); }}
                placeholder="8xx-xxxx-xxxx"
                error={errPengirim.hp}
              />
            </div>
          </div>
          <div className="bg-white/70 rounded-xl px-4 py-3 text-sm text-gray-600 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-600">Alamat Kantor (Tetap): </span>
            {KANTOR.alamat}, {KANTOR.kecamatan}, {KANTOR.kota} — {KANTOR.kodePos}
          </div>
        </div>

        {/* STEP 0: PENERIMA */}
        {step === 0 && (
          <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">👥</span>
              Data Penerima
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lengkap *</label>
                <input
                  className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors0.nama ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                  placeholder="Nama penerima" value={penerima.nama}
                  onChange={(e) => updatePenerima("nama", e.target.value)} />
                <FieldError msg={errors0.nama} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No. HP *</label>
                <PhoneInput value={penerima.hp} onChange={(v) => updatePenerima("hp", v)} placeholder="8xx-xxxx-xxxx" error={errors0.hp} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alamat Lengkap *</label>
              <textarea rows={2}
                className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition ${errors0.alamat ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
                placeholder="Nama jalan, nomor, RT/RW, kelurahan" value={penerima.alamat}
                onChange={(e) => updatePenerima("alamat", e.target.value)} />
              <FieldError msg={errors0.alamat} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kabupaten / Kota *</label>
                <select value={penerima.kota} onChange={(e) => handleKota(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition ${errors0.kota ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}>
                  <option value="">Pilih Kota/Kabupaten</option>
                  <optgroup label="🟢 Tier 1 — Jogja Lokal">
                    {["Kota Yogyakarta","Kabupaten Sleman","Kabupaten Bantul"].map(k => <option key={k} value={k}>{k}</option>)}
                  </optgroup>
                  <optgroup label="🟡 Tier 2 — Solo & Sekitar">
                    {["Kota Surakarta (Solo)","Kabupaten Klaten","Kabupaten Magelang"].map(k => <option key={k} value={k}>{k}</option>)}
                  </optgroup>
                </select>
                {penerima.kota && <p className="text-xs text-emerald-600 font-medium">{TIER_LABEL[penerima.kota]}</p>}
                <FieldError msg={errors0.kota} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kecamatan *</label>
                <select value={penerima.kecamatan} onChange={(e) => handleKecamatan(e.target.value)} disabled={!penerima.kota}
                  className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition
                    ${!penerima.kota ? "border-gray-100 text-gray-400 bg-gray-50" : errors0.kecamatan ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}>
                  <option value="">{penerima.kota ? "Pilih Kecamatan" : "Pilih kota dulu"}</option>
                  {kecamatanList.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <FieldError msg={errors0.kecamatan} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kode Pos</label>
                <input readOnly value={penerima.kodePos} placeholder="Otomatis terisi"
                  className="w-full border border-gray-100 rounded-xl px-3 py-3 text-sm bg-emerald-50 text-emerald-700 font-semibold outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: BARANG & BIAYA */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">📦</span>
                Detail Barang
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berat (kg) *</label>
                  <input type="number" min="0.1" step="0.1" value={berat || ""}
                    onChange={(e) => { setBerat(Number(e.target.value) || 0); setErrors1(v => ({...v, berat: undefined})); }}
                    placeholder="Contoh: 2.5"
                    className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors1.berat ? "border-red-400 bg-red-50/30" : "border-gray-200"}`} />
                  <FieldError msg={errors1.berat} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori *</label>
                  <select value={kategori}
                    onChange={(e) => { setKategori(e.target.value); setErrors1(v => ({...v, kategori: undefined})); }}
                    className={`w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition ${errors1.kategori ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}>
                    <option value="">Pilih Kategori</option>
                    {["Elektronik","Pakaian","Makanan","Dokumen","Perabotan","Lainnya"].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <FieldError msg={errors1.kategori} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Barang Mudah Pecah? *</label>
                  <div className="flex gap-3">
                    {["Ya","Tidak"].map(opt => (
                      <button key={opt} type="button"
                        onClick={() => { setMudahPecah(opt); setErrors1(v => ({...v, mudahPecah: undefined})); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all
                          ${mudahPecah === opt ? "border-emerald-600 bg-emerald-50 text-emerald-700" :
                            errors1.mudahPecah ? "border-red-300 text-gray-500" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {opt === "Ya" ? "🥚 Ya, mudah pecah" : "💪 Tidak"}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors1.mudahPecah} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi Barang</label>
                <textarea rows={3} placeholder="Isi opsional — deskripsikan isi paket" value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">🚚</span>
                Layanan Pengiriman
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "Reguler",  label: "Reguler",  desc: "1–3 hari",      icon: "📦", mult: "1x"   },
                  { val: "Express",  label: "Express",  desc: "Hari ini/besok", icon: "⚡", mult: "1.5x" },
                  { val: "Same Day", label: "Same Day", desc: "Tier 1 saja",    icon: "🔥", mult: "2.5x" },
                ].map((m) => {
                  const disabled = m.val === "Same Day" && TIER2.includes(penerima.kota);
                  return (
                    <button key={m.val} type="button"
                      onClick={() => { if (!disabled) { setMetode(m.val); setErrors1(v => ({...v, metode: undefined})); } }}
                      disabled={disabled}
                      className={`rounded-xl border-2 p-3 text-center transition-all
                        ${disabled ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed" :
                          metode === m.val ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="text-xl">{m.icon}</div>
                      <div className={`text-xs font-bold mt-1 ${metode === m.val ? "text-emerald-700" : "text-gray-700"}`}>{m.label}</div>
                      <div className="text-[10px] text-gray-400">{m.desc}</div>
                      <div className={`text-[10px] font-semibold mt-1 ${metode === m.val ? "text-emerald-600" : "text-gray-400"}`}>{m.mult} tarif</div>
                    </button>
                  );
                })}
              </div>
              <FieldError msg={errors1.metode} />
            </div>

            {harga > 0 && (
              <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm opacity-80">Ringkasan Biaya</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="opacity-70 text-xs">Tujuan</p><p className="font-semibold">{penerima.kecamatan}, {penerima.kota}</p></div>
                  <div><p className="opacity-70 text-xs">Berat</p><p className="font-semibold">{berat} kg</p></div>
                  <div><p className="opacity-70 text-xs">Estimasi Tiba</p><p className="font-semibold">{estimasi}</p></div>
                  <div><p className="opacity-70 text-xs">Layanan</p><p className="font-semibold">{metode}</p></div>
                </div>
                <div className="border-t border-white/30 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-sm">Total Ongkir</span>
                  <span className="text-2xl font-extrabold">Rp {harga.toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: KONFIRMASI */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800">📋 Konfirmasi Data</h2>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-1 text-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Pengirim</p>
                <p><span className="text-gray-500">Nama:</span> <strong>{namaPengirim}</strong></p>
                <p><span className="text-gray-500">HP:</span> +62{hpPengirim}</p>
                <p><span className="text-gray-500">Alamat:</span> {KANTOR.alamat}, {KANTOR.kecamatan}, {KANTOR.kota}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 space-y-1 text-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Penerima</p>
                <p><span className="text-gray-500">Nama:</span> <strong>{penerima.nama}</strong></p>
                <p><span className="text-gray-500">HP:</span> +62{penerima.hp}</p>
                <p><span className="text-gray-500">Alamat:</span> {penerima.alamat}</p>
                <p><span className="text-gray-500">Kecamatan:</span> {penerima.kecamatan}, {penerima.kota}</p>
                <p><span className="text-gray-500">Kode Pos:</span> <strong>{penerima.kodePos}</strong></p>
                <p><span className="text-gray-500">Zona:</span> {TIER_LABEL[penerima.kota]}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 space-y-1 text-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Barang & Pengiriman</p>
                <p><span className="text-gray-500">Kategori:</span> {kategori} {mudahPecah === "Ya" ? "🥚 (Mudah Pecah)" : ""}</p>
                <p><span className="text-gray-500">Berat:</span> {berat} kg</p>
                <p><span className="text-gray-500">Layanan:</span> {metode}</p>
                <p><span className="text-gray-500">Estimasi Tiba:</span> <strong>{estimasi}</strong></p>
                {deskripsi && <p><span className="text-gray-500">Deskripsi:</span> {deskripsi}</p>}
              </div>
              <div className="rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-70">No. Resi</p>
                  <p className="font-mono font-bold tracking-wider">{resi}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Total Ongkir</p>
                  <p className="text-2xl font-extrabold">Rp {harga.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>
            <button onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md">
              ✅ Aktifkan Pengiriman & Cetak Resi
            </button>
          </div>
        )}

        {/* NAVIGASI */}
        <div className="space-y-3 pb-8">
          {step < 2 && (
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={handleBack}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-2xl font-semibold hover:border-gray-300 transition-colors">
                  ← Kembali
                </button>
              )}
              <button onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold transition-all shadow-md">
                Lanjut →
              </button>
            </div>
          )}
          {step === 2 && (
            <button onClick={handleBack}
              className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold hover:border-gray-300 transition-colors">
              ← Edit Data
            </button>
          )}
          <button onClick={handleSaveDraft} disabled={savingDraft}
            className="w-full border-2 border-dashed border-emerald-400 text-emerald-700 py-3 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {savingDraft ? "Menyimpan..." : "📝 Simpan sebagai Draft"}
          </button>
        </div>
      </div>

      {/* MODAL RESI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white p-5 text-center">
              <p className="text-xs opacity-80 tracking-widest uppercase">SahabatKargo.id</p>
              <h1 className="text-lg font-extrabold mt-1">Resi Pengiriman</h1>
            </div>
            <div className="p-5 font-mono space-y-3 text-sm">
              <div className="text-center bg-gray-50 rounded-xl py-3">
                <p className="text-xs text-gray-400 mb-1">NOMOR RESI</p>
                <p className="text-xl font-extrabold tracking-widest text-emerald-700">{resi}</p>
              </div>
              <div className="border-t border-dashed pt-3 space-y-2">
                {[
                  ["Pengirim",  namaPengirim],
                  ["Dari",      `${KANTOR.alamat}, ${KANTOR.kecamatan}`],
                  ["HP",        `+62${hpPengirim}`],
                  ["Penerima",  `${penerima.nama} (+62${penerima.hp})`],
                  ["Tujuan",    `${penerima.kecamatan}, ${penerima.kota}`],
                  ["Berat",     `${berat} kg`],
                  ["Layanan",   metode],
                  ["Est. Tiba", estimasi],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-semibold text-right text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed pt-3 flex justify-between text-base font-extrabold">
                <span>TOTAL</span>
                <span className="text-emerald-700">Rp {harga.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-3 rounded-xl font-bold">
                🖨 Cetak
              </button>
              <button onClick={() => router.push("/admin/dashboard")}
                className="flex-1 bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-bold">
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateAdminClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Memuat form...
      </div>
    }>
      <CreateAdminInner />
    </Suspense>
  );
}
