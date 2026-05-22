import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY REQUEST:", body);

    await sql`
      INSERT INTO pengiriman (
        resi,
        nama_pengirim,
        nama_penerima,
        no_hp_pengirim,
        no_hp_penerima,
        alamat_pengirim,
        alamat_penerima,
        berat,
        ongkir,
        created_at,
        pelanggan_id,
        layanan_id,
        kota_asal_id,
        kota_tujuan_id,
        status_id
      )
      VALUES (
        ${body.resi ?? ""},
        ${body.nama_pengirim ?? ""},
        ${body.nama_penerima ?? ""},
        ${body.hp_pengirim ?? ""},
        ${body.hp_penerima ?? ""},
        ${body.alamat_pengirim ?? ""},
        ${body.alamat_penerima ?? ""},
        ${Number(body.berat) || 0},
        ${Number(body.total_ongkir) || 0},
        NOW(),
        ${body.pelanggan_id ?? 1},
        ${body.layanan_id ?? 1},
        ${body.kota_asal_id ?? 1},
        ${body.kota_tujuan_id ?? 1},
        ${body.status_id ?? 1}
      )
    `;

    return NextResponse.json({
      success: true,
      message: "Pengiriman berhasil ditambahkan",
    });

  } catch (error: any) {
    console.error("INSERT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menambahkan pengiriman",
        details: error.message,
      },
      { status: 500 }
    );
  }
}