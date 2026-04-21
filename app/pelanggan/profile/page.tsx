"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import {
  User,
  Building,
  Phone,
  MapPin,
  Lock,
  Save,
  LogOut,
  CheckCircle,
} from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState({
    nama: "Yemima Saragih",
    email: "usr12345678@mail.com",
    perusahaan: "",
    nomorHp: "081234567890",
    kota: "Jakarta",
    alamat: "",
  });

  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-3 md:p-3 space-y-3">

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Profil Pengguna</p>
          <h1 className="text-2xl font-bold mt-1">
            {profile.nama}
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Kelola informasi akun dan keamanan kamu
          </p>
        </div>

        {showToast && (
          <div className="fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">
              Berhasil disimpan
            </span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold mb-3">
              {profile.nama.charAt(0)}
            </div>

            <h2 className="font-semibold text-lg">
              {profile.nama}
            </h2>

            <p className="text-sm text-gray-500">
              {profile.email}
            </p>

            <div className="mt-4 flex gap-6 text-center">
              <div>
                <p className="font-bold text-lg">7</p>
                <p className="text-xs text-gray-400">Total Paket</p>
              </div>
              <div>
                <p className="font-bold text-lg">3</p>
                <p className="text-xs text-gray-400">Diproses</p>
              </div>
              <div>
                <p className="font-bold text-lg">2</p>
                <p className="text-xs text-gray-400">Selesai</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
          <h3 className="font-semibold">Edit Informasi</h3>

          <input
            value={profile.nama}
            onChange={(e) =>
              setProfile({ ...profile, nama: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <input
            value={profile.email}
            disabled
            className="w-full p-3 rounded-xl border bg-gray-100 text-gray-400"
          />

          <input
            placeholder="Nama Perusahaan"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <input
            placeholder="Nomor HP"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <input
            placeholder="Alamat"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
          >
            Simpan Perubahan
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock size={16} className="text-emerald-600" />
            Ubah Kata Sandi
          </h3>

          <input
            type="password"
            placeholder="Password lama"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <input
            type="password"
            placeholder="Password baru"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <input
            type="password"
            placeholder="Konfirmasi password"
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
          >
            Simpan Password
          </button>
        </div>

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