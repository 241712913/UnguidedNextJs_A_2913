import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await db.connect();

    await client.sql`
      INSERT INTO pengiriman (
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
        created_at
      )
      VALUES (
        ${body.resi},
        ${body.nama_pengirim},
        ${body.nama_penerima},

        ${body.hp_pengirim},
        ${body.hp_penerima},

        ${body.alamat_pengirim},
        ${body.alamat_penerima},

        ${body.layanan},
        ${body.berat},
        ${body.total_ongkir},
        ${body.status},

        NOW()
      )
    `;

    client.release();

    return NextResponse.json({
      success: true,
      message: "Pengiriman berhasil ditambahkan",
    });

  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Gagal menambahkan pengiriman",
        details: error.message,
      },
      { status: 500 }
    );
  }
}