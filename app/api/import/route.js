export const runtime = "nodejs";
import mysql from "mysql2/promise";
import { Client as PgClient } from "pg";
import { MongoClient } from "mongodb";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { dbType, connStr, tableName, data } = body;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data to import" }, { status: 400 });
    }

    const keys = Object.keys(data[0]);

    // ✅ MySQL
    if (dbType === "mysql") {
      const db = await mysql.createConnection(connStr);
      const values = data.map(row => keys.map(k => row[k]));
      await db.query(`INSERT INTO ${tableName} (${keys.join(",")}) VALUES ?`, [values]);
      await db.end();
    }

    // ✅ PostgreSQL
    else if (dbType === "postgres") {
      const client = new PgClient({ connectionString: connStr });
      await client.connect();
      for (const row of data) {
        const rowKeys = Object.keys(row);
        const values = Object.values(row);
        const placeholders = rowKeys.map((_, i) => `$${i + 1}`).join(",");
        await client.query(`INSERT INTO ${tableName} (${rowKeys.join(",")}) VALUES (${placeholders})`, values);
      }
      await client.end();
    }

    // ✅ MongoDB
    else if (dbType === "mongodb") {
      const client = new MongoClient(connStr);
      await client.connect();
      const db = client.db(); // ใช้ database จาก connStr
      const collection = db.collection(tableName);
      await collection.insertMany(data);
      await client.close();
    }

    // ✅ SQL Server
    else if (dbType === "mssql") {
      await sql.connect(connStr);
      for (const row of data) {
        const columns = Object.keys(row).map(k => `[${k}]`).join(",");
        const values = Object.values(row).map(v => (typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v)).join(",");
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        await sql.query(query);
      }
      await sql.close();
    }

    else {
      return NextResponse.json({ error: "Unsupported dbType" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }

  catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
