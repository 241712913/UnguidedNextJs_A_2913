/**
 * api/draft/route.ts
 * ──────────────────
 * Khusus pelanggan.
 *
 * GET    – ambil semua draft milik pelanggan yang login
 * DELETE – hapus satu draft (?id=xxx)
 */

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// ── GET ────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const role   = req.cookies.get("role")?.value;

  if (!userId || role !== "pelanggan") {
    return NextResponse.json({ drafts: [] }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT
        p.id,
        p.resi,
        p.nama_penerima,
        p.alamat_penerima,
        p.berat,
        p.ongkir,
        p.created_at,
        p.kota_penerima   AS kota_tujuan,
        p.layanan_id,
        CASE p.layanan_id
          WHEN 1 THEN 'Reguler'
          WHEN 2 THEN 'Express'
          WHEN 3 THEN 'Same Day'
          ELSE        'Reguler'
        END AS layanan
      FROM pengiriman p
      WHERE p.pelanggan_id = ${userId}
        AND p.is_draft = true
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({ drafts: rows });
  } catch (error: any) {
    console.error("[api/draft GET]", error.message);
    return NextResponse.json({ drafts: [], error: error.message }, { status: 500 });
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const role   = req.cookies.get("role")?.value;

  if (!userId || role !== "pelanggan") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, message: "ID wajib diisi" }, { status: 400 });
  }

  try {
    const result = await sql`
      DELETE FROM pengiriman
      WHERE id           = ${id}
        AND pelanggan_id = ${userId}
        AND is_draft     = true
      RETURNING id
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Draft tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Draft berhasil dihapus" });
  } catch (error: any) {
    console.error("[api/draft DELETE]", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
