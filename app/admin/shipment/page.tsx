// Simpan file ini di: app/admin/shipment/page.tsx
// Ganti/replace seluruh isi page.tsx yang lama dengan ini

"use client";

import { useEffect, useState } from "react";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

import { Search } from "lucide-react";
import ShipmentTable from "./tabel";

export default function ShipmentPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [tanggal, setTanggal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  // ─── Fetch data awal ──────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/pengiriman");
        const result = await res.json();

        if (Array.isArray(result)) {
          setShipments(result);
        } else if (result.pengiriman) {
          setShipments(result.pengiriman);
        } else {
          setShipments([]);
        }
      } catch (err) {
        console.log(err);
        setShipments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Handler Delete ────────────────────────────────────
  // Dipanggil oleh ShipmentTable setelah DELETE berhasil di API
  const handleDelete = (id: number) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── Handler Update ────────────────────────────────────
  // Dipanggil oleh EditModal setelah PUT berhasil di API
  const handleUpdate = (updated: any) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  };

  // ─── Filter ────────────────────────────────────────────
  const filteredShipments = shipments.filter((item) => {
    const matchSearch =
      item.resi?.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_pengirim?.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_penerima?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "all" ? true : String(item.status_id) === status;

    const matchTanggal =
      tanggal === ""
        ? true
        : new Date(item.created_at).toISOString().split("T")[0] === tanggal;

    return matchSearch && matchStatus && matchTanggal;
  });

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

  const currentShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ─── Loading skeleton ──────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#F3F5F4] min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <Navbar onMenuClick={() => setOpen(true)} />

        <div className="p-3 space-y-4 animate-pulse">
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-[30px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
            <div className="h-7 w-64 bg-white/25 rounded mb-3"></div>
            <div className="h-4 w-44 bg-white/15 rounded"></div>
          </div>
          <div className="bg-white rounded-[28px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row gap-4">
            <div className="h-12 flex-1 bg-gray-100 rounded-2xl"></div>
            <div className="h-12 w-40 bg-gray-100 rounded-2xl"></div>
            <div className="h-12 w-52 bg-gray-100 rounded-2xl"></div>
          </div>
          <div className="bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="h-5 w-52 bg-gray-200 rounded"></div>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-5 flex items-center gap-4">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <div className="h-10 w-20 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // ─── UI Normal ─────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 space-y-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-3xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Daftar Pengiriman</h1>
            <p className="text-green-100 mt-2 text-sm">
              {filteredShipments.length} data ditemukan
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/admin/create")}
            className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-2xl font-semibold"
          >
            + Tambah
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-3xl p-4 shadow flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari resi, pengirim, penerima..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <input
            type="date"
            value={tanggal}
            onChange={(e) => {
              setTanggal(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">Semua Status</option>
            <option value="1">Menunggu</option>
            <option value="2">Dijemput</option>
            <option value="3">Dalam perjalanan</option>
            <option value="4">Sedang diantar</option>
            <option value="5">Terkirim</option>
            <option value="6">Gagal</option>
          </select>
        </div>

        {/* TABLE — kirim handler delete & update */}
        <ShipmentTable
          shipments={currentShipments}
          loading={false}
          onDeleteAction={handleDelete}
          onUpdateAction={handleUpdate}
        />

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 py-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-white px-5 py-2 rounded-xl border disabled:opacity-50"
          >
            Prev
          </button>

          <div className="bg-white px-5 py-2 rounded-xl border">
            {currentPage} / {totalPages || 1}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-white px-5 py-2 rounded-xl border disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
