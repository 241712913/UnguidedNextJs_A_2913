import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const client = await db.connect();
    const searchParams = req.nextUrl.searchParams;
    const status  = searchParams.get("status")  || "all";
    const tanggal = searchParams.get("tanggal") || "all";

    const totalPengiriman = await client.sql`
      SELECT COUNT(*) as count FROM pengiriman WHERE is_draft = false
    `;

    const berhasil = await client.sql`
      SELECT COUNT(*) as count FROM pengiriman WHERE status_id = 5 AND is_draft = false
    `;

    const gagal = await client.sql`
      SELECT COUNT(*) as count FROM pengiriman WHERE status_id = 6 AND is_draft = false
    `;

    const aktif = await client.sql`
      SELECT COUNT(*) as count FROM pengiriman WHERE status_id IN (1,2,3,4) AND is_draft = false
    `;

    let terbaru;
    if (status !== "all" && tanggal !== "all") {
      terbaru = await client.sql`
        SELECT * FROM pengiriman
        WHERE status_id = ${Number(status)} AND DATE(created_at) = ${tanggal} AND is_draft = false
        ORDER BY created_at DESC LIMIT 5
      `;
    } else if (status !== "all") {
      terbaru = await client.sql`
        SELECT * FROM pengiriman
        WHERE status_id = ${Number(status)} AND is_draft = false
        ORDER BY created_at DESC LIMIT 5
      `;
    } else if (tanggal !== "all") {
      terbaru = await client.sql`
        SELECT * FROM pengiriman
        WHERE DATE(created_at) = ${tanggal} AND is_draft = false
        ORDER BY created_at DESC LIMIT 5
      `;
    } else {
      terbaru = await client.sql`
        SELECT * FROM pengiriman WHERE is_draft = false ORDER BY created_at DESC LIMIT 5
      `;
    }

    const layanan = await client.sql`
      SELECT
        l.nama_layanan AS layanan,
        COUNT(*) AS total
      FROM pengiriman p
      JOIN layanan l ON p.layanan_id = l.id
      WHERE p.is_draft = false
      GROUP BY l.nama_layanan
      ORDER BY total DESC
    `;

    const tren = await client.sql`
      SELECT
        TO_CHAR(created_at, 'DD/MM') AS tanggal,
        DATE(created_at) AS tanggal_urut,
        COUNT(*) AS total
      FROM pengiriman
      WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '6 days'
        AND is_draft = false
      GROUP BY tanggal, tanggal_urut
      ORDER BY tanggal_urut ASC
    `;

    const pendapatan = await client.sql`
      SELECT COALESCE(SUM(ongkir), 0) AS total FROM pengiriman WHERE is_draft = false
    `;

    client.release();

    return NextResponse.json({
      totalPengiriman: totalPengiriman.rows,
      aktif:           aktif.rows,
      berhasil:        berhasil.rows,
      gagal:           gagal.rows,
      tren:            tren.rows,
      layanan:         layanan.rows,
      terbaru:         terbaru.rows,
      pendapatan:      pendapatan.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database error", error },
      { status: 500 }
    );
  }
}