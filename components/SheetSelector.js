export default function SheetSelector({ workbook, onSelect }) {
  return (
    <div className="space-x-2">
      {workbook.SheetNames.map((name) => (
        <button key={name} onClick={() => onSelect(name)} className="px-2 py-1 bg-blue-500 text-white rounded">
          {name}
        </button>
      ))}
    </div>
  );
}
