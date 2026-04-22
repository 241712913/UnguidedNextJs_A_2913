import { db } from "@vercel/postgres";

export async function GET() {
  try {
    const resi = "SK-" + Date.now();

    const shipment = await db.sql`
      INSERT INTO shipments 
      (resi, sender_name, receiver_name, status)
      VALUES 
      (${resi}, 'Seed User', 'Receiver', 'Menunggu')
      RETURNING id
    `;
    
    if (!shipment.rows.length) {
      return Response.json({ error: "Failed to insert shipment" });
    }

    const shipmentId = shipment.rows[0].id;

    const statusLog = await db.sql`
      INSERT INTO shipment_status_logs (shipment_id, status)
      VALUES (${shipmentId}, 'Menunggu')
    `;
    
    return Response.json({ message: "Seed berhasil", resi });
  } catch (err: any) {
    return Response.json({ error: err.message });
  }
}