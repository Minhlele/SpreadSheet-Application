import { IExpression } from '../../interfaces/expression.interface';
import { StringExpression } from './string-expression';

/**
 * A error expression type, which is a placeholder for expressions that have
 * malformed or invalid values
 */
export class ErrorExpression implements IExpression {
  private string: string;
  //private error: string;

  public constructor(
    expression: string
    //error: string
  ) {
    this.string = expression;
    //this.error = error;
  }

  public getSimplifiedExpression(): IExpression {
    // this is a primitive expression, it may not
    // be simplified any further.
    return new StringExpression('#ERROR!');
  }

  public toString(): string {
    return this.string;
  }
}
