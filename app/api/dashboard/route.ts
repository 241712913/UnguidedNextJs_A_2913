import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await db.connect();

    // TOTAL PENGIRIMAN
    const totalPengiriman = await client.sql`
      SELECT COUNT(*) as count FROM pengiriman
    `;

    // BERHASIL (pakai status_id)
    const berhasil = await client.sql`
      SELECT COUNT(*) as count
      FROM pengiriman
      WHERE status_id = 5
    `;

    // GAGAL
    const gagal = await client.sql`
      SELECT COUNT(*) as count
      FROM pengiriman
      WHERE status_id = 6
    `;

    // AKTIF
    const aktif = await client.sql`
      SELECT COUNT(*) as count
      FROM pengiriman
      WHERE status_id IN (1,2,3,4)
    `;

    // TERBARU
    const terbaru = await client.sql`
      SELECT *
      FROM pengiriman
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // LAYANAN TERPOPULER (JOIN RELASI)
    const layanan = await client.sql`
      SELECT l.nama_layanan AS layanan, COUNT(*) AS total
      FROM pengiriman p
      JOIN layanan l ON p.layanan_id = l.id
      GROUP BY l.nama_layanan
      ORDER BY total DESC
    `;

    // TREN PENGIRIMAN
    const tren = await client.sql`
      SELECT
        DATE(created_at) AS tanggal,
        COUNT(*) AS total
      FROM pengiriman
      GROUP BY DATE(created_at)
      ORDER BY tanggal ASC
      LIMIT 7
    `;

    // PENDAPATAN
    const pendapatan = await client.sql`
      SELECT COALESCE(SUM(ongkir), 0) AS total
      FROM pengiriman
    `;

    client.release();

    return NextResponse.json({
      totalPengiriman: totalPengiriman.rows,
      aktif: aktif.rows,
      berhasil: berhasil.rows,
      gagal: gagal.rows,
      tren: tren.rows,
      layanan: layanan.rows,
      terbaru: terbaru.rows,
      pendapatan: pendapatan.rows,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database error",
        error,
      },
      { status: 500 }
    );
  }
}