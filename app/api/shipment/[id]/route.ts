import { db } from "@vercel/postgres";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {

  try {

    const client =
      await db.connect();

    const result =
      await client.sql`
        SELECT *
        FROM pengiriman
        WHERE id = ${params.id}
        LIMIT 1
      `;

    client.release();

    return Response.json(
      result.rows[0]
    );

  } catch (error) {

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}