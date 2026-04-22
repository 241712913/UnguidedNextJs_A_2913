import { db } from "@vercel/postgres";

export async function GET() {
  try {
    const resi = "SK-" + Date.now();

    await db.sql`
      INSERT INTO shipments 
      (resi, sender_name, receiver_name, status)
      VALUES 
      (${resi}, 'Test', 'Test', 'Menunggu')
    `;

    return Response.json({ resi });
  } catch (err: any) {
    return Response.json({ error: err.message });
  }
}