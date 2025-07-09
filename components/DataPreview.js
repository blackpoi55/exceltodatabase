export default function DataPreview({ data }) {
  const keys = Object.keys(data[0] || {});
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
          <tr>
            {keys.map(k => (
              <th key={k} className="px-3 py-2 text-left font-bold text-gray-700 whitespace-nowrap">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 20).map((row, i) => (
            <tr key={i}>
              {keys.map(k => (
                <td key={k} className="px-3 py-1 whitespace-nowrap">
                  {String(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 20 && (
        <div className="text-right text-xs text-gray-500 px-2 py-1">
          Showing first 20 rows of {data.length}
        </div>
      )}
    </div>
  );
}
