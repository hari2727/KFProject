import * as XLSX from '@sheet/core';


export function getJson <T>(fileName:string){
  const filePath = `${__dirname}/${fileName}.csv`;
  const workBook = XLSX.readFile(filePath, { cellDates: true, cellText: false });
  
  const json = XLSX.utils.sheet_to_json<T>(workBook.Sheets[workBook.SheetNames[0]], { raw: true });

  return json;
}