import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { nama, email, password, phone, alamat } = await req.json();

    if (!nama || !email || !password || !phone || !alamat) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Normalisasi phone — hapus +, 62, atau 0 di depan lalu tambah 62
    let normalPhone = phone.replace(/^\+?0*62/, "").replace(/^0/, "");
    normalPhone = "62" + normalPhone;

    const phoneDigits = normalPhone.replace("62", "");
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      return NextResponse.json(
        { message: "Nomor HP tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter, harus kombinasi huruf dan angka." },
        { status: 400 }
      );
    }

    const existingEmail = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existingEmail.rows.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const existingPhone = await sql`
      SELECT id FROM users WHERE phone = ${normalPhone} LIMIT 1
    `;
    if (existingPhone.rows.length > 0) {
      return NextResponse.json(
        { message: "Nomor HP sudah terdaftar." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (nama, email, password, phone, alamat, role)
      VALUES (${nama}, ${email}, ${hashedPassword}, ${normalPhone}, ${alamat}, 'pelanggan')
    `;

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil! Silakan login." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}