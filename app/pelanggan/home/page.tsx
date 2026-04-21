"use client";

import { useState } from "react";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import {
  Clock,
  Truck,
  Package,
  CheckCircle,
} from "lucide-react";
import { shipments } from "@/app/data/shipment";
import { useRouter } from "next/navigation";
import Router from "next/router";

type StatusType = "Menunggu" | "Transit" | "Diantar" | "Selesai";

interface Shipment {
  id: string;
  resi: string;
  date: string;
  from: string;
  to: string;
  courier?: string;
  status: StatusType;
}

const STATUS: Record<
  StatusType,
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
  Diantar: {
    color: "bg-purple-100 text-purple-700",
    icon: <Package size={14} />,
  },
  Selesai: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 md:p-3 space-y-3">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Selamat datang 👋</p>
          <h1 className="text-xl font-bold mt-1">
            Yemima Saragih
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Kamu punya {shipments.length} pengiriman aktif hari ini
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Menunggu",
              value: 1,
              icon: <Clock size={18} />,
              color: "from-yellow-100 to-yellow-50 text-yellow-700",
            },
            {
              label: "Transit",
              value: 1,
              icon: <Truck size={18} />,
              color: "from-blue-100 to-blue-50 text-blue-700",
            },
            {
              label: "Diantar",
              value: 0,
              icon: <Package size={18} />,
              color: "from-purple-100 to-purple-50 text-purple-700",
            },
            {
              label: "Selesai",
              value: 1,
              icon: <CheckCircle size={18} />,
              color: "from-green-100 to-green-50 text-green-700",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} shadow-sm`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>

                <div className="bg-white/70 p-2 rounded-xl shadow">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

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
            SK-9PLM67BVCK
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Jakarta → Bandung
          </p>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 w-2/3 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-3">
          {shipments.map((item) => (
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
                    {item.date}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS[item.status].color
                  }`}
                >
                  {STATUS[item.status].icon}
                  {item.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <span>{item.from}</span>
                →
                <span>{item.to}</span>
              </div>

              {item.courier && (
                <p className="text-xs text-gray-400 mt-1">
                  Kurir: {item.courier}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-emerald-700">
              Butuh Bantuan?
            </h3>
            <p className="text-sm text-emerald-600 mt-1">
              Tim kami siap membantu pengiriman kamu kapan saja
            </p>
          </div>

          <button
            onClick={() => router.push("/pelanggan/hubungi")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition w-full md:w-auto"
          >
            Hubungi Kami
          </button>
        </div>

      </div>
    </div>
  );
}