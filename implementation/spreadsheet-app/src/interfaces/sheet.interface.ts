import { ICell } from './cell.interface';
import { Position } from '../models/cellposition';

/**
 * A sheet, which is a container for cells.
 */
export interface ISheet {
  /**
   * Returns the title of the sheet
   * @return the sheet title
   */
  getTitle(): string;
  /**
   * Gets a specified cell
   * @param row the row id where the cell is located
   * @param col the column id where the cell is located
   * @returns the specified cell
   */
  getCell(row: number, col: number): ICell;
  /**
   * Return the 2D array of cells that this sheet holds
   * @returns a 2D array of cells
   */
  getCellGrid(): Array<Array<ICell>>;
  /**
   * Inserts a row/column from a sheet
   * @param isRow flag to insert a row, if false, flags insertion of column
   * @param id the target row/col id for insertion
   * @throws Error if the row/column index is out of range
   */
  insert(isRow: boolean, id: number): void;
  /**
   * Deletes a row/column from a sheet
   * @param isRow flag to delete a row, if false, flags deletion of column
   * @param id the target row/col id for deletion
   *      * @throws Error if the row/column index is out of range
   */
  delete(isRow: boolean, id: number): void;
  /**
   * Sets the value of a specified cell
   * @param value the value expression as a string
   * @param row the row that the cell to be set resides in
   * @param column the column that the cell to be set resides in
   * @throws Error when trying to set an inaccessible cell (out of bounds)
   */
  setCellValue(cellCoord: Position, value: string): void;
  /**
   * Sets this sheet's title
   * @param title the desired title to set to this sheet
   */
  setTitle(title: string): void;
}
