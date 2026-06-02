import { NextRequest, NextResponse } from "next/server";
import { USERS } from "@/app/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json({ message: "Password lama wajib diisi." }, { status: 400 });
    }
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ message: "Password baru wajib diisi." }, { status: 400 });
    }
    if (!confirmPassword || typeof confirmPassword !== "string") {
      return NextResponse.json({ message: "Konfirmasi password wajib diisi." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password baru minimal 6 karakter." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Konfirmasi password tidak cocok." }, { status: 400 });
    }

    const userCookie = req.cookies.get("user")?.value;
    if (!userCookie) {
      return NextResponse.json({ message: "Anda harus login terlebih dahulu." }, { status: 401 });
    }

    let userData;
    try {
      userData = JSON.parse(userCookie);
    } catch {
      return NextResponse.json({ message: "Data pengguna tidak valid." }, { status: 400 });
    }

    const user = USERS.find((u) => u.id === userData.id);
    if (!user) {
      return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    if (user.password !== currentPassword) {
      return NextResponse.json({ message: "Password lama salah." }, { status: 401 });
    }

    user.password = newPassword;

    return NextResponse.json({ success: true, message: "Password berhasil diubah." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat mengganti password." },
      { status: 500 }
    );
  }
}
