import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await db.connect();

    // TOTAL PENGIRIMAN
    const totalPengiriman = await client.sql`
      SELECT COUNT(*) FROM pengiriman
    `;

    // BERHASIL
    const berhasil = await client.sql`
      SELECT COUNT(*) FROM pengiriman
      WHERE status = 'Terkirim'
    `;

    // GAGAL
    const gagal = await client.sql`
      SELECT COUNT(*) FROM pengiriman
      WHERE status = 'Gagal'
    `;

    // AKTIF
    const aktif = await client.sql`
      SELECT COUNT(*) FROM pengiriman
      WHERE status != 'Terkirim'
    `;

    // 5 DATA TERBARU
    const terbaru = await client.sql`
      SELECT *
      FROM pengiriman
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // LAYANAN TERPOPULER
    const layanan = await client.sql`
      SELECT layanan, COUNT(*) as total
      FROM pengiriman
      GROUP BY layanan
      ORDER BY total DESC
    `;

    // TREN PENGIRIMAN
    const tren = await client.sql`
      SELECT
        DATE(created_at) as tanggal,
        COUNT(*) as total
      FROM pengiriman
      GROUP BY tanggal
      ORDER BY tanggal ASC
      LIMIT 7
    `;

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
      {
        status: 500,
      }
    );
  }
}