import { db } from "@vercel/postgres";

export async function GET() {
  try {
    const client = await db.connect();

    const result = await client.sql`
      SELECT *
      FROM pengiriman
      ORDER BY created_at DESC
    `;

    client.release();

    const csv = [
      [
        "Resi",
        "Pengirim",
        "Penerima",
        "Status",
        "Tanggal",
        "Ongkir",
      ],

      ...result.rows.map((item) => [
        item.resi,
        item.nama_pengirim,
        item.nama_penerima,
        item.status_id,
        item.created_at,
        item.ongkir,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",

        "Content-Disposition":
          "attachment; filename=laporan-bulanan.csv",
      },
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}