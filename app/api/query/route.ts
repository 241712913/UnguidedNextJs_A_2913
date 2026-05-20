import { db } from "@vercel/postgres";

// Memaksa API menjadi dinamis agar tidak error saat build di Vercel
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Mengambil data langsung dari tabel pengiriman diurutkan dari yang terbaru
    const result = await db.sql`
      SELECT 
        id,
        resi,
        nama_pengirim,
        nama_penerima,
        no_hp_pengirim,
        no_hp_penerima,
        alamat_pengirim,
        alamat_penerima,
        layanan,
        berat,
        ongkir,
        status,
        created_at,
        pelanggan_id
      FROM pengiriman
      ORDER BY id DESC;
    `;

    return Response.json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json({ error: "Gagal mengambil data pengiriman" }, { status: 500 });
  }
}