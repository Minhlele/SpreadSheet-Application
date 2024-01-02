import { ErrorExpression } from '../models/expressions/error-expression';
import { FunctionExpression } from '../models/expressions/function-expression';
import { NumberExpression } from '../models/expressions/number-expression';
import { RangeExpression } from '../models/expressions/range-expression';
import { ReferenceExpression } from '../models/expressions/reference-expression';
import { StringExpression } from '../models/expressions/string-expression';
import { ICell } from './cell.interface';

/**
 * A factory that creates expressions by parsing a expression value string
 */
export interface IExpressionFactory {
  /**
   * Creates a string expression, input must be either purely alphabetical
   * and/or enclosed in quotations otherwise.
   * @param string the string to turn into a string expression
   * @returns a StringExpression
   */
  createStringExpression(string: string): StringExpression;
  /**
   * Creates a number expression.
   * @param number the string to turn into a number expression.
   * @returns a NumberExpression
   */
  createNumberExpression(number: string): NumberExpression;
  /**
   * Creates a function expression, represented by =(OPERATIONS), where
   * operations may contain n amount of operands and n-1 amount of operators.
   * May reference other cell values.
   * @param func the string to turn into a function expression
   * @param referenced the dependencies that this function requires
   * @returns a FunctionExpression
   */
  createFunctionExpression(
    func: string,
    referenced: Array<ICell>
  ): FunctionExpression;
  /**
   * Creates a range expression, represented by =RANGEOPERATION(CELL1..CELL2),
   * where RANGEOPERATION are any range operation types represented in the range
   * expression type enum, and CELL1/2 are the cell coordinate as a letter-number
   * pair. Cell range must be 1 dimensional, meaning that they only span across
   * rows or columns. References other cell values.
   * @param rangeExpr the string to turn into a range expression
   * @param referenced the dependencies that this function requires
   * @returns a RangeExpression
   */
  createRangeExpression(
    rangeExpr: string,
    referenced: Array<ICell>
  ): RangeExpression;
  /**
   * Creates a cell reference expression, represented by =REF(CELL), where
   * CELL is the cell coordinate (as a letter-number pair) to be referenced.
   * @param ref the string to turn into a reference expression
   * @param referenced the cell that this expression references as a dependency
   * @returns a ReferenceExpression
   */
  createReferenceExpression(
    ref: string,
    referenced: ICell
  ): ReferenceExpression;
  /**
   * Creates an error expression, used to represent invalid values or results
   * for malformed expressions.
   * @param error the error message to create an ErrorExpression out of
   * @returns an ErrorExpression
   */
  createErrorExpression(error: string): ErrorExpression;
}
