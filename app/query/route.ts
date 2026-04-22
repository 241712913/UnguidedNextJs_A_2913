import { db } from "@vercel/postgres";

export async function GET() {
  const result = await db.sql`
    SELECT * FROM shipments ORDER BY id DESC
  `;

  return Response.json(result.rows);
}