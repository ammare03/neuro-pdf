import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
  console.log("Fetching summaries for user ID:", userId);
  const sql = await getDbConnection();
  const summaries =
    await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return summaries;
}
