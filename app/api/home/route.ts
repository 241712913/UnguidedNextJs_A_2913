import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pelangganId = 1;

    const result = await sql`
      SELECT 
        id,
        resi,
        nama_pengirim,
        nama_penerima,
        alamat_pengirim,
        alamat_penerima,
        created_at,
        pelanggan_id,
        status_id
      FROM pengiriman
      WHERE pelanggan_id = ${pelangganId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      shipments: result.rows ?? [],
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