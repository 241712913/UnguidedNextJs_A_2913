"use client";

import { useEffect, useState } from "react";

import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

import { Search } from "lucide-react";

import ShipmentTable from "./tabel";

export default function ShipmentPage() {

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [open, setOpen] =
    useState(false);

  const [shipments, setShipments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const itemsPerPage = 5;

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const res =
          await fetch("/api/pengiriman");

        const result =
          await res.json();

        console.log(result);

        if (Array.isArray(result)) {

          setShipments(result);

        } else if (
          result.pengiriman
        ) {

          setShipments(
            result.pengiriman
          );

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

  const filteredShipments =
    shipments.filter(
      (item) =>
        item.resi
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.nama_pengirim
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.nama_penerima
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const totalPages =
    Math.ceil(
      filteredShipments.length /
        itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentShipments =
    filteredShipments.slice(
      startIndex,
      endIndex
    );

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

      <div className="p-3 space-y-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 flex items-center justify-between shadow">

          <div>

            <h1 className="text-xl font-bold">
              Daftar Pengiriman
            </h1>

            <p className="text-green-100 mt-1 text-sm">
              {shipments.length} total pengiriman
            </p>

          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/admin/create")
            }
            className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm"
          >
            + Tambah
          </button>

        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari resi, pengirim, penerima..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl px-5 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <select className="border border-gray-200 rounded-xl px-10 py-3">

            <option>
              Tanggal
            </option>

          </select>

          <select className="border border-gray-200 rounded-xl px-10 py-3">

            <option>
              Semua Status
            </option>

            <option>
              Menunggu
            </option>

            <option>
              Dijemput
            </option>

            <option>
              Dalam perjalanan
            </option>

            <option>
              Sedang diantar
            </option>

            <option>
              Terkirim
            </option>

            <option>
              Gagal
            </option>

          </select>

        </div>

        {/* TABLE */}
        {loading ? (

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>

                  <th className="px-6 py-4 text-center">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </th>

                </tr>

              </thead>

              <tbody>

                {[1,2,3,4,5].map((i) => (

                  <tr
                    key={i}
                    className="border-b"
                  >

                    <td className="px-6 py-4">

                      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse"></div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>

                    </td>

                    <td className="px-6 py-4">

                      <div className="h-4 w-12 bg-gray-100 rounded animate-pulse mx-auto"></div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <ShipmentTable
            shipments={currentShipments}
            loading={loading}
          />

        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 p-4">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
            className="px-4 py-2 rounded-lg border disabled:opacity-50 bg-white"
          >
            Prev
          </button>

          <span className="px-4 py-2">

            {currentPage} /{" "}
            {totalPages || 1}

          </span>

          <button
            disabled={
              currentPage ===
                totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
            className="px-4 py-2 rounded-lg border disabled:opacity-50 bg-white"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}