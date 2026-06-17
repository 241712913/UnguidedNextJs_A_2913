import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_MAP: Record<number, string> = {
  1: "Menunggu",
  2: "Dijemput",
  3: "Dalam perjalanan",
  4: "Diantar",
  5: "Terkirim",
  6: "Gagal",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resi = searchParams.get("resi")?.trim();

  if (!resi) {
    return NextResponse.json(
      {
        result: null,
        message: "Resi tidak boleh kosong",
      },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      SELECT
        resi,
        alamat_pengirim,
        alamat_penerima,
        berat,
        created_at,
        status_id
      FROM pengiriman
      WHERE resi = ${resi}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({
        result: null,
        message: "Resi tidak ditemukan",
      });
    }

    const row = result.rows[0];

    const tanggal_kirim = row.created_at
      ? new Date(row.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    const status_id = row.status_id ?? 1;
    const status = STATUS_MAP[status_id] ?? "Menunggu";

    return NextResponse.json({
      result: {
        resi: row.resi,
        status,
        status_id, 
        alamat_pengirim: row.alamat_pengirim,
        alamat_penerima: row.alamat_penerima,
        berat: row.berat,
        tanggal_kirim,
      },
    });
  } catch (error: any) {
    console.error("[TRACKING ERROR]", error);

    return NextResponse.json(
      {
        result: null,
        message: "Terjadi kesalahan server",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}