import { ISheet } from '../interfaces/sheet.interface';
import { Sheet } from './sheet';
import { ISpreadSheet } from '../interfaces/spreadsheet.interface';
import { ICell } from '../interfaces/cell.interface';
import { DEFAULT_COLUMNS, DEFAULT_ROWS } from './constants';

/**
 * A spreadsheet, which contains a list of sheets, and always has one sheet.
 */
export class SpreadSheet implements ISpreadSheet {
  private sheets: Array<ISheet>;
  private sheetNumberTracker: number;

  public constructor(sheets: Array<ISheet> = []) {
    if (sheets.length === 0) {
      this.sheets = [new Sheet('0')];
    } else {
      this.sheets = sheets;
    }
    this.sheetNumberTracker = 1;
  }

  public createSheet(
    rowSize: number = DEFAULT_ROWS,
    colSize: number = DEFAULT_COLUMNS
  ): void {
    // default name for a sheet should the value of the sheetNumberTracker
    this.sheets.push(
      new Sheet(this.sheetNumberTracker.toString(10), rowSize, colSize)
    );
    this.sheetNumberTracker++;
  }

  public deleteSheet(sheetId: number): void {
    if (this.sheets.length < 2) {
      throw new Error('Spreadsheet must have at least one sheet');
    }
    if (sheetId < 0 || sheetId >= this.sheets.length) {
      throw new Error(`Sheet ${sheetId} does not exist in spreadsheet!`);
    }
    this.sheets.splice(sheetId, 1);
  }

  public getSheets(): Array<ISheet> {
    return this.sheets;
  }

  public exportSheet(id: number): Blob {
    let csvContents = '';
    if (id < 0 || id >= this.sheets.length) {
      throw new Error(
        `Sheet with the id: ${id} cannot be exported because it does not exist on the spreadsheet!`
      );
    }
    csvContents = this.sheetToCSVString(this.sheets[id]);
    // construct the file for download from csv content
    const blob: Blob = new Blob([csvContents], {
      type: 'text/csv;charset=utf-8;',
    });
    return blob;
  }

  // ======= HELPERS =======

  /**
   * Helper function that parses a given sheet and returns it as contents for a
   * .csv file
   * @param sheet the sheet to parse
   * @returns a string that represents the contents of a .csv file
   * @throws Error if the provided sheet is null
   */
  private sheetToCSVString(sheet: ISheet): string {
    if (!sheet) {
      throw new Error(`Sheet to parse is null!`);
    }
    let result = ''; // csv body content, return target
    const cells: Array<Array<ICell>> = sheet.getCellGrid();
    const colLength: number = cells[0].length;
    const rowLength: number = cells.length;
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        let cellValue: string = cells[i][j].getValue().toString();
        if (cellValue.includes(',') || cellValue.includes('"')) {
          // If the cell contains a comma or double quote, wrap the cell value in double quotes
          // And replace any existing double quotes in the cell data with two double quotes
          cellValue = `"${cellValue.replace(/"/g, '""')}"`;
        }
        result += cellValue; // append to csv body content
        if (j !== colLength - 1) {
          // separate entries with a comma
          result += ',';
        } else {
          // ... unless if it's the last entry on this row, then separate with a newline
          result += '\n';
        }
      }
    }
    return result;
  }
}
