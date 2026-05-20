"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";

import {
  Clock,
  Truck,
  Package,
  CheckCircle,
} from "lucide-react";

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
};

export default function HomePage() {
  const [open, setOpen] = useState(false);

  const [shipments, setShipments] = useState<
    Shipment[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();
  
  const STATUS_MAP: Record<number, StatusType> = {
    1: "Menunggu",
    2: "Transit",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
  };

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
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const menunggu = shipments.filter(
    (s) => s.status === "Menunggu"
  ).length;

  const transit = shipments.filter(
    (s) =>
      s.status === "Transit" ||
      s.status === "Dalam perjalanan"
  ).length;

  const diantar = shipments.filter(
    (s) => s.status === "Diantar"
  ).length;

  const selesai = shipments.filter(
    (s) =>
      s.status === "Selesai" ||
      s.status === "Terkirim"
  ).length;

  const pengirimanAktif =
    shipments.find(
      (s) =>
        s.status === "Transit" ||
        s.status === "Dalam perjalanan"
    ) || shipments[0];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Navbar
        onMenuClick={() => setOpen(true)}
      />

      <div className="p-3 md:p-3 space-y-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">
            Selamat datang 👋
          </p>

          <h1 className="text-xl font-bold mt-1">
            Yemima Saragih
          </h1>

          <p className="text-sm opacity-80 mt-1">
            Kamu punya{" "}
            {shipments.length} pengiriman
            aktif hari ini
          </p>
        </div>

        {/* STATUS CARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-700 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  Menunggu
                </p>

                <p className="text-2xl font-bold">
                  {menunggu}
                </p>
              </div>

              <div className="bg-white/70 p-2 rounded-xl shadow">
                <Clock size={18} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  Transit
                </p>

                <p className="text-2xl font-bold">
                  {transit}
                </p>
              </div>

              <div className="bg-white/70 p-2 rounded-xl shadow">
                <Truck size={18} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  Diantar
                </p>

                <p className="text-2xl font-bold">
                  {diantar}
                </p>
              </div>

              <div className="bg-white/70 p-2 rounded-xl shadow">
                <Package size={18} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 text-green-700 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  Selesai
                </p>

                <p className="text-2xl font-bold">
                  {selesai}
                </p>
              </div>

              <div className="bg-white/70 p-2 rounded-xl shadow">
                <CheckCircle size={18} />
              </div>
            </div>
          </div>

        </div>

        {/* PENGIRIMAN AKTIF */}
        {pengirimanAktif && (
          <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">
                🚚 Sedang dalam perjalanan
              </p>

              <span className="text-xs text-emerald-500 font-medium">
                Estimasi 1 hari lagi
              </span>
            </div>

            <h2 className="font-bold text-lg mb-1">
              {pengirimanAktif.resi}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {
                pengirimanAktif.alamat_pengirim
              }{" "}
              →{" "}
              {
                pengirimanAktif.alamat_penerima
              }
            </p>

            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 w-2/3 rounded-full"></div>
            </div>
          </div>
        )}

        {/* LIST PENGIRIMAN */}
        <div className="space-y-3">

          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl border animate-pulse"
                >
                  <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>

                  <div className="h-4 w-24 bg-gray-100 rounded mb-4"></div>

                  <div className="h-4 w-52 bg-gray-100 rounded"></div>
                </div>
              ))}
            </>
          ) : (
            shipments.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border hover:shadow-lg hover:-translate-y-[2px] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {item.resi}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS[item.status]
                        ?.color
                    }`}
                  >
                    {
                      STATUS[item.status]
                        ?.icon
                    }

                    {item.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                  <span>
                    {
                      item.alamat_pengirim
                    }
                  </span>

                  →

                  <span>
                    {
                      item.alamat_penerima
                    }
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* BANTUAN */}
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-emerald-700">
              Butuh Bantuan?
            </h3>

            <p className="text-sm text-emerald-600 mt-1">
              Tim kami siap membantu
              pengiriman kamu kapan
              saja
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/pelanggan/hubungi"
              )
            }
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition w-full md:w-auto"
          >
            Hubungi Kami
          </button>
        </div>

      </div>
    </div>
  );
}