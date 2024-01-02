import { IExpressionFactory } from '../../interfaces/expression-factory.interface';
import { NumberExpression } from './number-expression';
import { StringExpression } from './string-expression';
import { RangeExpression } from './range-expression';
import { FunctionExpression } from './function-expression';
import { ReferenceExpression } from './reference-expression';
import { ICell } from '../../interfaces/cell.interface';
import { ErrorExpression } from './error-expression';

/**
 * Concrete class for IExpressionFactory, which, given a string,
 * creates an IExpression instance.
 */
export class ExpressionFactory implements IExpressionFactory {
  public createReferenceExpression(
    ref: string,
    referenced: ICell
  ): ReferenceExpression {
    return new ReferenceExpression(ref, referenced);
  }

  public createStringExpression(string: string): StringExpression {
    return new StringExpression(string);
  }

  public createNumberExpression(number: string): NumberExpression {
    return new NumberExpression(number);
  }

  public createFunctionExpression(
    func: string,
    referenced: Array<ICell>
  ): FunctionExpression {
    return new FunctionExpression(func, referenced);
  }

  public createRangeExpression(
    rangeExpr: string,
    referenced: Array<ICell>
  ): RangeExpression {
    return new RangeExpression(rangeExpr, referenced);
  }

  public createErrorExpression(error: string): ErrorExpression {
    return new ErrorExpression(error);
  }
}
