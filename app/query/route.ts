import { db } from "@vercel/postgres";

export async function GET() {
  const result = await db.sql`
    SELECT *
    FROM (
      SELECT DISTINCT ON (s.id)
        s.id,
        s.resi,
        s.sender_name,
        s.receiver_name,
        s.origin,
        s.destination,
        s.service,
        l.status,
        l.created_at
      FROM shipments s
      LEFT JOIN shipment_status_logs l
        ON s.id = l.shipment_id
      ORDER BY s.id, l.created_at DESC
    ) sub
    ORDER BY id DESC;
  `;

  return Response.json(result.rows);
}