"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

export default function DetailPage() {

  const params = useParams();

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [data, setData] =
    useState<any>(null);

  const statusMap: any = {
    1: "Menunggu",
    2: "Dijemput",
    3: "Dalam perjalanan",
    4: "Sedang diantar",
    5: "Terkirim",
    6: "Gagal",
  };

  useEffect(() => {

    fetch(
      `/api/pengiriman/${params.id}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });

  }, [params.id]);

if (!data) {

  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />

      <Navbar
        onMenuClick={() =>
          setOpen(true)
        }
      />

      <div className="p-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-3xl p-6 shadow-lg animate-pulse">

          <div className="h-8 w-60 bg-white/30 rounded-xl"></div>

          <div className="h-4 w-32 bg-white/20 rounded mt-3"></div>

        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl shadow mt-4 p-6 animate-pulse">

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

              <div className="h-6 w-40 bg-gray-100 rounded"></div>

            </div>

            <div>

              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

              <div className="h-6 w-40 bg-gray-100 rounded"></div>

            </div>

            <div>

              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>

              <div className="h-8 w-28 bg-green-100 rounded-full"></div>

            </div>

            <div>

              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>

              <div className="h-6 w-32 bg-gray-100 rounded"></div>

            </div>

          </div>

          {/* ALAMAT */}
          <div className="mt-8">

            <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>

            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>

            <div className="h-4 w-4/5 bg-gray-100 rounded"></div>

          </div>

          {/* ALAMAT */}
          <div className="mt-8">

            <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>

            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>

            <div className="h-4 w-3/5 bg-gray-100 rounded"></div>

          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-8">

            <div className="h-11 w-28 bg-gray-200 rounded-2xl"></div>

          </div>

        </div>

      </div>

    </div>
  );
}

  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />

      <Navbar
        onMenuClick={() =>
          setOpen(true)
        }
      />

      <div className="p-3">

        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-3xl p-6 shadow-lg">

          <h1 className="text-2xl font-bold">
            Detail Pengiriman
          </h1>

          <p className="text-green-100 mt-2">
            {data.resi}
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow mt-4 p-6 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <p className="text-sm text-gray-400">
                Pengirim
              </p>

              <h2 className="font-semibold text-lg">
                {data.nama_pengirim}
              </h2>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Penerima
              </p>

              <h2 className="font-semibold text-lg">
                {data.nama_penerima}
              </h2>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Status
              </p>

              <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                {
                  statusMap[
                    data.status_id
                  ]
                }
              </div>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Ongkir
              </p>

              <h2 className="font-semibold text-lg">
                Rp{" "}
                {Number(
                  data.ongkir
                ).toLocaleString(
                  "id-ID"
                )}
              </h2>

            </div>

          </div>

          <div>

            <p className="text-sm text-gray-400">
              Alamat Pengirim
            </p>

            <p className="mt-2">
              {data.alamat_pengirim}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-400">
              Alamat Penerima
            </p>

            <p className="mt-2">
              {data.alamat_penerima}
            </p>

          </div>

          <div className="flex gap-3 pt-4">

            <button
              onClick={() =>
                router.back()
              }
              className="bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-2xl"
            >
              Kembali
            </button>

            <button
              onClick={() =>
                router.push(
                  `/admin/shipment/${params.id}/edit`
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl"
            >
              Edit
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}