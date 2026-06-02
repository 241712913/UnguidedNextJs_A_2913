import { NextRequest, NextResponse } from "next/server";
import { USERS } from "@/app/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // ── Validasi input ──────────────────────────────────────────────────
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email tidak boleh kosong." },
        { status: 400 }
      );
    }
    if (!email.includes("@") || email.trim().length < 3) {
      return NextResponse.json(
        { message: "Masukkan email yang valid." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Password tidak boleh kosong." },
        { status: 400 }
      );
    }

    

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    // ── Cari user berdasarkan email ─────────────────
    const identifier = email.trim();
    const user = USERS.find(
      (u) => u.email === identifier && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Username atau password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    // ── Sukses: kembalikan info user (tanpa password) dan set cookie ───
    const res = NextResponse.json(
      {
        success: true,
        role: user.role,
        nama: user.nama,
        message: `Selamat datang, ${user.nama}!`,
      },
      { status: 200 }
    );

    // Set cookie role (readable by middleware) and user (httpOnly)
    res.cookies.set("role", user.role, { path: "/", maxAge: 60 * 60, sameSite: "lax" });
    res.cookies.set("user", JSON.stringify({ id: user.id, nama: user.nama }), { path: "/", httpOnly: true, maxAge: 60 * 60, sameSite: "lax" });
    return res;
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
