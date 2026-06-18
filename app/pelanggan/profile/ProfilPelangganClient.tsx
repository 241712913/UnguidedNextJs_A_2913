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

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((result) => {
        if (result.profile) {
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

      <div className="px-3 py-4 space-y-3 md:px-6 md:space-y-4">

        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-3xl p-5 md:p-6 shadow-lg">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-xl font-bold">
              {profile.nama?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-emerald-100 text-xs font-medium mb-0.5">Profil Pengguna</p>
              <h1 className="text-lg font-bold truncate">{profile.nama || "Pengguna"}</h1>
              <p className="text-xs text-emerald-50/80 mt-0.5">Kelola informasi akun dan keamanan</p>
            </div>
          </div>
        </div>

        {/* TOAST */}
        {showToast && (
          <div className="fixed top-5 left-3 right-3 md:left-auto md:right-6 md:w-auto bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50">
            <CheckCircle size={17} className="shrink-0" />
            <span className="text-sm font-medium">Profil berhasil disimpan</span>
          </div>
        )}

        {/* PROFILE INFO */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <User size={17} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Informasi Pribadi</h2>
              <p className="text-xs text-slate-400">Kelola data akun kamu</p>
            </div>
          </div>

          {profileError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{profileError}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-emerald-50 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">

              {/* NAMA */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 pl-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 bg-emerald-50/60 rounded-2xl px-4 py-3.5">
                  <User size={16} className="text-emerald-500 shrink-0" />
                  <input
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-sm text-slate-700"
                  />
                </div>
              </div>

              {/* EMAIL — read only */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 pl-1">Email</label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3.5">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    value={profile.email}
                    disabled
                    className="w-full min-w-0 bg-transparent border-none outline-none text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 pl-1">Email tidak dapat diubah</p>
              </div>

              {/* NOMOR HP */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 pl-1">Nomor HP</label>
                <div className="flex items-center border border-emerald-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 bg-emerald-50/60">
                  <span className="bg-emerald-100 px-3 py-3.5 text-sm font-semibold text-emerald-700 border-r border-emerald-200 select-none shrink-0">
                    +62
                  </span>
                  <div className="flex items-center gap-2.5 flex-1 px-3 min-w-0">
                    <Phone size={16} className="text-emerald-500 shrink-0" />
                    <input
                      type="tel"
                      value={profile.nomor_hp}
                      onChange={(e) => setProfile({ ...profile, nomor_hp: e.target.value.replace(/\D/g, "") })}
                      placeholder="8xx-xxxx-xxxx"
                      maxLength={13}
                      className="w-full min-w-0 bg-transparent border-none outline-none text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* ALAMAT */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 pl-1">Alamat</label>
                <div className="flex items-start gap-3 bg-emerald-50/60 rounded-2xl px-4 py-3.5">
                  <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <textarea
                    value={profile.alamat}
                    onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
                    placeholder="Alamat lengkap"
                    rows={3}
                    className="w-full min-w-0 bg-transparent border-none outline-none text-sm text-slate-700 resize-none"
                  />
                </div>
              </div>

            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="mt-5 w-full py-3.5 rounded-3xl font-semibold transition bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-md shadow-emerald-200 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Lock size={17} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Keamanan Akun</h2>
              <p className="text-xs text-slate-400">Ubah password akun kamu</p>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password lama"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
            <input
              type="password"
              placeholder="Password baru (min. 6 karakter, huruf + angka)"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="mt-5 w-full py-3.5 rounded-3xl font-semibold transition bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-md shadow-emerald-200 disabled:opacity-60"
          >
            {passwordLoading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 text-red-500 py-3.5 rounded-3xl font-semibold hover:bg-red-50 active:scale-[0.98] transition flex items-center justify-center gap-2 mb-2"
        >
          <LogOut size={17} />
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
}
