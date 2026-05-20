import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    // sementara ambil pelanggan pertama
    // nanti bisa pakai session/login

    const result = await db.sql`
      SELECT *
      FROM pelanggan
      LIMIT 1
    `;

    return NextResponse.json({
      profile: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data profile",
      },
      {
        status: 500,
      }
    );
  }
}