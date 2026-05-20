import { db } from "@vercel/postgres";

// Memaksa API menjadi dinamis agar aman saat proses build di Vercel
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resi = "SK-" + Date.now();

    // Memasukkan data baru sesuai struktur kolom database kamu
    const shipment = await db.sql`
      INSERT INTO pengiriman 
      (
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
        status
      )
      VALUES 
      (
        ${resi}, 
        'Seed User', 
        'Receiver', 
        '08123456789', 
        '08987654321', 
        'Jakarta', 
        'Bandung', 
        'Reguler', 
        1.00, 
        15000.00, 
        'Menunggu'
      )
      RETURNING id;
    `;
    
    if (!shipment.rows.length) {
      return Response.json({ error: "Gagal membuat data pengiriman baru" });
    }

    return Response.json({ message: "Seed berhasil", resi });
  } catch (err) {
    // Mengatasi error tipe data pada block catch (Aman untuk TS & JS)
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    return Response.json({ error: errorMessage });
  }
}