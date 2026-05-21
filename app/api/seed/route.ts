import { db } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resi = "SK-" + Date.now();

    const result = await db.sql`
      INSERT INTO pengiriman (
        resi,
        nama_pengirim,
        nama_penerima,
        no_hp_pengirim,
        no_hp_penerima,
        alamat_pengirim,
        alamat_penerima,
        layanan_id,
        berat,
        ongkir,
        status_id,
        pelanggan_id,
        created_at
      )
      VALUES (
        ${resi},
        'Seed User',
        'Receiver',
        '08123456789',
        '08987654321',
        'Jakarta',
        'Bandung',
        1,
        1.0,
        15000,
        1,
        1,
        NOW()
      )
      RETURNING id;
    `;

    return Response.json({
      message: "Seed berhasil",
      id: result.rows[0].id,
    });
  } catch (err) {
    return Response.json(
      {
        error: "Seed gagal",
        details:
          err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}