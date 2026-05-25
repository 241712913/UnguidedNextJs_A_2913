// Simpan file ini di: app/components/EditModal.tsx

"use client";

import { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface Shipment {
  id: number;
  resi?: string;
  nama_pengirim: string;
  nama_penerima: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  no_hp_pengirim: string;
  no_hp_penerima: string;
  berat: number;
  status_id: number;
}

interface EditModalProps {
  shipment: Shipment | null;
  onClose: () => void;
  onSuccess: (updated: Shipment) => void;
}

const STATUS_OPTIONS = [
  { value: 1, label: "Menunggu" },
  { value: 2, label: "Dijemput" },
  { value: 3, label: "Dalam perjalanan" },
  { value: 4, label: "Sedang diantar" },
  { value: 5, label: "Terkirim" },
  { value: 6, label: "Gagal" },
];

export default function EditModal({ shipment, onClose, onSuccess }: EditModalProps) {
  const [form, setForm] = useState<Omit<Shipment, "id" | "resi">>({
    nama_pengirim: "",
    nama_penerima: "",
    alamat_pengirim: "",
    alamat_penerima: "",
    no_hp_pengirim: "",
    no_hp_penerima: "",
    berat: 0,
    status_id: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Isi form saat shipment berubah
  useEffect(() => {
    if (shipment) {
      setForm({
        nama_pengirim: shipment.nama_pengirim ?? "",
        nama_penerima: shipment.nama_penerima ?? "",
        alamat_pengirim: shipment.alamat_pengirim ?? "",
        alamat_penerima: shipment.alamat_penerima ?? "",
        no_hp_pengirim: shipment.no_hp_pengirim ?? "",
        no_hp_penerima: shipment.no_hp_penerima ?? "",
        berat: shipment.berat ?? 0,
        status_id: shipment.status_id ?? 1,
      });
      setError("");
    }
  }, [shipment]);

  if (!shipment) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "berat" || name === "status_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/pengiriman/${shipment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Gagal mengupdate data");
        return;
      }

      onSuccess(result);
      onClose();
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal box */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-t-3xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Pengiriman</h2>
            {shipment.resi && (
              <p className="text-green-100 text-sm mt-1">Resi: {shipment.resi}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Section Pengirim */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Data Pengirim
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  name="nama_pengirim"
                  value={form.nama_pengirim}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. HP Pengirim
                </label>
                <input
                  type="text"
                  name="no_hp_pengirim"
                  value={form.no_hp_pengirim}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Pengirim
                </label>
                <textarea
                  name="alamat_pengirim"
                  value={form.alamat_pengirim}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section Penerima */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Data Penerima
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  name="nama_penerima"
                  value={form.nama_penerima}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. HP Penerima
                </label>
                <input
                  type="text"
                  name="no_hp_penerima"
                  value={form.no_hp_penerima}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Penerima
                </label>
                <textarea
                  name="alamat_penerima"
                  value={form.alamat_penerima}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Berat & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat (kg)
              </label>
              <input
                type="number"
                name="berat"
                value={form.berat}
                onChange={handleChange}
                min={0}
                step={0.1}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status_id"
                value={form.status_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-2xl font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-700 to-green-600 text-white hover:opacity-90 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
