import { ICell } from '../interfaces/cell.interface';
import { IExpression } from '../interfaces/expression.interface';
import { IObserver } from '../interfaces/observer.interface';
import { Position } from './cellposition';
import { ExpressionFactory } from './expressions/expression-factory';
import { StringExpression } from './expressions/string-expression';
import { RangeExpressionType } from '../enums/range-expression-type.enum';
import { ErrorExpression } from './expressions/error-expression';

/**
 * Concrete class for a cell on a spreadsheet. May have any IExpression value type.
 * Has a display, which is a string representing evaluation of this cell's value.
 * May be formatted. Can be observed by others, and may observe other cells as
 * dependencies. Contains a position on a sheet.
 */
export class Cell implements ICell {
  private value: IExpression;
  private isBolded = false;
  private isItalicized = false;
  private isUnderlined = false;
  private display = '';
  private observers: Array<IObserver>;
  private observing: Array<ICell>;
  private position: Position;

  public constructor(
    position: Position,
    value: IExpression = new StringExpression(''),
    observers: Array<IObserver> = [],
    observing: Array<ICell> = []
  ) {
    this.position = position;
    this.value = value;
    this.evaluateValue(); // sets display based on value set
    this.observers = observers;
    this.observing = observing;
  }

  public getObserving(): Array<ICell> {
    return this.observing;
  }

  public setObserving(observing: Array<ICell>): void {
    this.observing = observing;
  }

  public clearCell(): void {
    // set true value to be empty string
    this.setValue('');
    // since this is now empty, it won't have cells that it observes
    this.observing = [];
    // notify cell that observe this cell
    this.update();
  }

  public setValue(value: string): void {
    if (value.startsWith('#')) {
      // Errors start with a pound
      value = value.substring(1, value.length);
      this.value = new ErrorExpression(value);
    } else {
      // If not an error, create the appropriate expression
      this.value = this.createExpression(value);
    }
    // simplify this cell's value for display, and let observers
    // know that we have changed our display
    this.update();
  }

  public update(): void {
    // refresh cell value so that changes in references are represented
    this.evaluateValue();

    // this cell might have a new value now, so notify it's observers
    if (this.observers.length > 0) {
      this.notifyObservers();
    }
  }

  public getDisplay(): string {
    return this.display;
  }

  public getValue(): IExpression {
    return this.value;
  }

  public addObserving(cell: ICell): void {
    this.observing.push(cell);
  }

  public attachObserver(obs: IObserver): void {
    this.observers.push(obs);
  }

  public detachObserver(obs: IObserver): void {
    // remove the observer from the list of observers
    this.observers = this.observers.filter((observer) => observer !== obs);
  }

  public notifyObservers(): void {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i].update();
    }
  }

  public getPosition(): Position {
    return this.position;
  }

  public changePosition(row_id: number, col_id: number): void {
    this.position = new Position(row_id, col_id);
  }

  public getObservers(): Array<IObserver> {
    return this.observers;
  }

  public setIsBolded(status: boolean): void {
    this.isBolded = status;
  }

  public setIsItalicized(status: boolean): void {
    this.isItalicized = status;
  }

  public setIsUnderlined(status: boolean): void {
    this.isUnderlined = status;
  }

  public getIsBolded(): boolean {
    return this.isBolded;
  }

  public getIsItalicized(): boolean {
    return this.isItalicized;
  }

  public getIsUnderlined(): boolean {
    return this.isUnderlined;
  }

  // ======= HELPERS =======

  /**
   * Simplifies a cell's value and sets the cell display
   * to that result
   */
  private evaluateValue(): void {
    this.display = this.value.getSimplifiedExpression().toString();
  }

  private createExpression(_value: string): IExpression {
    let expression: IExpression;
    const expressionFactory: ExpressionFactory = new ExpressionFactory();
    // programmatically create regex for detecting range expressions from enum list of supported range expression operations
    const rangeExpressionTypes: string =
      Object.values(RangeExpressionType).join('|');
    const rangeExprRegex = new RegExp(
      '^[=](' + rangeExpressionTypes + ')\\([A-Z][0-9]+\\.\\.[A-Z][0-9]+\\)$'
    );
    const refExprRegex = new RegExp('^(=REF\\()[A-Z]+[0-9]+\\)$');
    const functionExprRegex = new RegExp('^[=][(].+[)]$');
    const numberExprRegex = new RegExp('^-?\\d+(\\.\\d+)?$');
    if (_value.startsWith('=')) {
      // all complex expressions start with an equals sign.
      if (_value.match(rangeExprRegex)) {
        expression = expressionFactory.createRangeExpression(
          _value,
          this.observing
        );
      } else if (_value.match(refExprRegex)) {
        expression = expressionFactory.createReferenceExpression(
          _value,
          this.observing[0]
        );
      } else if (_value.match(functionExprRegex)) {
        expression = expressionFactory.createFunctionExpression(
          _value,
          this.observing
        );
      } else {
        // an invalid complex expression
        expression = expressionFactory.createErrorExpression(_value);
      }
    }
    // if an expression isn't complex, it's a primitive.
    else if (_value.match(numberExprRegex)) {
      expression = expressionFactory.createNumberExpression(_value);
    } else {
      expression = expressionFactory.createStringExpression(_value);
    }
    return expression;
  }
}
