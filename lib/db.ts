"use server";

import { neon } from "@neondatabase/serverless";

let sql: any = null;

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Neon DATABASE_URL is not defined");
  }

  if (sql) {
    return sql;
  }

  try {
    sql = neon(process.env.DATABASE_URL);
    return sql;
  } catch (error) {
    console.error("Error connecting to Neon database:", error);
    throw new Error("Failed to connect to the database");
  }
}
