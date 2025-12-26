import { Workbook } from 'exceljs';

interface File {
  mimetype: string;
  buffer: Buffer;
}

export enum WorkbookType {
  XLSX = 'xlsx',
  CSV = 'csv',
}

export const createFileFromWorkbook = async (workbook: Workbook, type = WorkbookType.XLSX) => {
  // TODO: Add typings
  const file = {} as any;
  file.mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  file.buffer =
    type === WorkbookType.XLSX
      ? await workbook.xlsx.writeBuffer()
      : await await workbook.csv.writeBuffer();
  return file;
};
