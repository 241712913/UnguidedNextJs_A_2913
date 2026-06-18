"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Sidebar from "@/app/admin/ui/sidebar";
import { Lock, CheckCircle, LogOut } from "lucide-react";

export default function ProfilAdminPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");

  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");

      if (raw) {
        const user = JSON.parse(raw);
        setAdminName(user.nama ?? "Admin");
        setAdminEmail(user.email ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((result) => setShipments(result || []))
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPengiriman = shipments.length;

  const totalSelesai = shipments.filter(
    (item) => item.status_id === 5
  ).length;

  const totalDiproses = shipments.filter(
    (item) => item.status_id !== 5
  ).length;

  const handleSave = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!password.old || !password.new || !password.confirm) {
      setPasswordError("Lengkapi semua field password.");
      return;
    }

    if (password.new.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    if (
      !/[a-zA-Z]/.test(password.new) ||
      !/[0-9]/.test(password.new)
    ) {
      setPasswordError("Password harus kombinasi huruf dan angka.");
      return;
    }

    if (password.new !== password.confirm) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: password.old,
          newPassword: password.new,
          confirmPassword: password.confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(
          data.message ?? "Gagal mengganti password."
        );
        return;
      }

      setPasswordSuccess(
        data.message ?? "Password berhasil diperbarui."
      );

      setPassword({
        old: "",
        new: "",
        confirm: "",
      });

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2500);
    } catch {
      setPasswordError("Tidak dapat terhubung ke server.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-3xl p-5 md:p-6 shadow-md">
          <p className="text-sm opacity-90">Admin Panel</p>

          <h1 className="text-lg md:text-xl font-bold mt-1">
            Pengaturan Akun
          </h1>

          <p className="text-sm opacity-80 mt-1">
            Kelola keamanan akun admin
          </p>
        </div>

        {/* TOAST */}
        {showToast && (
          <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle size={18} />

            <span className="text-sm font-medium">
              Password berhasil diperbarui
            </span>
          </div>
        )}

        {/* PROFIL */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            {loading ? (
              <>
                <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse" />

                <div className="mt-3 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {adminName.charAt(0).toUpperCase()}
                </div>

                <div className="mt-3">
                  <p className="font-semibold text-lg">
                    {adminName}
                  </p>

                  <p className="text-sm text-gray-500 break-all">
                    {adminEmail}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* STATISTIK */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl p-3 space-y-2"
                >
                  <div className="h-6 w-10 bg-gray-200 rounded mx-auto animate-pulse" />
                  <div className="h-3 w-16 bg-gray-100 rounded mx-auto animate-pulse" />
                </div>
              ))
            ) : (
              <>
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="font-bold text-xl md:text-2xl text-emerald-600">
                    {totalPengiriman}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Total
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="font-bold text-xl md:text-2xl text-yellow-500">
                    {totalDiproses}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Diproses
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="font-bold text-xl md:text-2xl text-green-600">
                    {totalSelesai}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Selesai
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock size={16} className="text-emerald-600" />
            Ubah Kata Sandi
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {passwordSuccess}
                </div>
              )}

              <input
                type="password"
                placeholder="Password lama"
                value={password.old}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    old: e.target.value,
                  });
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base"
              />

              <input
                type="password"
                placeholder="Password baru (huruf + angka)"
                value={password.new}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    new: e.target.value,
                  });
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base"
              />

              <input
                type="password"
                placeholder="Konfirmasi password baru"
                value={password.confirm}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    confirm: e.target.value,
                  });
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base"
              />

              <button
                onClick={handleSave}
                disabled={passwordLoading}
                className="w-full min-h-[48px] py-3 rounded-xl font-medium transition bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white hover:opacity-90 disabled:opacity-60"
              >
                {passwordLoading
                  ? "Menyimpan..."
                  : "Simpan Password"}
              </button>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full min-h-[48px] bg-white border border-red-200 text-red-500 py-3 rounded-2xl font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}