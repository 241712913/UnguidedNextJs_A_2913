import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GET() {
  try {
    const client = await db.connect();
    const result = await client.sql`
      SELECT
        p.*,
        l.nama_layanan AS layanan
      FROM pengiriman p
      LEFT JOIN layanan l ON p.layanan_id = l.id
      WHERE p.is_draft = false
      ORDER BY p.created_at DESC
    `;
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.log("GET ERROR:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY MASUK:", body);

    const client = await db.connect();

    const layananMap: Record<string, number> = {
      Reguler: 1, Express: 2, "Same Day": 3,
    };
    const layananId = layananMap[body.layanan] ?? 1;
    const isDraft = body.finalize ? false : true;

    // ── UPDATE draft pelanggan yang sedang diproses admin ──────────────────
    if (body.editId) {
      await client.sql`
        UPDATE pengiriman SET
          nama_pengirim      = ${body.nama_pengirim},
          no_hp_pengirim     = ${body.no_hp_pengirim},
          alamat_pengirim    = ${body.alamat_pengirim},
          nama_penerima      = ${body.nama_penerima},
          no_hp_penerima     = ${body.no_hp_penerima},
          alamat_penerima    = ${body.alamat_penerima},
          kota_penerima      = ${body.kota_penerima},
          kecamatan_penerima = ${body.kecamatan_penerima},
          kode_pos_penerima  = ${body.kode_pos_penerima},
          berat              = ${body.berat},
          ongkir             = ${body.total_ongkir},
          layanan_id         = ${layananId},
          status_id          = ${body.status_id ?? 1},
          kategori_barang    = ${body.kategori_barang ?? null},
          deskripsi_barang   = ${body.deskripsi_barang ?? null},
          mudah_pecah        = ${body.mudah_pecah ?? null},
          is_draft           = ${isDraft},
          draft_owner        = 'admin'
        WHERE id = ${body.editId}
      `;
      client.release();
      return NextResponse.json({ success: true });
    }

    // ── INSERT baru oleh admin ─────────────────────────────────────────────

    // Lookup user_pengirim_id by no_hp_pengirim
    const phoneCore = (body.no_hp_pengirim ?? "").slice(-9);
    const pengirimResult = await client.sql`
      SELECT id FROM users WHERE phone LIKE ${'%' + phoneCore} LIMIT 1
    `;
    const userPengirimId = pengirimResult.rows[0]?.id ?? null;

    // Lookup user_penerima_id by no_hp_penerima
    const phonePenerimaCore = (body.no_hp_penerima ?? "").slice(-9);
    const penerimaResult = await client.sql`
      SELECT id FROM users WHERE phone LIKE ${'%' + phonePenerimaCore} LIMIT 1
    `;
    const userPenerimaId = penerimaResult.rows[0]?.id ?? null;

    console.log("user_pengirim_id:", userPengirimId);
    console.log("user_penerima_id:", userPenerimaId);

    const resi = body.resi || ("SK-" + Math.random().toString(36).substring(2, 12).toUpperCase());

    await client.sql`
      INSERT INTO pengiriman (
        resi,
        nama_pengirim,      no_hp_pengirim,     alamat_pengirim,
        nama_penerima,      no_hp_penerima,     alamat_penerima,
        kota_penerima,      kecamatan_penerima, kode_pos_penerima,
        berat,              ongkir,             layanan_id,
        status_id,          is_draft,           draft_owner,
        kategori_barang,    deskripsi_barang,   mudah_pecah,
        user_pengirim_id,   user_penerima_id
      ) VALUES (
        ${resi},
        ${body.nama_pengirim},      ${body.no_hp_pengirim},     ${body.alamat_pengirim},
        ${body.nama_penerima},      ${body.no_hp_penerima},     ${body.alamat_penerima},
        ${body.kota_penerima},      ${body.kecamatan_penerima}, ${body.kode_pos_penerima},
        ${body.berat},              ${body.total_ongkir},        ${layananId},
        ${body.status_id ?? 1},     ${isDraft},                 'admin',
        ${body.kategori_barang ?? null}, ${body.deskripsi_barang ?? null}, ${body.mudah_pecah ?? null},
        ${userPengirimId},          ${userPenerimaId}
      )
    `;

    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("POST ERROR:", error);
    return NextResponse.json(
      { error: "Database error", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const client = await db.connect();
    await client.sql`DELETE FROM pengiriman WHERE id = ${body.id}`;
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}