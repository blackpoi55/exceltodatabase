import { useState } from "react";
import Swal from "sweetalert2";

export default function DatabaseSelector({ onImport, fetchDbFields }) {
    const [dbType, setDbType] = useState("mysql");
    const [connStr, setConnStr] = useState("");
    const [tableName, setTableName] = useState("");

    const testConnection = async () => {
        const res = await fetch("/api/testdb", {
            method: "POST",
            body: JSON.stringify({ dbType, connStr }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        Swal.fire({
            icon: result.error ? "error" : "success",
            title: result.error ? "❌ Connection Failed" : "✅ Connection Successful",
            text: result.error || "Database connected successfully!",
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const mockConnections = {
        mysql: [
            { label: "MySQL Localhost", value: "mysql://root:password@localhost:3306/mydatabase" },
            { label: "MySQL Cloud (PlanetScale)", value: "mysql://username:password@aws.connect.psdb.io/dbname" },
        ],
        postgres: [
            { label: "Postgres Localhost", value: "postgres://postgres:password@localhost:5432/mydatabase" },
            { label: "Postgres Cloud (Supabase)", value: "postgres://dbuser:dbpassword@db.supabase.co:5432/dbname" },
        ],
        mongodb: [
            { label: "MongoDB Localhost", value: "mongodb://localhost:27017/mydatabase" },
            { label: "MongoDB Atlas", value: "mongodb+srv://username:password@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority" },
        ],
        mssql: [
            { label: "SQL Server Localhost", value: "mssql://username:password@localhost:1433/mydatabase" },
        ]
    };

    return (
        <div className="space-y-2">
            <select value={dbType} onChange={(e) => setDbType(e.target.value)} className="border p-1 w-full">
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="mssql">SQL Server</option>
            </select>

            {/* 🔥 Mock connection string selector */}
            <select
                onChange={(e) => setConnStr(e.target.value)}
                className="border p-1 w-full"
            >
                <option value="">-- เลือก mock connection string --</option>
                {mockConnections[dbType].map((opt) => (
                    <option key={opt.label} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <input
                value={connStr}
                onChange={(e) => setConnStr(e.target.value)}
                placeholder="Connection String"
                className="border p-1 w-full"
            />
            <input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Table Name"
                className="border p-1 w-full"
            />

            <div className="flex flex-wrap gap-2">
                <button onClick={testConnection} className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow">Test Connection</button>
                <button onClick={() => fetchDbFields(dbType, connStr, tableName)} className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white shadow">Fetch Fields</button>
                <button onClick={() => onImport(dbType, connStr, tableName)} className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white shadow">Import</button>
            </div>
        </div>
    );
}
