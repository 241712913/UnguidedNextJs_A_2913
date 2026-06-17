import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;

  const user = result.rows[0];

  if (!user) {
    return NextResponse.json(
      { message: "Email tidak ditemukan" },
      { status: 401 }
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return NextResponse.json(
      { message: "Password salah" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({
    success: true,
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    phone: user.phone,
    message: `Selamat datang, ${user.nama}!`,
  });

  const cookieOptions = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 jam
  };

  res.cookies.set("userId", String(user.id), cookieOptions);
  res.cookies.set("role", user.role, cookieOptions);

  return res;
}