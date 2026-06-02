"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // ── Validasi form sisi klien ─────────────────────────────────────────
    // Harus mengisi email dan password
    const identifier = email.trim();
    if (!identifier) {
      setError("Email wajib diisi.");
      return;
    }
    if (identifier.length < 3 || !identifier.includes("@")) {
      setError("Masukkan email yang valid.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Terjadi kesalahan pada server.");
        return;
      }

      // Simpan info sederhana di sessionStorage untuk proteksi route klien
      try {
        sessionStorage.setItem("user", JSON.stringify({ role: data.role, nama: data.nama }));
      } catch {}

      // Tampilkan notifikasi sukses lalu redirect singkat
      setSuccess(data.message ?? "Login berhasil.");
      setTimeout(() => {
        if (data.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/pelanggan/home");
        }
      }, 700);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt="SahabatKargo Logo"
              width={72}
              height={72}
              className="object-contain"
            />
            <h1 className="text-2xl font-extrabold text-slate-900">
              SahabatKargo<span className="text-emerald-600">.id</span>
            </h1>
            <p className="text-sm text-slate-500">Masuk ke Panel Admin</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-4">

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="Masukkan email"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500 ${
                  error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                }`}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Masukkan password"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500 ${
                    error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Memproses…
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 space-y-1">
            <p className="font-semibold">Akun Demo:</p>
            <p>Admin → admin@ekspedisi.com / admin123</p>
            <p>Pelanggan → pelanggan@ekspedisi.com / pelanggan123</p>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 SahabatKargo.id — Semua hak dilindungi
        </p>
      </div>
    </main>
  );
}
