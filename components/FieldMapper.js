export default function FieldMapper({ excelCols, dbFields, mapping, setMapping }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {excelCols.map((col) => (
        <div key={col}>
          <div>{col}</div>
          <select
            className="border p-1"
            value={mapping[col] || ""}
            onChange={(e) =>
              setMapping((prev) => ({ ...prev, [col]: e.target.value }))
            }
          >
            <option value="">-- เลือก field --</option>
            {dbFields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
