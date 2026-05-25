// app/api/pengiriman/[id]/route.ts

import { db } from "@vercel/postgres";

// ─── GET (tidak diubah) ────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await db.connect();
    const result = await client.sql`
      SELECT *
      FROM pengiriman
      WHERE id = ${params.id}
      LIMIT 1
    `;
    client.release();

    if (result.rows.length === 0) {
      return Response.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await db.connect();
    await client.sql`
      DELETE FROM pengiriman
      WHERE id = ${params.id}
    `;
    client.release();

    return Response.json({ message: "Pengiriman berhasil dihapus" });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Gagal menghapus pengiriman" }, { status: 500 });
  }
}

// ─── PUT (Edit) ───────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      nama_pengirim,
      nama_penerima,
      alamat_pengirim,
      alamat_penerima,
      no_hp_pengirim,
      no_hp_penerima,
      berat,
      status_id,
    } = body;

    const client = await db.connect();
    const result = await client.sql`
      UPDATE pengiriman
      SET
        nama_pengirim   = ${nama_pengirim},
        nama_penerima   = ${nama_penerima},
        alamat_pengirim = ${alamat_pengirim},
        alamat_penerima = ${alamat_penerima},
        no_hp_pengirim  = ${no_hp_pengirim},
        no_hp_penerima  = ${no_hp_penerima},
        berat           = ${berat},
        status_id       = ${status_id}
      WHERE id = ${params.id}
      RETURNING *
    `;
    client.release();

    if (result.rows.length === 0) {
      return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("PUT error:", error);
    // Kembalikan pesan error yang jelas ke frontend
    return Response.json(
      { error: "Gagal mengupdate pengiriman", detail: String(error) },
      { status: 500 }
    );
  }
}