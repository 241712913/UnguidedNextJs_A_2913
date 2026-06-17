"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function EditShipmentPage() {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [resi, setResi] = useState("");
  const [namaPengirim, setNamaPengirim] = useState("");
  const [hpPengirim, setHpPengirim] = useState("");
  const [alamatPengirim, setAlamatPengirim] = useState("");
  const [kotaPengirim, setKotaPengirim] = useState("");
  const [kodePosPengirim, setKodePosPengirim] = useState("");
  const [namaPenerima, setNamaPenerima] = useState("");
  const [hpPenerima, setHpPenerima] = useState("");
  const [alamatPenerima, setAlamatPenerima] = useState("");
  const [kotaPenerima, setKotaPenerima] = useState("");
  const [kodePosPenerima, setKodePosPenerima] = useState("");
  const [berat, setBerat] = useState<number>(0);
  const [deskripsiBarang, setDeskripsiBarang] = useState("");
  const [layanan, setLayanan] = useState("Reguler");
  const [statusId, setStatusId] = useState(1);
  const [totalOngkir, setTotalOngkir] = useState(0);

  useEffect(() => {
    if (!params.id) return;

    async function fetchShipment() {
      try {
        const res = await fetch(`/api/pengiriman/${params.id}`);
        const result = await res.json();

        setResi(result.resi || "");
        setNamaPengirim(result.nama_pengirim || "");
        setHpPengirim(result.hp_pengirim || "");
        setAlamatPengirim(result.alamat_pengirim || "");
        setKotaPengirim(result.kota_pengirim || "");
        setKodePosPengirim(result.kode_pos_pengirim || "");
        setNamaPenerima(result.nama_penerima || "");
        setHpPenerima(result.hp_penerima || "");
        setAlamatPenerima(result.alamat_penerima || "");
        setKotaPenerima(result.kota_penerima || "");
        setKodePosPenerima(result.kode_pos_penerima || "");
        setBerat(Number(result.berat) || 0);
        setDeskripsiBarang(result.deskripsi_barang || "");
        setLayanan(result.layanan || result.metode || "Reguler");
        setStatusId(Number(result.status_id) || 1);
        setTotalOngkir(Number(result.total_ongkir ?? result.ongkir) || 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchShipment();
  }, [params.id]);

  useEffect(() => {
    const isValid =
      namaPengirim.trim() !== "" &&
      hpPengirim.trim() !== "" &&
      namaPenerima.trim() !== "" &&
      hpPenerima.trim() !== "" &&
      berat > 0 &&
      kotaPengirim.trim() !== "" &&
      kotaPenerima.trim() !== "" &&
      layanan !== "";

    if (!isValid) {
      setTotalOngkir(0);
      return;
    }

    let baseRate = 7000;
    const zonaJauh = [
      "Surabaya",
      "Bandung",
      "Medan",
      "Makassar",
      "Denpasar",
      "Yogyakarta",
    ];

    if (zonaJauh.includes(kotaPengirim) || zonaJauh.includes(kotaPenerima)) {
      baseRate = 12000;
    }

    if (kotaPengirim !== kotaPenerima) {
      baseRate += 3000;
    }

    let multiplier = 1;
    if (layanan === "Express") multiplier = 1.5;
    if (layanan === "Same Day") multiplier = 2.5;

    setTotalOngkir(Math.ceil(berat * baseRate * multiplier));
  }, [namaPengirim, hpPengirim, namaPenerima, hpPenerima, berat, kotaPengirim, kotaPenerima, layanan]);

  const handleSubmit = async () => {
    if (!params.id) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/pengiriman/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_pengirim: namaPengirim,
          hp_pengirim: hpPengirim,
          alamat_pengirim: alamatPengirim,
          kota_pengirim: kotaPengirim,
          kode_pos_pengirim: kodePosPengirim,
          nama_penerima: namaPenerima,
          hp_penerima: hpPenerima,
          alamat_penerima: alamatPenerima,
          kota_penerima: kotaPenerima,
          kode_pos_penerima: kodePosPenerima,
          berat,
          deskripsi_barang: deskripsiBarang,
          layanan,
          total_ongkir: totalOngkir,
          status_id: statusId,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.error || "Gagal memperbarui data");
        return;
      }

      router.push("/admin/shipment");
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F3F5F4] min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="p-3 animate-pulse space-y-4">
          <div className="h-16 rounded-3xl bg-white"></div>
          <div className="h-12 rounded-3xl bg-white"></div>
          <div className="h-96 rounded-3xl bg-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow">
          <h1 className="text-2xl font-bold">Edit Pengiriman</h1>
          <p className="text-sm text-gray-500 mt-2">
            Ubah data pengiriman lalu simpan.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nomor Resi</label>
            <input
              value={resi}
              readOnly
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nama Pengirim</label>
              <input
                value={namaPengirim}
                onChange={(e) => setNamaPengirim(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">No HP Pengirim</label>
              <input
                value={hpPengirim}
                onChange={(e) => setHpPengirim(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Alamat Pengirim</label>
            <textarea
              value={alamatPengirim}
              onChange={(e) => setAlamatPengirim(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={kotaPengirim}
              onChange={(e) => setKotaPengirim(e.target.value)}
              placeholder="Kota Pengirim"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
            <input
              value={kodePosPengirim}
              onChange={(e) => setKodePosPengirim(e.target.value.replace(/\D/g, ""))}
              placeholder="Kode Pos Pengirim"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nama Penerima</label>
              <input
                value={namaPenerima}
                onChange={(e) => setNamaPenerima(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">No HP Penerima</label>
              <input
                value={hpPenerima}
                onChange={(e) => setHpPenerima(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Alamat Penerima</label>
            <textarea
              value={alamatPenerima}
              onChange={(e) => setAlamatPenerima(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={kotaPenerima}
              onChange={(e) => setKotaPenerima(e.target.value)}
              placeholder="Kota Penerima"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
            <input
              value={kodePosPenerima}
              onChange={(e) => setKodePosPenerima(e.target.value.replace(/\D/g, ""))}
              placeholder="Kode Pos Penerima"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              value={berat || ""}
              min={0.1}
              step={0.1}
              onChange={(e) => setBerat(Number(e.target.value) || 0)}
              placeholder="Berat (kg)"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
            <select
              value={layanan}
              onChange={(e) => setLayanan(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            >
              <option value="Reguler">Reguler</option>
              <option value="Express">Express</option>
              <option value="Same Day">Same Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Deskripsi Barang</label>
            <textarea
              value={deskripsiBarang}
              onChange={(e) => setDeskripsiBarang(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
              >
                <option value={1}>Menunggu</option>
                <option value={2}>Dijemput</option>
                <option value={3}>Dalam perjalanan</option>
                <option value={4}>Diantar</option>
                <option value={5}>Terkirim</option>
                <option value={6}>Gagal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Total Ongkir</label>
              <input
                readOnly
                value={totalOngkir.toLocaleString("id-ID")}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/shipment")}
              className="w-full md:w-auto rounded-2xl border border-gray-200 px-5 py-3 text-gray-700"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full md:w-auto rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
