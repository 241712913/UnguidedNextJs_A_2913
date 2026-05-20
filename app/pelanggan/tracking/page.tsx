"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";

import {
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Shipment = {
  id: number;
  resi: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  status: string;
};

export default function TrackingPage() {

  const [open, setOpen] =
    useState(false);

  const [showGuide, setShowGuide] =
    useState(false);

  const [resi, setResi] =
    useState("");

  const [shipments, setShipments] =
    useState<Shipment[]>([]);

  const [result, setResult] =
    useState<Shipment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searched, setSearched] =
    useState(false);

  useEffect(() => {

    async function fetchData() {

      try {

        const res =
          await fetch("/api/home");

        const data =
          await res.json();

        setShipments(
          data.shipments || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    fetchData();

  }, []);

  const handleSearch = () => {

    setSearched(true);

    const found =
      shipments.filter((item) =>
        item.resi
          ?.toLowerCase()
          .includes(
            resi.toLowerCase()
          )
      );

    setResult(found);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      <div className="p-3 space-y-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl p-6">

          <h1 className="text-xl font-bold">
            Lacak Pengiriman
          </h1>

          <p className="text-sm opacity-90 mb-4">
            Masukkan nomor resi
            untuk melihat status paket
          </p>

          <div className="flex gap-2">

            <div className="flex items-center bg-white rounded-xl px-3 py-2 flex-1">

              <Search
                size={18}
                className="text-gray-400 mr-2"
              />

              <input
                value={resi}
                onChange={(e) =>
                  setResi(
                    e.target.value
                  )
                }
                placeholder="Masukkan nomor resi..."
                className="w-full outline-none text-black"
              />

            </div>

            <button
              onClick={handleSearch}
              className="bg-white text-emerald-600 px-5 rounded-xl font-semibold"
            >

              Cari

            </button>

          </div>

        </div>

        {/* GUIDE */}
        <div className="bg-white rounded-2xl shadow">

          <button
            onClick={() =>
              setShowGuide(
                !showGuide
              )
            }
            className="w-full flex justify-between p-4"
          >

            Cara menemukan nomor resi

            {showGuide ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}

          </button>

          {showGuide && (

            <div className="px-4 pb-4 text-sm text-gray-600">

              <p>
                • Cek email konfirmasi
              </p>

              <p>
                • Lihat riwayat pengiriman
              </p>

              <p>
                • Cek struk pengiriman
              </p>

            </div>

          )}

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="space-y-3">

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow animate-pulse"
              >

                <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>

                <div className="h-4 w-56 bg-gray-100 rounded mb-2"></div>

                <div className="h-3 w-24 bg-gray-100 rounded"></div>

              </div>
            ))}

          </div>

        ) : searched ? (

          <div className="space-y-3">

            {result.length > 0 ? (

              result.map((item) => (

                <Link
                  key={item.id}
                  href={`/pelanggan/history/${item.id}`}
                  className="block bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >

                  <p className="font-bold text-lg">
                    {item.resi}
                  </p>

                  <p className="text-sm text-gray-500">

                    {
                      item.alamat_pengirim
                    }

                    {" → "}

                    {
                      item.alamat_penerima
                    }

                  </p>

                  <p className="text-xs text-gray-400 mt-1">

                    Status:
                    {" "}
                    {item.status}

                  </p>

                </Link>

              ))

            ) : (

              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow">

                Resi tidak ditemukan

              </div>

            )}

          </div>

        ) : null}

      </div>

    </div>
  );
}