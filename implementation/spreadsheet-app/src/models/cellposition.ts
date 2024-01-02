/**
 * A cell's 2D position on a sheet.
 */
export class Position {
  private row_id: number;
  private col_id: number;

  public constructor(row_id: number, col_id: number) {
    this.row_id = row_id;
    this.col_id = col_id;
  }

  public getRowId(): number {
    return this.row_id;
  }

  public getColumnId(): number {
    return this.col_id;
  }

  public toString(): string {
    const colName = this.getColumnString(this.col_id);
    return `${colName}${this.row_id + 1}`;
  }

  /**
   * Get's the column coordinate as letter(s)
   * @param column the column id
   * @returns a letter representing the id
   */
  private getColumnString(column: number): string {
    let columnName = '';
    while (column >= 0) {
      const remainder = column % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      column = Math.floor(column / 26) - 1;
    }
    return columnName;
  }
}
