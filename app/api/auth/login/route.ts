import { NextRequest, NextResponse } from "next/server";

// ─── Data akun statis (ganti dengan query DB sesungguhnya) ────────────────────
// Di produksi: SELECT * FROM users WHERE username = $1 lalu bandingkan hash bcrypt
const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", nama: "Administrator" },
  { id: 2, username: "pelanggan", password: "pelanggan123", role: "pelanggan", nama: "Pelanggan" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // ── Validasi input ──────────────────────────────────────────────────
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { message: "Username tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Password tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (username.trim().length < 3) {
      return NextResponse.json(
        { message: "Username minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    // ── Cari user ───────────────────────────────────────────────────────
    const user = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Username atau password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    // ── Sukses: kembalikan info user (tanpa password) ───────────────────
    return NextResponse.json(
      {
        success: true,
        role: user.role,
        nama: user.nama,
        message: `Selamat datang, ${user.nama}!`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
