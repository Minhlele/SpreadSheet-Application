import { IExpression } from '../../interfaces/expression.interface';

/**
 * A primitive expression type, a string. Also represents an empty
 * expression. Must be represented as all alphabetical characters or
 * with quotations if otherwise.
 */
export class StringExpression implements IExpression {
  private string: string;

  public constructor(expression: string) {
    this.string = expression;
  }

  public getSimplifiedExpression(): IExpression {
    // this is a primitive expression, it may not
    // be simplified any further.
    return this;
  }

  public toString(): string {
    return this.string;
  }
}
