export const runtime = "nodejs";
import mysql from "mysql2/promise";
import { Client as PgClient } from "pg";
import { MongoClient } from "mongodb";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { dbType, connStr, tableName } = await req.json();

  try {
    let fields = [];

    if (dbType === "mysql") {
      const db = await mysql.createConnection(connStr);
      const [rows] = await db.query(`DESCRIBE ${tableName}`);
      fields = rows.map(r => r.Field);
      await db.end();
    }

    else if (dbType === "postgres") {
      const client = new PgClient({ connectionString: connStr });
      await client.connect();
      const res = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
        [tableName]
      );
      fields = res.rows.map(r => r.column_name);
      await client.end();
    }

    else if (dbType === "mongodb") {
      const client = new MongoClient(connStr);
      await client.connect();
      const db = client.db(); // ใช้ db จาก connection string
      const collection = db.collection(tableName);
      const doc = await collection.findOne();
      fields = doc ? Object.keys(doc) : [];
      await client.close();
    }

    else if (dbType === "mssql") {
      const pool = await sql.connect(connStr);
      const result = await pool.request()
        .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);
      fields = result.recordset.map(r => r.COLUMN_NAME);
      await pool.close();
    }

    else {
      return NextResponse.json({ error: "Unsupported dbType" }, { status: 400 });
    }

    return NextResponse.json({ fields });
  }

  catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
