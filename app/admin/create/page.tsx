"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function CreatePage() {
  const [open, setOpen] = useState(false);
  const [resi, setResi] = useState("");
  const [berat, setBerat] = useState<number>(0);
  const [harga, setHarga] = useState(0);
  const [showKalkulasi, setShowKalkulasi] = useState(false);

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

  const [deskripsiBarang, setDeskripsiBarang] = useState("");
  const [metode, setMetode] = useState("Reguler");

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [dataResi, setDataResi] = useState<any>(null);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = "";
    for (let i = 0; i < 10; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
    setResi("SK-" + random);
  }, []);

  useEffect(() => {
    const isValid =
      namaPengirim.trim() !== "" &&
      hpPengirim.trim() !== "" &&
      namaPenerima.trim() !== "" &&
      hpPenerima.trim() !== "" &&
      berat > 0 &&
      kotaPengirim.trim() !== "" &&
      kotaPenerima.trim() !== "" &&
      metode !== "";

    setShowKalkulasi(isValid);

    if (!isValid) {
      setHarga(0);
      return;
    }

    let baseRate = 7000; 

    const zonaJauh = ["Surabaya", "Bandung", "Medan", "Makassar", "Denpasar", "Yogyakarta"];

    if (zonaJauh.includes(kotaPengirim) || zonaJauh.includes(kotaPenerima)) {
      baseRate = 12000;
    }
    if (kotaPengirim !== kotaPenerima) {
      baseRate += 3000; 
    }

    let multiplier = 1;
    if (metode === "Express") multiplier = 1.5;
    if (metode === "Same Day") multiplier = 2.5;

    const total = Math.ceil(berat * baseRate * multiplier);
    setHarga(total);
  }, [
    namaPengirim,
    hpPengirim,
    namaPenerima,
    hpPenerima,
    berat,
    kotaPengirim,
    kotaPenerima,
    metode,
  ]);
  
  const handleSubmit = () => {
    if (!resi || harga === 0 || !showKalkulasi) {
      alert("Mohon lengkapi semua data yang bertanda *");
      return;
    }

    const pengirimanData = {
      resi,
      tanggal: new Date().toLocaleDateString("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      }),
      namaPengirim,
      hpPengirim,
      alamatPengirim,
      kotaPengirim,
      kodePosPengirim,

      namaPenerima,
      hpPenerima,
      alamatPenerima,
      kotaPenerima,
      kodePosPenerima,

      berat,
      deskripsiBarang,
      metode,
      totalOngkir: harga,
      estimasi: metode === "Same Day" ? "Hari ini" : "3-5 hari kerja",
      status: "Sedang Diproses",
    };

    const queryString = new URLSearchParams(
      Object.entries(pengirimanData).map(([key, value]) => [
        key,
        String(value)
      ])
    ).toString();

    setDataResi(pengirimanData);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-3">
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 rounded-2xl">
          <h1 className="text-xl font-bold">Input Pengiriman</h1>
          <p className="text-sm opacity-90">Isi semua data dengan lengkap</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-3">
          <h2 className="font-semibold">Nomor Resi</h2>
          <input
            value={resi}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 font-mono text-lg"
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold">👤 Data Pengirim</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Nama Pengirim *"
              value={namaPengirim}
              onChange={(e) => setNamaPengirim(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="No HP *"
              type="tel"
              value={hpPengirim}
              onChange={(e) => setHpPengirim(e.target.value)}
            />
            <input
              className="col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Alamat Lengkap *"
              value={alamatPengirim}
              onChange={(e) => setAlamatPengirim(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Kota *"
              value={kotaPengirim}
              onChange={(e) => setKotaPengirim(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Kode Pos *"
              value={kodePosPengirim}
              onChange={(e) => setKodePosPengirim(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold">👥 Data Penerima</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Nama Penerima *"
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="No HP *"
              type="tel"
              value={hpPenerima}
              onChange={(e) => setHpPenerima(e.target.value)}
            />
            <input
              className="col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Alamat Lengkap *"
              value={alamatPenerima}
              onChange={(e) => setAlamatPenerima(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Kota *"
              value={kotaPenerima}
              onChange={(e) => setKotaPenerima(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Kode Pos *"
              value={kodePosPenerima}
              onChange={(e) => setKodePosPenerima(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold">📦 Detail Barang</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Berat (kg) *"
              type="number"
              min="0.1"
              step="0.1"
              value={berat || ""}
              onChange={(e) => setBerat(Number(e.target.value) || 0)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Panjang (cm)"
              type="number"
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
              placeholder="Lebar (cm)"
              type="number"
            />
          </div>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
            placeholder="Deskripsi barang"
            value={deskripsiBarang}
            onChange={(e) => setDeskripsiBarang(e.target.value)}
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold">🚚 Informasi Pengiriman</h2>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600"
            value={metode}
            onChange={(e) => setMetode(e.target.value)}
          >
            <option value="Reguler">Reguler</option>
            <option value="Express">Express</option>
            <option value="Same Day">Same Day</option>
          </select>
        </div>

        {showKalkulasi && (
          <div className="bg-green-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-gray-600">Zona Pengiriman</p>
              <p className="font-semibold text-lg">
                {kotaPengirim} → {kotaPenerima}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimasi Tiba</p>
              <p className="font-semibold">
                {metode === "Same Day" ? "Hari ini" : "3-5 hari kerja"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Ongkir</p>
              <p className="font-bold text-green-700 text-2xl">
                Rp {harga.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-4 rounded-xl font-semibold text-lg transition"
        >
          Buat Pengiriman & Cetak Resi
        </button>

        {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            id="resi-print"
            className="bg-white w-[380px] rounded-2xl shadow-2xl p-6 font-mono"
          >
            {/* HEADER */}
            <div className="text-center border-b pb-3">
              <h1 className="text-2xl font-bold tracking-wide">
                SAHABATKARGO.ID
              </h1>
              <p className="text-xs text-gray-500">
                Solusi Kirim Barang Cepat & Aman
              </p>
            </div>

            {/* RESI */}
            <div className="text-center my-4">
              <p className="text-xs text-gray-500">NO RESI</p>
              <h2 className="text-xl font-bold tracking-widest">{resi}</h2>
            </div>

            <div className="border-t border-dashed my-3"></div>

            {/* DATA */}
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Pengirim</span>
                <span className="font-semibold text-right">{namaPengirim}</span>
              </div>
              <div className="flex justify-between">
                <span>HP</span>
                <span>{hpPengirim}</span>
              </div>

              <div className="border-t border-dashed my-2"></div>

              <div className="flex justify-between">
                <span>Penerima</span>
                <span className="font-semibold text-right">{namaPenerima}</span>
              </div>
              <div className="flex justify-between">
                <span>HP</span>
                <span>{hpPenerima}</span>
              </div>

              <div className="border-t border-dashed my-2"></div>

              <div className="flex justify-between">
                <span>Rute</span>
                <span>{kotaPengirim} → {kotaPenerima}</span>
              </div>

              <div className="flex justify-between">
                <span>Berat</span>
                <span>{berat} kg</span>
              </div>

              <div className="flex justify-between">
                <span>Layanan</span>
                <span>{metode}</span>
              </div>
            </div>

            <div className="border-t border-dashed my-3"></div>

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL</span>
              <span>Rp {harga.toLocaleString("id-ID")}</span>
            </div>

            <div className="border-t border-dashed my-3"></div>

            {/* FOOTER */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>Terima kasih telah menggunakan</p>
              <p className="font-bold">SahabatKargo.id</p>
              <p>{new Date().toLocaleString("id-ID")}</p>
            </div>

            {/* BUTTON */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Cetak
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}