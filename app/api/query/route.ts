import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const result = await sql`
      SELECT *
      FROM pengiriman
      WHERE
        (
          ${query} = ''
          OR resi ILIKE ${"%" + query + "%"}
          OR nama_pengirim ILIKE ${"%" + query + "%"}
          OR nama_penerima ILIKE ${"%" + query + "%"}
          OR alamat_pengirim ILIKE ${"%" + query + "%"}
          OR alamat_penerima ILIKE ${"%" + query + "%"}
        )
      ORDER BY created_at DESC
    `;

    return Response.json({
      shipments: result.rows,
    });
  } catch (error) {
    return Response.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}