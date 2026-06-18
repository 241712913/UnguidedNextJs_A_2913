"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

// ── Password strength ────────────────────────────────────────────────────────
function getPasswordStrength(password: string) {
  if (password.length === 0) return { label: "", color: "", width: "w-0" };
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isLong = password.length >= 10;
  const score = [hasLetter, hasNumber, hasSpecial, isLong].filter(Boolean).length;
  if (score <= 1) return { label: "Lemah", color: "bg-red-500", width: "w-1/4" };
  if (score === 2) return { label: "Cukup", color: "bg-yellow-500", width: "w-2/4" };
  if (score === 3) return { label: "Kuat", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Sangat Kuat", color: "bg-emerald-500", width: "w-full" };
}

// ── Captcha ──────────────────────────────────────────────────────────────────
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export default function LoginRegisterPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  // ── Login state ──────────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // ── Register state ───────────────────────────────────────────────────────
  const [registerForm, setRegisterForm] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    alamat: "",
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");

  const strength = getPasswordStrength(registerForm.password);

  // ── Switch tab ───────────────────────────────────────────────────────────
  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setLoginError(null);
    setLoginSuccess(null);
    setRegisterErrors({});
    setRegisterSuccess(null);
  };

  // ── Login handler ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    const identifier = loginForm.email.trim();
    if (!identifier) return setLoginError("Email wajib diisi.");
    if (!identifier.includes("@")) return setLoginError("Masukkan email yang valid.");
    if (loginForm.password.length < 6) return setLoginError("Password minimal 6 karakter.");

    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password: loginForm.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message ?? "Terjadi kesalahan pada server.");
        return;
      }

      try {
        sessionStorage.setItem("user", JSON.stringify({
          id: data.id,
          nama: data.nama,
          email: data.email,
          role: data.role,
          phone: data.phone,
        }));
      } catch {}

      setLoginSuccess(data.message ?? "Login berhasil.");
      setTimeout(() => {
        if (data.role === "admin") router.push("/admin/dashboard");
        else router.push("/pelanggan/home");
      }, 700);
    } catch {
      setLoginError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register validation ──────────────────────────────────────────────────
  const validateRegister = () => {
    const err: Record<string, string> = {};
    if (!registerForm.nama.trim()) err.nama = "Nama lengkap wajib diisi.";
    else if (registerForm.nama.trim().length < 3) err.nama = "Nama minimal 3 karakter.";

    if (!registerForm.email.trim()) err.email = "Email wajib diisi.";
    else if (!registerForm.email.includes("@") || !registerForm.email.includes("."))
      err.email = "Format email tidak valid. Contoh: nama@email.com";

    if (!registerForm.password) err.password = "Password wajib diisi.";
    else if (registerForm.password.length < 6) err.password = "Password minimal 6 karakter.";
    else if (!/[a-zA-Z]/.test(registerForm.password) || !/[0-9]/.test(registerForm.password))
      err.password = "Password harus kombinasi huruf dan angka.";

    if (!registerForm.confirmPassword) err.confirmPassword = "Konfirmasi password wajib diisi.";
    else if (registerForm.password !== registerForm.confirmPassword)
      err.confirmPassword = "Password tidak cocok.";

    if (!registerForm.phone) err.phone = "Nomor HP wajib diisi.";
    else if (registerForm.phone.length < 9 || registerForm.phone.length > 13)
      err.phone = "Nomor HP harus 9–13 digit setelah +62.";

    if (!registerForm.alamat.trim()) err.alamat = "Alamat wajib diisi.";
    else if (registerForm.alamat.trim().length < 10) err.alamat = "Alamat minimal 10 karakter.";

    if (!captchaInput) err.captcha = "Jawaban captcha wajib diisi.";
    else if (parseInt(captchaInput) !== captcha.answer) err.captcha = "Jawaban captcha salah.";

    return err;
  };

  // ── Register handler ─────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(null);

    const errs = validateRegister();
    if (Object.keys(errs).length > 0) { setRegisterErrors(errs); return; }

    setRegisterLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: registerForm.nama.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
          phone: "+62" + registerForm.phone,
          alamat: registerForm.alamat.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("Email"))
          setRegisterErrors((p) => ({ ...p, email: data.message }));
        else if (data.message?.includes("Nomor HP"))
          setRegisterErrors((p) => ({ ...p, phone: data.message }));
        else
          setRegisterErrors((p) => ({ ...p, general: data.message }));
        return;
      }

      setRegisterSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => switchTab("login"), 2000);
    } catch {
      setRegisterErrors({ general: "Tidak dapat terhubung ke server." });
    } finally {
      setRegisterLoading(false);
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500 ${
      hasError ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Tombol kembali */}
        <button
          onClick={() => router.push("/")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="SahabatKargo Logo" width={72} height={72} className="object-contain" />
            <h1 className="text-2xl font-extrabold text-slate-900">
              SahabatKargo<span className="text-emerald-600">.id</span>
            </h1>
            <p className="text-sm text-slate-500">
              {tab === "login" ? "Masuk ke akun Anda" : "Daftar akun baru"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                tab === "login"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                tab === "register"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <div className="space-y-4">
              {loginError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              {loginSuccess && (
                <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{loginSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => { setLoginForm((p) => ({ ...p, email: e.target.value })); setLoginError(null); }}
                    placeholder="Masukkan email"
                    className={inputClass(!!loginError)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={(e) => { setLoginForm((p) => ({ ...p, password: e.target.value })); setLoginError(null); }}
                      placeholder="Masukkan password"
                      className={`${inputClass(!!loginError)} pr-11`}
                    />
                    <button type="button" onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loginLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loginLoading ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Memproses…</>
                  ) : (
                    <><LogIn size={17} />Masuk</>
                  )}
                </button>
              </form>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 space-y-1">
                <p className="font-semibold">Akun Demo:</p>
                <p>Admin → admin@ekspedisi.com / admin321</p>
                <p>Pelanggan → natalie@gmail.com / natalie321</p>
              </div>
            </div>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <div className="space-y-4">
              {registerErrors.general && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{registerErrors.general}</span>
                </div>
              )}
              {registerSuccess && (
                <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{registerSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegister} noValidate className="space-y-4">

                {/* Nama */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input type="text" value={registerForm.nama}
                    onChange={(e) => { setRegisterForm((p) => ({ ...p, nama: e.target.value })); setRegisterErrors((p) => ({ ...p, nama: "" })); }}
                    placeholder="Masukkan nama lengkap"
                    className={inputClass(!!registerErrors.nama)} />
                  {registerErrors.nama && <p className="text-xs text-red-500">{registerErrors.nama}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={registerForm.email}
                    onChange={(e) => { setRegisterForm((p) => ({ ...p, email: e.target.value })); setRegisterErrors((p) => ({ ...p, email: "" })); }}
                    placeholder="contoh@email.com"
                    className={inputClass(!!registerErrors.email)} />
                  {registerErrors.email && <p className="text-xs text-red-500">{registerErrors.email}</p>}
                </div>

                {/* Nomor HP */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Nomor HP</label>
                  <div className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 ${registerErrors.phone ? "border-red-400" : "border-slate-300"}`}>
                    <span className="bg-emerald-50 border-r border-slate-300 px-3 flex items-center text-sm font-medium text-slate-600 select-none">+62</span>
                    <input type="text" inputMode="numeric" value={registerForm.phone} maxLength={13}
                      onChange={(e) => { setRegisterForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") })); setRegisterErrors((p) => ({ ...p, phone: "" })); }}
                      placeholder="8xxxxxxxxxx (9–13 digit)"
                      className={`flex-1 px-4 py-3 text-sm text-slate-900 outline-none ${registerErrors.phone ? "bg-red-50" : "bg-white"}`} />
                  </div>
                  {registerErrors.phone && <p className="text-xs text-red-500">{registerErrors.phone}</p>}
                </div>

                {/* Alamat */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Alamat</label>
                  <textarea value={registerForm.alamat} rows={3}
                    onChange={(e) => { setRegisterForm((p) => ({ ...p, alamat: e.target.value })); setRegisterErrors((p) => ({ ...p, alamat: "" })); }}
                    placeholder="Masukkan alamat lengkap"
                    className={inputClass(!!registerErrors.alamat)} />
                  {registerErrors.alamat && <p className="text-xs text-red-500">{registerErrors.alamat}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input type={showRegPassword ? "text" : "password"} value={registerForm.password}
                      onChange={(e) => { setRegisterForm((p) => ({ ...p, password: e.target.value })); setRegisterErrors((p) => ({ ...p, password: "" })); }}
                      placeholder="Min. 6 karakter, huruf + angka"
                      className={`${inputClass(!!registerErrors.password)} pr-11`} />
                    <button type="button" onClick={() => setShowRegPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerForm.password.length > 0 && (
                    <div className="space-y-1 mt-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs font-medium ${
                        strength.label === "Lemah" ? "text-red-500" :
                        strength.label === "Cukup" ? "text-yellow-500" :
                        strength.label === "Kuat" ? "text-blue-500" : "text-emerald-500"
                      }`}>Kekuatan password: {strength.label}</p>
                    </div>
                  )}
                  {registerErrors.password && <p className="text-xs text-red-500">{registerErrors.password}</p>}
                </div>

                {/* Konfirmasi Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} value={registerForm.confirmPassword}
                      onChange={(e) => { setRegisterForm((p) => ({ ...p, confirmPassword: e.target.value })); setRegisterErrors((p) => ({ ...p, confirmPassword: "" })); }}
                      placeholder="Ulangi password"
                      className={`${inputClass(!!registerErrors.confirmPassword)} pr-11`} />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerForm.confirmPassword.length > 0 && registerForm.password === registerForm.confirmPassword && (
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Password cocok
                    </p>
                  )}
                  {registerErrors.confirmPassword && <p className="text-xs text-red-500">{registerErrors.confirmPassword}</p>}
                </div>

                {/* Captcha */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Verifikasi</label>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 rounded-xl px-5 py-3 font-bold text-slate-700 text-sm select-none tracking-widest">
                      {captcha.a} + {captcha.b} = ?
                    </div>
                    <input type="text" inputMode="numeric" value={captchaInput} maxLength={3}
                      onChange={(e) => { setCaptchaInput(e.target.value.replace(/\D/g, "")); setRegisterErrors((p) => ({ ...p, captcha: "" })); }}
                      placeholder="Jawaban"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 ${registerErrors.captcha ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"}`} />
                    <button type="button" onClick={() => { setCaptcha(generateCaptcha()); setCaptchaInput(""); }}
                      className="text-xs text-emerald-600 hover:underline whitespace-nowrap">
                      Ganti
                    </button>
                  </div>
                  {registerErrors.captcha && <p className="text-xs text-red-500">{registerErrors.captcha}</p>}
                </div>

                <button type="submit" disabled={registerLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed">
                  {registerLoading ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Memproses…</>
                  ) : (
                    <><UserPlus size={17} />Daftar Sekarang</>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 SahabatKargo.id — Semua hak dilindungi
        </p>
      </div>
    </main>
  );
}
