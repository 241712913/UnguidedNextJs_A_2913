"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";

import { Search, ChevronDown, ChevronUp } from "lucide-react";

type Shipment = {
  id: number;
  resi: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  status: string;
};

export default function TrackingPage() {
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [resi, setResi] = useState("");

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [result, setResult] = useState<Shipment[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/home");
        const data = await res.json();
        setShipments(data.shipments || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams?.get("resi") || "";
    if (!q) return;

    setResi(q);

    if (!loading) {
      const found = shipments.filter((item) =>
        item.resi?.toLowerCase().includes(q.toLowerCase())
      );

      setResult(found);
      setSearched(true);
    }
  }, [searchParams, loading]);

  const handleSearch = () => {
    const keyword = resi.trim();

    if (!keyword) {
      setResult([]);
      setSearched(false);
      return;
    }

    setSearched(true);
    setSearchLoading(true);
    setResult([]);

    setTimeout(() => {
      const found = shipments.filter((item) =>
        item.resi?.toLowerCase().includes(keyword.toLowerCase())
      );

      setResult(found);
      setSearchLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="px-3 py-4 space-y-3 md:px-6 md:space-y-4">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-5 md:p-6 shadow-lg shadow-emerald-100">
          <div className="relative z-10">
            <h1 className="text-xl font-bold">Lacak Pengiriman</h1>
            <p className="text-sm text-emerald-50/80 mt-1 mb-4">
              Masukkan nomor resi untuk melihat status paket
            </p>

            <div className="flex gap-2">
              <div className="flex items-center bg-white rounded-2xl px-4 py-3 flex-1 min-w-0 shadow-sm">
                <Search size={16} className="text-emerald-400 mr-2.5 shrink-0" />
                <input
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Masukkan nomor resi..."
                  className="w-full min-w-0 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-white text-emerald-600 px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-emerald-50 active:scale-95 transition shrink-0"
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* GUIDE */}
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm text-slate-700 font-semibold hover:bg-emerald-50/60 active:bg-emerald-50 transition"
          >
            <span>Cara menemukan nomor resi</span>
            {showGuide ? (
              <ChevronUp size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <ChevronDown size={18} className="text-emerald-600 shrink-0" />
            )}
          </button>

          {showGuide && (
            <div className="px-5 pb-5 text-sm text-slate-600 space-y-2.5 border-t border-emerald-50">
              {[
                "Cek email konfirmasi",
                "Lihat riwayat pengiriman",
                "Cek struk pengiriman",
              ].map((tip) => (
                <div key={tip} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SKELETON — initial load */}
        {loading ? (
          <SkeletonList />
        ) : (
          <>
            {/* SKELETON — search loading */}
            {searchLoading ? (
              <SkeletonList />
            ) : (
              searched && (
                <div className="space-y-3">
                  {result.length > 0 ? (
                    result.map((item) => (
                      <Link
                        key={item.id}
                        href={`/pelanggan/history/${item.id}`}
                        className="block bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-base text-slate-800 truncate">
                              {item.resi}
                            </p>
                            <p className="text-sm text-slate-500 mt-1 break-words leading-relaxed">
                              {item.alamat_pengirim} → {item.alamat_penerima}
                            </p>
                          </div>
                          <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                            {item.status}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-10 text-center border border-emerald-100 shadow-sm">
                      <div className="text-5xl mb-3">📦</div>
                      <p className="text-slate-700 font-semibold">
                        Resi tidak ditemukan
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Pastikan nomor resi yang dimasukkan benar
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm animate-pulse"
        >
          <div className="flex justify-between gap-3 mb-3">
            <div className="h-4 w-36 bg-emerald-100 rounded-xl" />
            <div className="h-6 w-20 bg-emerald-100 rounded-full" />
          </div>
          <div className="h-3 w-52 bg-emerald-50 rounded-xl mb-2" />
          <div className="h-3 w-24 bg-emerald-50 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
