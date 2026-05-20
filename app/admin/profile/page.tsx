"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";

import { Lock, CheckCircle } from "lucide-react";

export default function ProfilAdminPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);

  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((result) => {
        setShipments(result || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // =========================
  // STATUS FIX (PAKAI status_id)
  // =========================

  const totalPengiriman = shipments.length;

  const totalSelesai = shipments.filter(
    (item) => item.status_id === 5
  ).length;

  const totalDiproses = shipments.filter(
    (item) => item.status_id !== 5
  ).length;

  // =========================
  // PASSWORD LOGIC (TIDAK DIUBAH)
  // =========================

  const handleSave = () => {
    if (!password.old || !password.new || !password.confirm) {
      alert("Lengkapi semua field password");
      return;
    }

    if (password.new !== password.confirm) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    setShowToast(true);

    setTimeout(() => setShowToast(false), 2500);

    setPassword({
      old: "",
      new: "",
      confirm: "",
    });
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 md:p-3 space-y-3">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Admin Panel</p>
          <h1 className="text-xl font-bold mt-1">Pengaturan Akun</h1>
          <p className="text-sm opacity-80 mt-1">
            Kelola keamanan akun admin
          </p>
        </div>

        {/* TOAST */}
        {showToast && (
          <div className="fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">
              Password berhasil diperbarui
            </span>
          </div>
        )}

        {/* CARD PROFIL */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

          <div className="flex flex-col items-center text-center">

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
              A
            </div>

            <div className="mt-3">
              <p className="font-semibold text-lg">
                Admin SahabatKargo
              </p>
              <p className="text-sm text-gray-500">
                admin@sahabatkargo.id
              </p>
            </div>

          </div>

          {/* STATISTIK */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-bold text-2xl text-emerald-600">
                {totalPengiriman}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total Pengiriman
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-bold text-2xl text-yellow-500">
                {totalDiproses}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Diproses
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-bold text-2xl text-green-600">
                {totalSelesai}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Selesai
              </p>
            </div>

          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">

          <h3 className="font-semibold flex items-center gap-2">
            <Lock size={16} className="text-emerald-600" />
            Ubah Kata Sandi
          </h3>

          <input
            type="password"
            placeholder="Password lama"
            value={password.old}
            onChange={(e) =>
              setPassword({ ...password, old: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Password baru"
            value={password.new}
            onChange={(e) =>
              setPassword({ ...password, new: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Konfirmasi password"
            value={password.confirm}
            onChange={(e) =>
              setPassword({ ...password, confirm: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
          >
            Simpan Password
          </button>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 text-red-500 py-3 rounded-2xl font-medium hover:bg-red-50 transition"
        >
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
}