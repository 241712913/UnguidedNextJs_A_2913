import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {

    // sementara hardcode pelanggan_id = 1
    const result = await sql`
      SELECT *
      FROM pengiriman
      WHERE pelanggan_id = 1
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      shipments: result.rows,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: "Gagal mengambil data",
      },
      {
        status: 500,
      }
    );
  }
}