"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import { Lock, CheckCircle } from "lucide-react";

export default function ProfilPelangganClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [profile, setProfile] = useState({ nama: "", email: "", perusahaan: "", nomor_hp: "", kota: "", alamat: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((result) => {
        if (result.profile) {
          setProfile({
            nama: result.profile.nama || "", email: result.profile.email || "",
            perusahaan: result.profile.perusahaan || "", nomor_hp: result.profile.nomor_hp || "",
            kota: result.profile.kota || "", alamat: result.profile.alamat || "",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field password wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message ?? "Gagal mengganti password.");
        return;
      }

      setPasswordSuccess(data.message ?? "Password berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => { router.push("/"); };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />
      <div className="p-3 md:p-3 space-y-3">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <p className="text-sm opacity-90">Profil Pengguna</p>
          <h1 className="text-xl font-bold mt-1">Yemima Saragih</h1>
          <p className="text-sm opacity-80 mt-1">Kelola informasi akun dan keamanan kamu</p>
        </div>
        {showToast && (
          <div className="fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle size={18} /><span className="text-sm font-medium">Berhasil disimpan</span>
          </div>
        )}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex flex-col items-center text-center animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-60 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold mb-3">{profile.nama?.charAt(0)}</div>
              <h2 className="font-semibold text-lg">{profile.nama}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
          <h3 className="font-semibold">Edit Informasi</h3>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>)}
            </div>
          ) : (
            <>
              <input value={profile.nama} onChange={(e) => setProfile({ ...profile, nama: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200" />
              <input value={profile.email} disabled className="w-full p-3 rounded-xl border bg-gray-100 text-gray-400" />
            </>
          )}
          <button onClick={handleSave} disabled={loading} className={`w-full py-3 rounded-xl font-medium transition ${loading ? "bg-emerald-300" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}>Simpan Perubahan</button>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><Lock size={16} className="text-emerald-600" />Ubah Kata Sandi</h3>
          {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {passwordSuccess}
            </div>
          )}
          <input
            type="password"
            placeholder="Password lama"
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
            className="w-full p-3 rounded-xl border border-gray-200"
          />
          <input
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
            className="w-full p-3 rounded-xl border border-gray-200"
          />
          <input
            type="password"
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
            className="w-full p-3 rounded-xl border border-gray-200"
          />
          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className={`w-full py-3 rounded-xl font-medium transition ${passwordLoading ? "bg-emerald-300 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
          >
            {passwordLoading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
        <button onClick={handleLogout} className="w-full bg-white border border-red-200 text-red-500 py-3 rounded-2xl font-medium hover:bg-red-50 transition">Keluar dari Akun</button>
      </div>
    </div>
  );
}
