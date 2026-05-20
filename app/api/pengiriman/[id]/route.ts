import { NextResponse } from "next/server";

import { db } from "@vercel/postgres";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {

    const result = await db.sql`
      SELECT *
      FROM pengiriman
      WHERE id = ${params.id}
    `;

    if (result.rows.length === 0) {

      return NextResponse.json({
        shipment: null,
      });

    }

    return NextResponse.json({
      shipment: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Gagal mengambil detail pengiriman",
      },
      {
        status: 500,
      }
    );
  }
}