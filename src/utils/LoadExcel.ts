import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { setStateFunctionType } from "../types/type";
import XLSX from "xlsx";
import { insertFile } from "./InsertSlate";

export const LoadExcel = async (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  const { files } = event.target;
  if (!files) {
    return;
  }
  const [excelFile] = files;
  if (!excelFile || !excelFile.name.endsWith(".xlsx")) {
    return;
  }

  const readExcelFile = async () => {
    const excelData = await excelFile.arrayBuffer();
    const workbook = XLSX.read(excelData);
    /* 전체 시트 순회 */
    const extractedTextArray = workbook.SheetNames.map((sheet) => {
      const sheetData = workbook.Sheets[sheet];
      if (sheetData) {
        const sheetText = XLSX.utils.sheet_to_txt(sheetData);
        return sheetText;
      }
    });
    return extractedTextArray.join("\n");
  };
  const textContents = await readExcelFile();
  insertFile(editor, textContents, setStateFunction);
};
