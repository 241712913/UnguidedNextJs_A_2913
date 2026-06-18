import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic  = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const role   = req.cookies.get("role")?.value;

    if (!userId || role !== "pelanggan") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT
        id,
        resi,
        nama_pengirim,
        nama_penerima,
        no_hp_pengirim,
        no_hp_penerima,
        alamat_pengirim,
        alamat_penerima,
        kota_penerima,
        kecamatan_penerima,
        berat,
        ongkir,
        created_at,
        status_id,
        layanan_id,
        is_draft
      FROM pengiriman
      WHERE is_draft = false
        AND (
          user_pengirim_id = ${userId}
          OR user_penerima_id = ${userId}
          OR pelanggan_id = ${userId}
        )
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ shipments: result.rows ?? [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data", details: error.message },
      { status: 500 }
    );
  }
}
