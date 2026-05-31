"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";

import {
  Search,
  Clock,
  Truck,
  Package,
  CheckCircle,
} from "lucide-react";

type Shipment = {
  id: number;
  resi: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  status: string;
  created_at: string;
};

const STATUS: Record<
  string,
  { color: string; icon: JSX.Element }
> = {
  Menunggu: {
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={14} />,
  },
  Transit: {
    color: "bg-blue-100 text-blue-700",
    icon: <Truck size={14} />,
  },
  "Dalam perjalanan": {
    color: "bg-blue-100 text-blue-700",
    icon: <Truck size={14} />,
  },
  Diantar: {
    color: "bg-purple-100 text-purple-700",
    icon: <Package size={14} />,
  },
  Selesai: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  Terkirim: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  Gagal: {
    color: "bg-red-100 text-red-700",
    icon: <Package size={14} />,
  },
};

export default function RiwayatPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 INI PENTING: mapping status_id -> string
  const STATUS_MAP: Record<number, string> = {
    1: "Menunggu",
    2: "Transit",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/home");
        const result = await res.json();

        console.log("API RESULT:", result);

        setShipments(
          (result.shipments || []).map((item: any) => ({
            ...item,
            status:
              STATUS_MAP[item.status_id] || "Menunggu",
          }))
        );
      } catch (error) {
        console.log("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered = shipments.filter((item) =>
    item.resi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 md:p-3 space-y-3 mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <h1 className="text-xl font-bold">Riwayat Pengiriman</h1>
          <p className="text-sm opacity-90 mt-1">
            Semua aktivitas pengiriman kamu
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center bg-white px-4 py-3 rounded-2xl flex-1 shadow-sm border border-gray-200">
            <Search size={18} className="text-gray-400 mr-2" />

            <input
              placeholder="Cari nomor resi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium transition">
            Cari
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border animate-pulse"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-28 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>

                  <div className="h-4 w-56 bg-gray-100 rounded"></div>
                </div>
              ))}
            </>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/pelanggan/history/${item.id}`}
                className="block bg-white p-5 rounded-2xl border hover:shadow-lg hover:-translate-y-[2px] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">
                      {item.resi}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS[item.status]?.color ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS[item.status]?.icon}
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  {item.alamat_pengirim} →{" "}
                  {item.alamat_penerima}
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow">
              Tidak ada riwayat pengiriman
            </div>
          )}
        </div>
      </div>
    </div>
  );
}