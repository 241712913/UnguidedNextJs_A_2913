import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { rows } = await sql`
      SELECT
        id,
        nama,
        email,
        phone
      FROM users
      ORDER BY nama ASC
    `;

    return NextResponse.json(
      {
        success: true,
        count: rows.length,
        data: rows,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[api/admin/pelanggan GET]", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data pelanggan",
        details: error.message,
      },
      { status: 500 }
    );
  }
}