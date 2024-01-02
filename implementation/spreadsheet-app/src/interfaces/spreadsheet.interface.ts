import { ISheet } from './sheet.interface';

/**
 * A spreadsheet, which is a container for sheets.
 */
export interface ISpreadSheet {
  /**
   * Initializes a sheet with a generated grid of empty cells for the spreadsheet
   * @param rowSize an optional param: a number representing how many rows should be in the sheet
   * @param colSize an optional param: a number representing how many columns should be in the sheet
   */
  createSheet(rowSize?: number, colSize?: number): void;
  /**
   * Given a specified sheet name, removes the sheet from the spreadsheet
   * @param sheetId the id of the sheet in the spreadsheet to remove
   * @throws an error if sheet does not exist in the spreadsheet or if attempting to
   * remove the last sheet
   */
  deleteSheet(sheetId: number): void;
  /**
   * Returns all current sheets inside this spreadsheet
   * @returns an array of sheets in the spreadsheet
   */
  getSheets(): Array<ISheet>;
  /**
   * Exports a specified sheet from the spreadsheet as a .csv file
   * @param id the id of the sheet on the spreadsheet to export as a .csv file
   * @returns a Blob, which is the physical csv file
   */
  exportSheet(id: number): Blob;
}
