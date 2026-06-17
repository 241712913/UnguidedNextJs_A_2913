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

      <div className="w-full p-4 space-y-4">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-100">

          <h1 className="text-xl font-bold">
            Lacak Pengiriman
          </h1>

          <p className="text-sm text-emerald-50 mt-1 mb-5">
            Masukkan nomor resi untuk melihat status paket
          </p>

          <div className="flex gap-2">

            <div className="flex items-center bg-white rounded-2xl px-4 py-3 flex-1 shadow-sm border border-transparent">

              <Search
                size={18}
                className="text-emerald-400 mr-2 shrink-0"
              />

              <input
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                placeholder="Masukkan nomor resi..."
                className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-white text-emerald-600 px-5 rounded-2xl font-semibold hover:bg-emerald-50 transition"
            >
              Cari
            </button>

          </div>
        </div>

        {/* GUIDE */}
        <div className="bg-white/90 backdrop-blur rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-5 text-slate-700 font-semibold hover:bg-emerald-50/60 transition"
          >
            Cara menemukan nomor resi

            {showGuide ? (
              <ChevronUp className="text-emerald-600" />
            ) : (
              <ChevronDown className="text-emerald-600" />
            )}
          </button>

          {showGuide && (
            <div className="px-5 pb-5 text-sm text-slate-600 space-y-2">

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p>Cek email konfirmasi</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p>Lihat riwayat pengiriman</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p>Cek struk pengiriman</p>
              </div>

            </div>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm animate-pulse"
              >
                <div className="h-5 w-40 bg-emerald-100 rounded-xl mb-3"></div>

                <div className="h-4 w-56 bg-emerald-50 rounded-xl mb-2"></div>

                <div className="h-3 w-24 bg-emerald-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* SEARCH LOADING */}
            {searchLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm animate-pulse"
                  >
                    <div className="h-5 w-40 bg-emerald-100 rounded-xl mb-3"></div>

                    <div className="h-4 w-56 bg-emerald-50 rounded-xl mb-2"></div>

                    <div className="h-3 w-24 bg-emerald-50 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              searched && (
                <div className="space-y-3">

                  {result.length > 0 ? (
                    result.map((item) => (
                      <Link
                        key={item.id}
                        href={`/pelanggan/history/${item.id}`}
                        className="block bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <p className="font-bold text-lg text-slate-800">
                              {item.resi}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.alamat_pengirim} → {item.alamat_penerima}
                            </p>
                          </div>

                          <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                            {item.status}
                          </div>

                        </div>

                      </Link>
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-10 text-center border border-emerald-100 shadow-sm">

                      <div className="text-5xl mb-3">
                        📦
                      </div>

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