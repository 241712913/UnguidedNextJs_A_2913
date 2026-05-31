import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET() {
  try {
    const client = await db.connect();

    const result = await client.sql`
      SELECT
        p.*,
        ka.nama_kota AS kota_pengirim,
        kt.nama_kota AS kota_penerima,
        l.nama_layanan AS layanan
      FROM pengiriman p
      LEFT JOIN kota ka ON p.kota_asal_id = ka.id
      LEFT JOIN kota kt ON p.kota_tujuan_id = kt.id
      LEFT JOIN layanan l ON p.layanan_id = l.id
      ORDER BY p.created_at DESC
    `;

    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.log("GET ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY MASUK:", body);

    const client = await db.connect();

    await client.sql`
      INSERT INTO pengiriman (
        resi,
        nama_pengirim,
        hp_pengirim,
        alamat_pengirim,
        kota_pengirim,
        kode_pos_pengirim,
        
        nama_penerima,
        hp_penerima,
        alamat_penerima,
        kota_penerima,
        kode_pos_penerima,
        
        berat,
        deskripsi_barang,
        layanan,
        total_ongkir,
        estimasi,
        status
      )
      VALUES (
        ${body.resi},
        ${body.namaPengirim},
        ${body.hpPengirim},
        ${body.alamatPengirim},
        ${body.kotaPengirim},
        ${body.kodePosPengirim},

        ${body.namaPenerima},
        ${body.hpPenerima},
        ${body.alamatPenerima},
        ${body.kotaPenerima},
        ${body.kodePosPenerima},

        ${body.berat},
        ${body.deskripsiBarang},
        ${body.metode},
        ${body.totalOngkir},
        ${body.estimasi},
        ${body.status}
      )
    `;

    client.release();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Database error",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
