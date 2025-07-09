import * as XLSX from "xlsx";

export default function ExcelUpload({ setWorkbook, setSheetName }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      setWorkbook(workbook);
      const firstSheet = workbook.SheetNames[0];
      setSheetName(firstSheet, workbook); // 👈 ส่ง workbook ไปด้วย
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}
