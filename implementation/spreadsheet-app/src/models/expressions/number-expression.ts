import { IExpression } from '../../interfaces/expression.interface';

/**
 * A primitive expression type, a number.
 */
export class NumberExpression implements IExpression {
  private number: number;

  public constructor(expression: string) {
    this.number = +expression;
  }

  public getSimplifiedExpression(): IExpression {
    // this is a primitive expression, it may not
    // be simplified any further.
    return this;
  }

  public toString(): string {
    return this.number.toString();
  }
}
