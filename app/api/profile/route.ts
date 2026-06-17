import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const role   = req.cookies.get("role")?.value;

    if (!userId || role !== "pelanggan") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT id, nama, email, phone, alamat
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ profile: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const role   = req.cookies.get("role")?.value;

    if (!userId || role !== "pelanggan") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { nama, phone, alamat } = await req.json();

    if (!nama?.trim()) {
      return NextResponse.json({ message: "Nama wajib diisi." }, { status: 400 });
    }

    // Normalisasi phone
    let normalPhone = (phone ?? "").replace(/^\+?0*62/, "").replace(/^0/, "");
    normalPhone = "62" + normalPhone;

    await sql`
      UPDATE users
      SET nama = ${nama.trim()}, phone = ${normalPhone}, alamat = ${alamat ?? ""}
      WHERE id = ${userId}
    `;

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}