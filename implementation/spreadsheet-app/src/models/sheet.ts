import { ICell } from '../interfaces/cell.interface';
import { ISheet } from '../interfaces/sheet.interface';
import { Cell } from './cell';
import { Position } from './cellposition';
import { DEFAULT_ROWS, DEFAULT_COLUMNS } from './constants';
import { StringExpression } from './expressions/string-expression';
import { ErrorExpression } from './expressions/error-expression';

/**
 * A named sheet, which contains a grid of cells.
 */
export class Sheet implements ISheet {
  private title: string;
  private cellGrid: Array<Array<ICell>>;

  public constructor(
    title = '',
    rowSize: number = DEFAULT_ROWS,
    colSize: number = DEFAULT_COLUMNS
  ) {
    this.title = title;
    this.cellGrid = this.createGrid(rowSize, colSize);
  }

  public getCellGrid(): ICell[][] {
    return this.cellGrid;
  }

  public getTitle(): string {
    return this.title;
  }

  public getCell(row: number, col: number): ICell {
    if (
      row >= 0 &&
      row < this.cellGrid.length &&
      col >= 0 &&
      col < this.cellGrid[row].length
    ) {
      return this.cellGrid[row][col];
    } else {
      // Return a default or error cell object
      return new Cell(
        new Position(row, col),
        new ErrorExpression('#OUTOFRANGE!')
      );
    }
  }

  public insert(isRow: boolean, id: number): void {
    if (isRow) {
      if (id < 0 || id > this.cellGrid.length) {
        throw new Error('Row index out of range');
      }
      this.insertRow(id);
    } else {
      // Assume all rows have the same number of columns
      if (id < 0 || id > (this.cellGrid[0] ? this.cellGrid[0].length : 0)) {
        throw new Error('Column index out of range');
      }
      this.insertColumn(id);
    }
    this.updateGrid(this.cellGrid);
  }

  public delete(isRow: boolean, id: number): void {
    if (isRow) {
      if (id < 0 || id >= this.cellGrid.length) {
        throw new Error('Row index out of range');
      }
      this.deleteRow(id);
    } else {
      // Assume all rows have the same number of columns for simplicity
      if (id < 0 || id >= (this.cellGrid[0] ? this.cellGrid[0].length : 0)) {
        throw new Error('Column index out of range');
      }
      this.deleteColumn(id);
    }
    this.updateGrid(this.cellGrid);
  }

  public setCellValue(cellCoord: Position, value: string): void {
    value.replace(/\s/g, ''); // Assign the result back to value
    const cell = this.getCell(cellCoord.getRowId(), cellCoord.getColumnId());
    // Clear previous observing
    const observing: Array<ICell> = cell.getObserving();
    observing.forEach((observed_cell) => observed_cell.detachObserver(cell));
    if (value.charAt(0) === '=') {
      try {
        this.parseExpressionForReferences(value, cell);
        this.parseExpressionForObservers(cell, value);
      } catch (err) {
        cell.setValue(new ErrorExpression('#' + value).toString());
        return;
      }
    } else {
      cell.setObserving(new Array<ICell>());
    }
    cell.setValue(value);
  }

  public setTitle(title: string) {
    this.title = title;
  }

  // ======= HELPERS =======

  /**
   * Function to delete a given row
   * @param id the target row id
   */
  private deleteRow(id: number): void {
    // remove row at the specify index
    const deletedRow: ICell[][] = this.cellGrid.splice(id, 1);
    // go through each cell in the deleted row and clear cell
    deletedRow.forEach((row) => {
      row.forEach((cell) => {
        cell.clearCell();
      });
    });
    // Update position of remaining cells
    for (let rowIndex = id; rowIndex < this.cellGrid.length; rowIndex++) {
      this.cellGrid[rowIndex].forEach((cell) => {
        cell.changePosition(rowIndex, cell.getPosition().getColumnId());
      });
    }
  }

  /**
   * Function to insert a given row
   * @param id the target row id
   */
  private insertRow(id: number): void {
    // create a new row with cells
    const newCellRow: Array<ICell> = [];
    for (let colIndex = 0; colIndex < this.cellGrid[0].length; colIndex++) {
      // Creating a new Cell object with a  position based on currrent row_id and colIndex
      newCellRow.push(new Cell(new Position(id, colIndex)));
    }

    //Insert the new row into cell grid at the specified row_id
    this.cellGrid.splice(id, 0, newCellRow);

    //Update the cell position of the rows below
    for (let rowIndex = id + 1; rowIndex < this.cellGrid.length; rowIndex++) {
      this.cellGrid[rowIndex].forEach((cell) => {
        cell.changePosition(rowIndex, cell.getPosition().getColumnId());
      });
    }
  }
  /**
   * Function to insert a given col
   * @param id the target col id
   */
  private insertColumn(id: number) {
    for (let rowIndex = 0; rowIndex < this.cellGrid.length; rowIndex++) {
      const newCell = new Cell(
        new Position(rowIndex, id),
        new StringExpression('')
      );
      const row = this.cellGrid[rowIndex];
      row.splice(id, 0, newCell);

      for (let colIndex = id + 1; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        cell.changePosition(rowIndex, colIndex);
      }
    }
  }

  /**
   * Traverse a cell grid and update cell values
   * @param cellGrid the cell grid
   */
  private updateGrid(cellGrid: Array<Array<ICell>>): void {
    for (let rowIndex = 0; rowIndex < cellGrid.length; rowIndex++) {
      const row = cellGrid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        this.setCellValue(
          new Position(rowIndex, colIndex),
          cell.getValue().toString()
        );
      }
    }
  }

  /**
   * Function to delete a given column
   * @param id the target column id
   */
  private deleteColumn(id: number): void {
    for (let rowIndex = 0; rowIndex < this.cellGrid.length; rowIndex++) {
      const row = this.cellGrid[rowIndex];
      // Delete the given column and shift the consecutive column to the left

      const deletedColumn: ICell[] = row.splice(id, 1);
      // go through each cell in the deleted column and clear cell
      deletedColumn.forEach((cell) => {
        cell.clearCell();
      });

      // Update position of remaining cells in the row
      for (let colIndex = id; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        cell.changePosition(rowIndex, colIndex);
      }
    }
  }

  /**
   * Converting a cell's letter-number coordinate to a numerical cell id
   * @param cellCoord the letter-number coordinate
   * @returns a cell coordinates as a pair of numbers
   */
  private getCellId(cellCoord: string): { rowIndex: number; colIndex: number } {
    // Convert A1 -> 0,0
    const colIndex = cellCoord.charCodeAt(0) - 65;
    const rowIndex = parseInt(cellCoord.substring(1)) - 1;
    return { rowIndex, colIndex };
  }

  /**
   * Strips the REF(..) function header and returns the cell coordinate
   * @param ref the cell reference expression
   * @returns the letter-number cell coordinate
   */
  private handleRefSymbol(ref: string): string {
    return ref.replace(/REF\(([^)]+)\)/g, '$1');
  }

  /**
   * Initialize the sheet with empty cells.
   * @param rowSize the desired row size
   * @param colSize the desired col size
   * @returns a grid of cells
   */
  private createGrid(rowSize: number, colSize: number): Array<Array<ICell>> {
    const cellGrid: Array<Array<ICell>> = [[]];

    for (let i = 0; i < rowSize; i++) {
      cellGrid[i] = [];
      for (let j = 0; j < colSize; j++) {
        cellGrid[i][j] = new Cell(new Position(i, j));
      }
    }
    return cellGrid;
  }

  /**
   * go through the expression and attach the references to the cell
   * @param expression the expression to parse for references
   * @param givenCell the cell where the expression is being entered
   * @throws Error if a circular reference is found
   */
  private parseExpressionForReferences(
    expression: string,
    givenCell: ICell
  ): void {
    const references: Array<ICell> = [];

    // Updated range regex to capture multi-row and multi-column ranges
    const rangeRegex = /(SUM|AVG)\(([A-Z]+\d+)\.\.([A-Z]+\d+)\)/g;
    let modifiedExpression = expression;

    let rangeMatch;
    while ((rangeMatch = rangeRegex.exec(expression)) !== null) {
      const startRef = rangeMatch[2];
      const endRef = rangeMatch[3];
      const cellRefsInRange = this.getCellRefsInRange(startRef, endRef);
      cellRefsInRange.forEach((ref) => {
        const { rowIndex, colIndex } = this.getCellId(ref);
        const cell = this.getCell(rowIndex, colIndex);
        if (cell === givenCell) {
          throw new Error('Circular reference detected');
        }
        if (!references.includes(cell)) {
          references.push(cell);
        }
      });

      // Replace processed range in the modified expression
      modifiedExpression = modifiedExpression.replace(rangeMatch[0], '');
    }

    // Logic to handle individual references
    const value: string = this.handleRefSymbol(modifiedExpression);
    const regex = /\b[A-Z]\d+\b/g;
    let match;
    while ((match = regex.exec(value)) !== null) {
      const { rowIndex, colIndex } = this.getCellId(match[0]);
      const cell = this.getCell(rowIndex, colIndex);
      if (cell === givenCell) {
        throw new Error('Circular reference detected');
      }
      if (!references.includes(cell)) {
        references.push(cell);
      }
    }

    if (this.detectCircularReference(givenCell, references)) {
      throw new Error('Circular reference detected');
    }

    // Set the observing cells
    givenCell.setObserving(references);
  }

  /**
   * Go through the expression and attach the observers to the cell
   * @param calling_cell the cell that is calling the expression
   * @param expression   the expression to parse
   * @throws Error when circular reference is detected
   */
  private parseExpressionForObservers(
    calling_cell: ICell,
    expression: string
  ): void {
    const value: string = this.handleRefSymbol(expression);
    const regex = /\b[A-Z]\d+\b/g; // This will match individual cell references like A1, B2, etc.
    const rangeRegex = /\b([A-Z]\d+)\.\.([A-Z]\d+)\b/g; // This will match range expressions like A1..B3

    let match;
    // First, handle individual cell references
    while ((match = regex.exec(value)) !== null) {
      const { rowIndex, colIndex } = this.getCellId(match[0]);
      const cell = this.getCell(rowIndex, colIndex);
      if (cell === calling_cell) {
        throw new Error(
          'Circular reference detected: A cell cannot observe itself.'
        );
      }
      if (!cell.getObservers().includes(calling_cell)) {
        cell.attachObserver(calling_cell);
      }
    }

    // Then, handle range expressions
    let rangeMatch;
    while ((rangeMatch = rangeRegex.exec(value)) !== null) {
      const startCellRef = rangeMatch[1];
      const endCellRef = rangeMatch[2];
      const startCellCoords = this.getCellId(startCellRef);
      const endCellCoords = this.getCellId(endCellRef);

      // Iterate through each cell in the range and attach the observer
      for (
        let row = startCellCoords.rowIndex;
        row <= endCellCoords.rowIndex;
        row++
      ) {
        for (
          let col = startCellCoords.colIndex;
          col <= endCellCoords.colIndex;
          col++
        ) {
          const cellInRange = this.getCell(row, col);
          if (cellInRange === calling_cell) {
            throw new Error(
              'Circular reference detected: A cell cannot observe itself.'
            );
          }
          if (!cellInRange.getObservers().includes(calling_cell)) {
            cellInRange.attachObserver(calling_cell);
          }
        }
      }
    }
    if (
      this.detectCircularReference(calling_cell, calling_cell.getObserving())
    ) {
      throw new Error(
        'Circular reference detected: A cell cannot observe itself.'
      );
    }
  }

  /**
   * Get list of cell references in a range
   * @param startCell the starting cell in a range expression
   * @param endCell the ending cell in a range expression
   * @returns list of cell references
   * @throws an error if the cells reference format is misalligned
   */
  private getCellRefsInRange(startCell: string, endCell: string): string[] {
    const startColMatch = startCell.match(/[A-Z]+/);
    const startRowMatch = startCell.match(/\d+/);
    const endColMatch = endCell.match(/[A-Z]+/);
    const endRowMatch = endCell.match(/\d+/);

    if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
      throw new Error('Invalid cell reference format.');
    }

    const startColIndex = startColMatch[0].charCodeAt(0);
    const startRowIndex = parseInt(startRowMatch[0]);
    const endColIndex = endColMatch[0].charCodeAt(0);
    const endRowIndex = parseInt(endRowMatch[0]);

    const cellRefs: string[] = [];
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        const colLetter = String.fromCharCode(colIndex);
        cellRefs.push(`${colLetter}${rowIndex}`);
      }
    }

    return cellRefs;
  }

  /**
   * Returns a boolean if a circular reference occurs in a given cell
   * @param givenCell the target cell for detecting circular references
   * @param references references that were targetted to put in the target cell
   * @returns a boolean statement if there is a circular reference
   */
  private detectCircularReference(
    givenCell: ICell,
    references: Array<ICell>
  ): boolean {
    if (references.includes(givenCell)) {
      // Direct circular reference detected
      return true;
    }

    for (const refCell of references) {
      if (refCell.getObserving().includes(givenCell)) {
        // Indirect circular reference detected
        return true;
      }
    }
    return false;
  }
}
