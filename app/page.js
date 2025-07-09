"use client";

import { useState } from "react";
import ExcelUpload from "../components/ExcelUpload";
import SheetSelector from "../components/SheetSelector";
import DataPreview from "../components/DataPreview";
import FieldMapper from "../components/FieldMapper";
import DatabaseSelector from "../components/DatabaseSelector";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function HomePage() {
  const [workbook, setWorkbook] = useState(null);
  const [sheetName, setSheetName] = useState("");
  const [data, setData] = useState([]);
  const [dbFields, setDbFields] = useState([]);
  const [mapping, setMapping] = useState({});

  const handleSheetSelect = (name) => {
    if (!workbook) return;
    setSheetName(name);
    const worksheet = workbook.Sheets[name];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setData(jsonData);
  };

  const fetchDbFields = async (dbType, connStr, tableName) => {
    const res = await fetch("/api/dbfields", {
      method: "POST",
      body: JSON.stringify({ dbType, connStr, tableName }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    setDbFields(result.fields || []);
  };

  const handleImport = async (dbType, connStr, tableName) => {
    const mappedData = data.map(row => {
      const newRow = {};
      Object.keys(mapping).forEach(k => {
        if (mapping[k]) newRow[mapping[k]] = row[k];
      });
      return newRow;
    });

    const res = await fetch("/api/import", {
      method: "POST",
      body: JSON.stringify({ dbType, connStr, tableName, data: mappedData }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    Swal.fire({
      icon: result.error ? "error" : "success",
      title: result.error ? "Error" : "Success",
      text: result.error || "Import completed successfully!",
      timer: 2000,
      showConfirmButton: false,
    });

  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">🌈 Excel Importer Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-8 border-pink-400">
          <h2 className="text-2xl font-semibold text-pink-600">📁 Upload Excel</h2>
          <ExcelUpload setWorkbook={setWorkbook} setSheetName={handleSheetSelect} />
          {workbook && (
            <SheetSelector workbook={workbook} onSelect={handleSheetSelect} />
          )}
        </div>

        {data.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-8 border-purple-400">
              <h2 className="text-2xl font-semibold text-purple-600">👁️ Data Preview</h2>
              <DataPreview data={data} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-8 border-green-400">
              <h2 className="text-2xl font-semibold text-green-600">🔗 Field Mapping</h2>
              <FieldMapper excelCols={Object.keys(data[0])} dbFields={dbFields} mapping={mapping} setMapping={setMapping} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-8 border-yellow-400">
              <h2 className="text-2xl font-semibold text-yellow-600">⚙️ Database Settings</h2>
              <DatabaseSelector onImport={handleImport} fetchDbFields={fetchDbFields} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
