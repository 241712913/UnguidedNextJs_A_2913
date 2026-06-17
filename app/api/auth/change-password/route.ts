import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const role   = req.cookies.get("role")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Anda harus login terlebih dahulu." }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "Semua field password wajib diisi." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password baru minimal 6 karakter." }, { status: 400 });
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ message: "Password harus kombinasi huruf dan angka." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Konfirmasi password tidak cocok." }, { status: 400 });
    }

    // Ambil password lama dari DB
    const result = await sql`
      SELECT password FROM users WHERE id = ${userId} LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return NextResponse.json({ message: "Password lama salah." }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}
    `;

    return NextResponse.json({ success: true, message: "Password berhasil diubah." });
  } catch {
    return NextResponse.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}