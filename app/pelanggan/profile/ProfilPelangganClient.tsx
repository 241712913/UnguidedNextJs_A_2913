"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/pelanggan/ui/sidebar";
import {
  Lock, CheckCircle, User, Mail, Phone, MapPin, LogOut, AlertCircle,
} from "lucide-react";

export default function ProfilPelangganClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    nama: "", email: "", nomor_hp: "", alamat: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch profile
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((result) => {
        if (result.profile) {
          // Strip +62 atau 62 dari phone untuk ditampilkan
          let phone = result.profile.phone ?? "";
          phone = phone.replace(/^\+?0*62/, "").replace(/^0/, "");
          setProfile({
            nama:     result.profile.nama   ?? "",
            email:    result.profile.email  ?? "",
            nomor_hp: phone,
            alamat:   result.profile.alamat ?? "",
          });
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  // Simpan profil
  const handleSave = async () => {
    setProfileError(null);

    if (!profile.nama.trim()) {
      setProfileError("Nama wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama:   profile.nama,
          phone:  profile.nomor_hp,
          alamat: profile.alamat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || "Gagal menyimpan.");
        return;
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch {
      setProfileError("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  // Ganti password
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
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordError("Password harus kombinasi huruf dan angka.");
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
      setPasswordError("Tidak dapat terhubung ke server.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="p-4 space-y-4">

        {/* HERO */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold">
              {profile.nama?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-medium mb-1">Profil Pengguna</p>
              <h1 className="text-xl font-bold">{profile.nama || "Pengguna"}</h1>
              <p className="text-sm text-emerald-50/80 mt-1">Kelola informasi akun dan keamanan</p>
            </div>
          </div>
        </div>

        {/* TOAST */}
        {showToast && (
          <div className="fixed top-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">Profil berhasil disimpan</span>
          </div>
        )}

        {/* PROFILE INFO */}
        <div className="bg-white rounded-[32px] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <User size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Informasi Pribadi</h2>
              <p className="text-sm text-slate-400">Kelola data akun kamu</p>
            </div>
          </div>

          {profileError && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              <AlertCircle size={16} />
              {profileError}
            </div>
          )}

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-emerald-50 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">

              {/* NAMA */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Nama Lengkap</label>
                <div className="flex items-center gap-3 bg-emerald-50/60 rounded-2xl px-4 py-4">
                  <User size={18} className="text-emerald-500 flex-shrink-0" />
                  <input
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-700"
                  />
                </div>
              </div>

              {/* EMAIL — read only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Email</label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-4">
                  <Mail size={18} className="text-slate-400 flex-shrink-0" />
                  <input
                    value={profile.email}
                    disabled
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 pl-1">Email tidak dapat diubah</p>
              </div>

              {/* NOMOR HP */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Nomor HP</label>
                <div className={`flex items-center border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 bg-emerald-50/60`}>
                  <span className="bg-emerald-100 px-4 py-4 text-sm font-semibold text-emerald-700 border-r border-emerald-200 select-none">
                    +62
                  </span>
                  <div className="flex items-center gap-3 flex-1 px-4">
                    <Phone size={18} className="text-emerald-500 flex-shrink-0" />
                    <input
                      type="tel"
                      value={profile.nomor_hp}
                      onChange={(e) => setProfile({ ...profile, nomor_hp: e.target.value.replace(/\D/g, "") })}
                      placeholder="8xx-xxxx-xxxx"
                      maxLength={13}
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* ALAMAT */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Alamat</label>
                <div className="flex items-start gap-3 bg-emerald-50/60 rounded-2xl px-4 py-4">
                  <MapPin size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <textarea
                    value={profile.alamat}
                    onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
                    placeholder="Alamat lengkap"
                    rows={3}
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-700 resize-none"
                  />
                </div>
              </div>

            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="mt-6 w-full py-4 rounded-3xl font-semibold transition bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200 hover:opacity-95 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-[32px] border border-emerald-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Lock size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Keamanan Akun</h2>
              <p className="text-sm text-slate-400">Ubah password akun kamu</p>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">
              <CheckCircle size={16} />
              {passwordSuccess}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password lama"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-4 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
            <input
              type="password"
              placeholder="Password baru (min. 6 karakter, huruf + angka)"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-4 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-4 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="mt-5 w-full py-4 rounded-3xl font-semibold transition bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200 hover:opacity-95 disabled:opacity-60"
          >
            {passwordLoading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 text-red-500 py-4 rounded-3xl font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
}