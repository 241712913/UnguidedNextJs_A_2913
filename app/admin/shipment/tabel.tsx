"use client";

import Link from "next/link";

type Shipment = {
  id: number;
  resi: string;
  nama_pengirim: string;
  nama_penerima: string;
  alamat_pengirim: string;
  alamat_penerima: string;
  no_hp_pengirim: string;
  no_hp_penerima: string;
  berat: number;
  status_id: number;
  created_at: string;
};

const STATUS_MAP: Record<number, string> = {
  1: "Menunggu",
  2: "Dijemput",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
  6: "Gagal",
};

const STATUS_STYLE: Record<number, { badge: string; dot: string }> = {
  1: {
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  2: {
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  3: {
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  4: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },
  5: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  6: {
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
  },
};

export default function ShipmentTable({
  shipments,
  loading,
}: {
  shipments: Shipment[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Resi
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Pengirim
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Penerima
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Tanggal
              </th>

              <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b animate-pulse"
                >
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-gray-100 rounded-full" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-100 rounded mx-auto" />
                  </td>
                </tr>
              ))
            ) : shipments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-400"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              shipments.map((item) => {
                const style =
                  STATUS_STYLE[item.status_id] ??
                  STATUS_STYLE[1];

                return (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-emerald-600 whitespace-nowrap">
                        {item.resi}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nama_pengirim}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nama_penerima}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium ${style.badge}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${style.dot}`}
                        />

                        {STATUS_MAP[item.status_id] ?? "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString("id-ID")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Link
                          href={`/admin/shipment/${item.id}`}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition"
                        >
                          Detail
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden text-center text-xs text-gray-400 py-3 border-t">
        Geser tabel ke samping untuk melihat semua data
      </div>
    </div>
  );
}