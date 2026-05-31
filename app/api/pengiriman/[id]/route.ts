import { db } from "@vercel/postgres";

async function resolveKotaId(client: any, kota: string | number | undefined, defaultId: number | null = null) {
  if (typeof kota === "number" && Number.isInteger(kota) && kota > 0) {
    return kota;
  }

  if (!kota || String(kota).trim() === "") {
    return defaultId;
  }

  const result = await client.sql`
    SELECT id
    FROM kota
    WHERE lower(nama_kota) = lower(${String(kota).trim()})
    LIMIT 1
  `;

  return result.rows[0]?.id ?? defaultId;
}

async function resolveLayananId(client: any, layanan: string | number | undefined, defaultId = 1) {
  if (typeof layanan === "number" && Number.isInteger(layanan) && layanan > 0) {
    return layanan;
  }

  if (!layanan || String(layanan).trim() === "") {
    return defaultId;
  }

  const result = await client.sql`
    SELECT id
    FROM layanan
    WHERE lower(nama_layanan) = lower(${String(layanan).trim()})
    LIMIT 1
  `;

  return result.rows[0]?.id ?? defaultId;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      WHERE p.id = ${params.id}
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

export async function PATCH(
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
      kota_pengirim,
      kota_penerima,
      layanan,
      total_ongkir,
    } = body;

    const client = await db.connect();

    const kotaAsalId = await resolveKotaId(client, body.kota_asal_id ?? kota_pengirim, null);
    const kotaTujuanId = await resolveKotaId(client, body.kota_tujuan_id ?? kota_penerima, null);
    const layananId = await resolveLayananId(client, body.layanan_id ?? layanan, 1);

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
        status_id       = ${status_id},
        layanan_id      = ${layananId},
        kota_asal_id    = ${kotaAsalId},
        kota_tujuan_id  = ${kotaTujuanId},
        ongkir          = ${Number(total_ongkir) || 0}
      WHERE id = ${params.id}
      RETURNING *
    `;
    client.release();

    if (result.rows.length === 0) {
      return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json(
      { error: "Gagal mengupdate pengiriman", detail: String(error) },
      { status: 500 }
    );
  }
}

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
    return Response.json(
      { error: "Gagal mengupdate pengiriman", detail: String(error) },
      { status: 500 }
    );
  }
}
