import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

async function resolveKotaId(kota: string | number | undefined, defaultId = 1) {
  if (typeof kota === "number" && Number.isInteger(kota) && kota > 0) {
    return kota;
  }

  if (!kota || String(kota).trim() === "") {
    return defaultId;
  }

  const result = await sql`
    SELECT id
    FROM kota
    WHERE lower(nama_kota) = lower(${String(kota).trim()})
    LIMIT 1
  `;

  return result.rows[0]?.id ?? defaultId;
}

async function resolveLayananId(layanan: string | number | undefined, defaultId = 1) {
  if (typeof layanan === "number" && Number.isInteger(layanan) && layanan > 0) {
    return layanan;
  }

  if (!layanan || String(layanan).trim() === "") {
    return defaultId;
  }

  const result = await sql`
    SELECT id
    FROM layanan
    WHERE lower(nama_layanan) = lower(${String(layanan).trim()})
    LIMIT 1
  `;

  return result.rows[0]?.id ?? defaultId;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY REQUEST:", body);

    const kotaAsalId = await resolveKotaId(body.kota_asal_id ?? body.kota_pengirim, 1);
    const kotaTujuanId = await resolveKotaId(body.kota_tujuan_id ?? body.kota_penerima, 2);
    const layananId = await resolveLayananId(body.layanan_id ?? body.layanan, 1);

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
        layanan_id,
        created_at,
        pelanggan_id,
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
        ${Number(body.total_ongkir ?? body.ongkir) || 0},
        ${layananId},
        NOW(),
        ${body.pelanggan_id ?? 1},
        ${kotaAsalId},
        ${kotaTujuanId},
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
