import { ICell } from '../../interfaces/cell.interface';
import { IExpression } from '../../interfaces/expression.interface';
import { ErrorExpression } from './error-expression';
import { NumberExpression } from './number-expression';

/**
 * A range expression type. Takes on the format of RANGEEXPRFN(CELL1..CELLN).
 * ex. AVG(A1..A7) or SUM(B3..F3). 2D ranges are acceptable too. Ranges must start
 * left to right and/or top to bottom.
 */
export class RangeExpression implements IExpression {
  private rangeExpr: string;
  private referenced: Array<ICell>; // range of cells to operate on

  public constructor(rangeExpr: string, referenced: Array<ICell>) {
    this.rangeExpr = rangeExpr;
    this.referenced = referenced;
  }

  public getSimplifiedExpression(): IExpression {
    // Determine the type of range expression (SUM or AVG)
    let rangeType = this.stripFunction(this.rangeExpr);
    rangeType = rangeType.split('(')[0];
    // Calculate the result based on the range type
    let result: number;
    if (rangeType === 'SUM') {
      result = this.calculateSum();
    } else if (rangeType === 'AVG') {
      result = this.calculateAverage();
    } else {
      return new ErrorExpression('#RANGEXPR!');
    }

    // Return the result as a NumberExpression
    if (isNaN(result)) {
      return new ErrorExpression('#INVLREXPR!');
    }
    return new NumberExpression(result.toString());
  }

  public toString(): string {
    return this.rangeExpr;
  }

  // ======= HELPERS =======
  /**
   * Calculates the sum of the referenced cells.
   * @returns
   */
  private calculateSum(): number {
    let sum = 0;
    for (const ref of this.referenced) {
      sum += Number(ref.getDisplay());
    }

    return sum;
  }

  /**
   * Calculates the average of the referenced cells.
   * @returns
   */
  private calculateAverage(): number {
    const sum = this.calculateSum();
    return sum / this.referenced.length;
  }

  /**
   * StripFunction to remove the = sign from the function
   * @param func
   * @returns
   */
  private stripFunction(func: string): string {
    if (func.charAt(0) === '=') {
      return func.substring(1, func.length);
    } else {
      return func;
    }
  }
}
