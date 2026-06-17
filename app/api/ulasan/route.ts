import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// GET — cek apakah sudah pernah ulasan
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pengiriman_id = searchParams.get("pengiriman_id");
  const pelanggan_id  = searchParams.get("pelanggan_id") ?? "1";

  if (!pengiriman_id) {
    return NextResponse.json({ ulasan: null });
  }

  try {
    const client = await db.connect();
    const result = await client.sql`
      SELECT * FROM ulasan
      WHERE pengiriman_id = ${pengiriman_id}
        AND pelanggan_id  = ${pelanggan_id}
      LIMIT 1
    `;
    client.release();
    return NextResponse.json({ ulasan: result.rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ ulasan: null }, { status: 500 });
  }
}

// POST — simpan ulasan baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pengiriman_id, pelanggan_id = 1, rating, komentar } = body;

    if (!pengiriman_id || !rating) {
      return NextResponse.json(
        { success: false, message: "pengiriman_id dan rating wajib diisi" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating harus antara 1–5" },
        { status: 400 }
      );
    }

    const client = await db.connect();

    // Upsert — kalau sudah ada, update; kalau belum, insert
    const result = await client.sql`
      INSERT INTO ulasan (pengiriman_id, pelanggan_id, rating, komentar)
      VALUES (${pengiriman_id}, ${pelanggan_id}, ${rating}, ${komentar ?? null})
      ON CONFLICT (pengiriman_id, pelanggan_id)
      DO UPDATE SET
        rating     = EXCLUDED.rating,
        komentar   = EXCLUDED.komentar,
        created_at = NOW()
      RETURNING *
    `;
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("[ULASAN POST ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}
