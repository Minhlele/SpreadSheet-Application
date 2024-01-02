import { Position } from '../models/cellposition';
import { IExpression } from './expression.interface';
import { IObserver } from './observer.interface';

/**
 * Represents a cell on a sheet.
 */
export interface ICell extends IObserver {
  /**
   * Parses an input string as an expression and sets
   * the cell's value to that.
   * @param expression the input string representing the cell's value
   */
  setValue(expression: string): void;
  /**
   * Gets the cell's display, i.e. the cell's evaluated/simplified value
   * @returns the cell value's simplified value
   */
  getDisplay(): string;
  /**
   * Gets the cell's value, i.e. the original unevaluated input as an
   * expression of the cell's value
   * @returns an IExpression type representing the original input to this cell as a value
   */
  getValue(): IExpression;
  /**
   * Add a cell to the cell's observing array
   * @param cell the cell this cell is observing
   */
  addObserving(cell: ICell): void;
  /**
   * Subscribe an observer to this cell.
   * @param obs the observer to attach/subscribe
   */
  attachObserver(obs: IObserver): void;
  /**
   * Unsubscribe an observer from this cell.
   * @param obs the observer to delete/unsubscribe
   * @throws an error when an observer that doesn't exist in this cell is inputted
   */
  detachObserver(obs: IObserver): void;
  /**
   * Notify observers of a possible change to this cell's values.
   */
  notifyObservers(): void;
  /**
   * Returns observers that are subscribed to this cell.
   * @returns an array of cells that depend on this cell
   */
  getObservers(): Array<IObserver>;
  /**
   * Get this cell's current position on a sheet.
   * @returns a Position type, representing current position on a sheet
   */
  getPosition(): Position;
  /**
   * Sets this cell's position to a specified position on the sheet
   * @param row_id the row on the sheet to put the cell in
   * @param col_id the column on the sheet to put the cell in
   */
  changePosition(row_id: number, col_id: number): void;
  /**
   * Sets this cell's value to an empty string
   */
  clearCell(): void;
  /**
   * Gets a list of cells that this cell depends on
   * @returns this cell's dependencies
   */
  getObserving(): Array<ICell>;
  /**
   * Set dependencies for this cell
   * @param observing an array of dependencies to give to the cell
   */
  setObserving(observing: Array<ICell>): void;
  /**
   * Set this cell's bold formatting
   * @param status whether to turn bold formatting on or off for this cell
   */
  setIsBolded(status: boolean): void;
  /**
   * Set this cell's italics formatting
   * @param status whether to turn italics formatting on or off for this cell
   */
  setIsItalicized(status: boolean): void;
  /**
   * Set this cell's underline formatting
   * @param status whether to turn underline formatting on or off for this cell
   */
  setIsUnderlined(status: boolean): void;
  /**
   * Gets a boolean representing if the cell has been bolded
   * @return a boolean that represents if the cell is bolded
   */
  getIsBolded(): boolean;
  /**
   * Gets a boolean representing if the cell has been italicized
   * @return a boolean that represents if the cell is italicized
   */
  getIsItalicized(): boolean;
  /**
   * Gets a boolean representing if the cell has been underlined
   * @return a boolean that represents if the cell is underlined
   */
  getIsUnderlined(): boolean;
}
