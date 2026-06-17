/**
 * api/pengiriman/route.ts
 * ──────────────────────
 * Khusus pelanggan.
 *
 * POST – buat draft baru ATAU update draft yang sudah ada
 *   body tanpa editId  → INSERT draft baru
 *   body dengan editId → UPDATE draft milik pelanggan ini
 */

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// ── Helpers ────────────────────────────────────────────────────────────────
function generateResi(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "";
  for (let i = 0; i < 10; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return "SK-" + r;
}

async function uniqueResi(): Promise<string> {
  let resi = generateResi();
  while (true) {
    const { rows } = await sql`SELECT id FROM pengiriman WHERE resi = ${resi} LIMIT 1`;
    if (rows.length === 0) return resi;
    resi = generateResi();
  }
}

const LAYANAN_MAP: Record<string, number> = {
  Reguler: 1,
  Express: 2,
  "Same Day": 3,
};

// ── POST ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const role   = req.cookies.get("role")?.value;

    if (!userId || role !== "pelanggan") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      editId,
      nama_pengirim,      no_hp_pengirim,     alamat_pengirim,
      nama_penerima,      no_hp_penerima,     alamat_penerima,
      kota_penerima,      kecamatan_penerima, kode_pos_penerima,
      berat,              deskripsi_barang,   kategori_barang,
      mudah_pecah,        layanan,            total_ongkir,
      status_id,
    } = body;

    const layanan_id = LAYANAN_MAP[layanan] ?? 1;

    // ── UPDATE draft yang sudah ada ────────────────────────────────────────
    if (editId) {
      const { rows } = await sql`
        SELECT id FROM pengiriman
        WHERE  id = ${editId}
          AND  pelanggan_id = ${userId}
          AND  is_draft = true
        LIMIT 1
      `;

      if (rows.length === 0) {
        return NextResponse.json({ error: "Draft tidak ditemukan" }, { status: 404 });
      }

      await sql`
        UPDATE pengiriman SET
          nama_pengirim      = ${nama_pengirim},
          no_hp_pengirim     = ${no_hp_pengirim},
          alamat_pengirim    = ${alamat_pengirim},
          nama_penerima      = ${nama_penerima},
          no_hp_penerima     = ${no_hp_penerima},
          alamat_penerima    = ${alamat_penerima},
          berat              = ${berat},
          ongkir             = ${total_ongkir},
          layanan_id         = ${layanan_id},
          status_id          = ${status_id},
          kategori_barang    = ${kategori_barang},
          deskripsi_barang   = ${deskripsi_barang},
          mudah_pecah        = ${mudah_pecah},
          kota_penerima      = ${kota_penerima},
          kecamatan_penerima = ${kecamatan_penerima},
          kode_pos_penerima  = ${kode_pos_penerima},
          is_draft           = true,
          draft_owner        = 'customer'
        WHERE id = ${editId} AND pelanggan_id = ${userId}
      `;

      return NextResponse.json({ success: true, message: "Draft berhasil diperbarui." });
    }

    // ── INSERT draft baru ──────────────────────────────────────────────────
    const resi = await uniqueResi();

    await sql`
      INSERT INTO pengiriman (
        resi,
        nama_pengirim,      no_hp_pengirim,     alamat_pengirim,
        nama_penerima,      no_hp_penerima,     alamat_penerima,
        berat,              ongkir,             pelanggan_id,
        layanan_id,         status_id,          is_draft,         draft_owner,
        kategori_barang,    deskripsi_barang,   mudah_pecah,
        kota_penerima,      kecamatan_penerima, kode_pos_penerima
      ) VALUES (
        ${resi},
        ${nama_pengirim},      ${no_hp_pengirim},     ${alamat_pengirim},
        ${nama_penerima},      ${no_hp_penerima},     ${alamat_penerima},
        ${berat},              ${total_ongkir},        ${userId},
        ${layanan_id},         ${status_id},           true,             'customer',
        ${kategori_barang},    ${deskripsi_barang},   ${mudah_pecah},
        ${kota_penerima},      ${kecamatan_penerima}, ${kode_pos_penerima}
      )
    `;

    return NextResponse.json({ success: true, message: "Draft berhasil disimpan." });
  } catch (error: any) {
    console.error("[api/pengiriman POST]", error.message);
    return NextResponse.json(
      { error: "Gagal menyimpan draft", details: error.message },
      { status: 500 }
    );
  }
}
