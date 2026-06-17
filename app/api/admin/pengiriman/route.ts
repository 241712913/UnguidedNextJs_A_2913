/**
 * api/admin/pengiriman/route.ts
 * ─────────────────────────────
 * Khusus admin.
 *
 * GET    – lihat semua draft (dari pelanggan maupun dari admin sendiri)
 *
 * POST   – tiga mode lewat body:
 *   1. { editId, finalize: true, ...data }
 *        → validasi + finalisasi: is_draft=false, resi dicetak
 *        → gunakan saat pelanggan sudah datang, bayar, dan data OK
 *
 *   2. { editId, ...data }          (tanpa finalize)
 *        → simpan ulang sebagai draft admin (draft_owner='admin')
 *        → gunakan saat ada data yang perlu dikonfirmasi ulang
 *
 *   3. { ...data }                  (tanpa editId)
 *        → admin buat pengiriman baru dari awal
 *        → finalize: true  → langsung aktif + cetak resi
 *        → finalize: false → simpan sebagai draft admin dulu
 *
 * DELETE – hapus draft by id (body: { id })
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

function layananLabel(id: number): string {
  return { 1: "Reguler", 2: "Express", 3: "Same Day" }[id] ?? "Reguler";
}

// ── GET ────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ?owner=customer|admin   (kosong = tampilkan semua)
  const owner = new URL(req.url).searchParams.get("owner");

  try {
    // Pakai kondisi dinamis dengan CASE agar tetap satu query
    const { rows } = await sql`
      SELECT
        p.id,
        p.resi,
        p.nama_pengirim,      p.no_hp_pengirim,     p.alamat_pengirim,
        p.nama_penerima,      p.no_hp_penerima,     p.alamat_penerima,
        p.kota_penerima,      p.kecamatan_penerima, p.kode_pos_penerima,
        p.berat,              p.ongkir,
        p.layanan_id,         p.kategori_barang,
        p.deskripsi_barang,   p.mudah_pecah,
        p.status_id,          p.draft_owner,
        p.created_at,         p.pelanggan_id,
        u.nama  AS nama_pelanggan,
        u.email AS email_pelanggan,
        CASE p.layanan_id
          WHEN 1 THEN 'Reguler'
          WHEN 2 THEN 'Express'
          WHEN 3 THEN 'Same Day'
          ELSE        'Reguler'
        END AS layanan
      FROM pengiriman p
      LEFT JOIN users u ON p.pelanggan_id = u.id
      WHERE p.is_draft = true
        AND (${owner}::text IS NULL OR p.draft_owner = ${owner})
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("[api/admin/pengiriman GET]", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data draft", details: error.message },
      { status: 500 }
    );
  }
}

// ── POST ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      editId,
      finalize = false,   // true → is_draft=false dan cetak resi

      nama_pengirim,      no_hp_pengirim,     alamat_pengirim,
      nama_penerima,      no_hp_penerima,     alamat_penerima,
      kota_penerima,      kecamatan_penerima, kode_pos_penerima,
      berat,              deskripsi_barang,   kategori_barang,
      mudah_pecah,        layanan,            total_ongkir,
      status_id,

      // Saat admin buat pengiriman baru atas nama pelanggan tertentu (opsional)
      pelanggan_id: bodyPelangganId,
    } = body;

    const layanan_id = LAYANAN_MAP[layanan] ?? 1;

    // ────────────────────────────────────────────────────────────────────────
    // MODE 1 & 2 — edit draft yang sudah ada (dari pelanggan atau admin)
    // ────────────────────────────────────────────────────────────────────────
    if (editId) {
      const { rows } = await sql`
        SELECT id, pelanggan_id FROM pengiriman
        WHERE id = ${editId} AND is_draft = true
        LIMIT 1
      `;

      if (rows.length === 0) {
        return NextResponse.json({ error: "Draft tidak ditemukan" }, { status: 404 });
      }

      // Pertahankan pelanggan_id aslinya
      const originalPelangganId = rows[0].pelanggan_id;

      // ── Finalisasi: pelanggan sudah datang, bayar, data OK ──────────────
      if (finalize) {
        // Pakai resi yang sudah ada (kalau sudah di-generate waktu draft)
        const existing = await sql`SELECT resi FROM pengiriman WHERE id = ${editId}`;
        let resi = existing.rows[0]?.resi?.trim();
        if (!resi) resi = await uniqueResi(); // generate kalau belum ada

        await sql`
          UPDATE pengiriman SET
            resi               = ${resi},
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
            pelanggan_id       = ${originalPelangganId},
            is_draft           = false,
            draft_owner        = 'admin'
          WHERE id = ${editId}
        `;

        return NextResponse.json({
          success: true,
          message: "Pengiriman berhasil difinalisasi. Resi siap dicetak.",
          resi,
        });
      }

      // ── Simpan ulang sebagai draft admin (ada data yang perlu dikonfirmasi) ──
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
          pelanggan_id       = ${originalPelangganId},
          is_draft           = true,
          draft_owner        = 'admin'
        WHERE id = ${editId}
      `;

      return NextResponse.json({
        success: true,
        message: "Draft disimpan oleh admin. Menunggu konfirmasi ulang.",
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 3 — admin buat pengiriman baru dari awal
    // ────────────────────────────────────────────────────────────────────────
    const resi        = await uniqueResi();
    const isDraft     = !finalize;
    const ownerUserId = bodyPelangganId ?? null; // boleh null kalau walk-in

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
        ${berat},              ${total_ongkir},        ${ownerUserId},
        ${layanan_id},         ${status_id},           ${isDraft},       'admin',
        ${kategori_barang},    ${deskripsi_barang},   ${mudah_pecah},
        ${kota_penerima},      ${kecamatan_penerima}, ${kode_pos_penerima}
      )
    `;

    const message = isDraft
      ? "Draft admin berhasil disimpan."
      : "Pengiriman berhasil dibuat. Resi siap dicetak.";

    return NextResponse.json({
      success: true,
      message,
      resi: isDraft ? undefined : resi,
    });
  } catch (error: any) {
    console.error("[api/admin/pengiriman POST]", error.message);
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: error.message },
      { status: 500 }
    );
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    await sql`DELETE FROM pengiriman WHERE id = ${id} AND is_draft = true`;

    return NextResponse.json({ success: true, message: "Draft berhasil dihapus" });
  } catch (error: any) {
    console.error("[api/admin/pengiriman DELETE]", error.message);
    return NextResponse.json(
      { error: "Gagal menghapus draft", details: error.message },
      { status: 500 }
    );
  }
}
