export const runtime = "nodejs";
import mysql from "mysql2/promise";
import { Client } from "pg";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { dbType, connStr } = await req.json();
  try {
    if (dbType === "mysql") {
      const db = await mysql.createConnection(connStr);
      await db.end();
    } else if (dbType === "postgres") {
      const client = new Client({ connectionString: connStr });
      await client.connect();
      await client.end();
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
