import { ICell } from '../../interfaces/cell.interface';
import { IExpression } from '../../interfaces/expression.interface';
import { StringExpression } from './string-expression';

/**
 * A reference expression type, which takes the form REF({Cell Position}})
 */
export class ReferenceExpression implements IExpression {
  private refExpr: string;
  private referenced: ICell;

  public constructor(refExpr: string, referenced: ICell) {
    this.refExpr = refExpr;
    this.referenced = referenced;
  }

  public getSimplifiedExpression(): IExpression {
    return new StringExpression(this.referenced.getDisplay());
  }

  public toString(): string {
    return this.refExpr;
  }
}
