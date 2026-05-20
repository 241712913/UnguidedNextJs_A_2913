import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const pelangganId = 1; // Yemima Saragih

    const result = await sql`
      SELECT *
      FROM pengiriman
      WHERE pelanggan_id = ${pelangganId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      shipments: result.rows,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Gagal mengambil data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}