/**
 * Represents an expression that a cell contains
 */
export interface IExpression {
  /**
   * Evaluates this expression into a primitive expression, if possible.
   * @returns an evaluated IExpression
   */
  getSimplifiedExpression(): IExpression;
  /**
   * Returns textual representation of this expression
   * @returns textual representation of this expression
   */
  toString(): string;
}
