import { ICell } from '../interfaces/cell.interface';
import { Parser } from 'hot-formula-parser';
import { Cell } from './cell';
import { Position } from './cellposition';
import { StringExpression } from './expressions/string-expression';
import { NumberExpression } from './expressions/number-expression';
import { FunctionExpression } from './expressions/function-expression';
import { RangeExpression } from './expressions/range-expression';
import { ReferenceExpression } from './expressions/reference-expression';
import { ErrorExpression } from './expressions/error-expression';

describe('Cell', (): void => {
  let cell: ICell;
  let defaultPosition: Position;
  beforeEach((): void => {
    defaultPosition = new Position(0, 0);
    cell = new Cell(defaultPosition);
  });

  it(
    'should have a value of a blank StringExpression and display as an empty string by' +
      ' default',
    (): void => {
      const blankStrExpr: StringExpression = new StringExpression('');

      expect(cell.getDisplay()).toEqual('');
      expect(cell.getValue()).toEqual(blankStrExpr);
    }
  );

  it(
    'should have the value of a NumberExpression of 9, and display as 9 when value of cell is' +
      ' set to "9"',
    (): void => {
      cell.setValue('9');

      const nineNumExpr: NumberExpression = new NumberExpression('9');

      expect(cell.getDisplay()).toEqual('9');
      expect(cell.getValue()).toEqual(nineNumExpr);
    }
  );

  it(
    'should have the value of a StringExpression of 9B, and display as 9B when value of cell is' +
      ' set to "9B"',
    (): void => {
      cell.setValue('9B');

      const nineBNumExpr: StringExpression = new StringExpression('9B');

      expect(cell.getDisplay()).toEqual('9B');
      expect(cell.getValue()).toEqual(nineBNumExpr);
    }
  );

  it('should have the value (NumberExpression of 2) of another cell when the parent cell is referring to it', (): void => {
    // set up mock cell to refer to
    const otherCellPosition: Position = new Position(4, 2); // Position is C5
    const otherCellValue: NumberExpression = new NumberExpression('2');
    const otherCell: ICell = new Cell(otherCellPosition, otherCellValue);
    const observing: Array<ICell> = new Array<ICell>(otherCell);
    // set our cell to observe a mock C5 cell, then set it to be a cell
    cell.setObserving(observing);
    cell.setValue('=REF(C5)');

    const expectedCellValue: ReferenceExpression = new ReferenceExpression(
      '=REF(C5)',
      otherCell
    );

    expect(cell.getDisplay()).toEqual('2');
    expect(cell.getValue()).toEqual(expectedCellValue);
  });

  it('should have the value StringExpression of "REF(C5)" when calling a reference expression erronously', (): void => {
    cell.setValue('"REF(C5)"');

    const strExpression: StringExpression = new StringExpression('"REF(C5)"');

    expect(cell.getDisplay()).toEqual('"REF(C5)"');
    expect(cell.getValue()).toEqual(strExpression);
  });

  it(
    'should have the value RangeExpression of "SUM(C1..C3)", where C1 to C3 are NumberExpressions 1, 2, and 3 respectively' +
      ' and the display value of the range expression is "6"',
    (): void => {
      // mock cells C1 to C3 have values of NumberExpressions 1, 2, 3 respectively.
      // C1
      const C1Position: Position = new Position(2, 0);
      const C1Value: NumberExpression = new NumberExpression('1');
      const C1: Cell = new Cell(C1Position, C1Value);
      // C2
      const C2Position: Position = new Position(2, 1);
      const C2Value: NumberExpression = new NumberExpression('2');
      const C2: Cell = new Cell(C2Position, C2Value);
      // C3
      const C3Position: Position = new Position(2, 2);
      const C3Value: NumberExpression = new NumberExpression('3');
      const C3: Cell = new Cell(C3Position, C3Value);
      // set up our cell to be a range expression that sums C1 to C3
      const observing: Array<Cell> = new Array<Cell>(C1, C2, C3); // our cell is observing C1 to C3
      cell.setObserving(observing);
      cell.setValue('=SUM(C1..C3)');

      const expectedCellValue: RangeExpression = new RangeExpression(
        '=SUM(C1..C3)',
        observing
      );

      expect(cell.getDisplay()).toEqual('6');
      expect(cell.getValue()).toEqual(expectedCellValue);
    }
  );

  it(
    'should have the value RangeExpression of "AVG(C1..C3)", where C1 to C3 are NumberExpressions 1, 2, and 3 respectively' +
      ' and the display value of the range expression is "2"',
    (): void => {
      // mock cells C1 to C3 have values of NumberExpressions 1, 2, 3 respectively.
      // C1
      const C1Position: Position = new Position(2, 0);
      const C1Value: NumberExpression = new NumberExpression('1');
      const C1: Cell = new Cell(C1Position, C1Value);
      // C2
      const C2Position: Position = new Position(2, 1);
      const C2Value: NumberExpression = new NumberExpression('2');
      const C2: Cell = new Cell(C2Position, C2Value);
      // C3
      const C3Position: Position = new Position(2, 2);
      const C3Value: NumberExpression = new NumberExpression('3');
      const C3: Cell = new Cell(C3Position, C3Value);
      // set up our cell to be a range expression that sums C1 to C3
      const observing: Array<Cell> = new Array<Cell>(C1, C2, C3); // our cell is observing C1 to C3
      cell.setObserving(observing);
      cell.setValue('=AVG(C1..C3)');

      const expectedCellValue: RangeExpression = new RangeExpression(
        '=AVG(C1..C3)',
        observing
      );

      expect(cell.getDisplay()).toEqual('2');
      expect(cell.getValue()).toEqual(expectedCellValue);
    }
  );

  it(
    'should evaluate a function with a singular cell reference (C5, with a value of 2) only' +
      'and have the same display as the cell it is referencing',
    (): void => {
      // set up mock cell to refer to
      const otherCellPosition: Position = new Position(4, 2); // Position is C5
      const otherCellValue: NumberExpression = new NumberExpression('2');
      const otherCell: ICell = new Cell(otherCellPosition, otherCellValue);
      const observing: Array<ICell> = new Array<ICell>(otherCell);
      // set our cell to observe a mock C5 cell, then set it to be a cell
      cell.setObserving(observing);
      cell.setValue('=(REF(C5))');

      const expectedCellValue: FunctionExpression = new FunctionExpression(
        '=(REF(C5))',
        observing
      );

      expect(cell.getDisplay()).toEqual('2');
      expect(cell.getValue()).toEqual(expectedCellValue);
    }
  );
});

describe('FunctionExpression', (): void => {
  let functionExpression: FunctionExpression;
  let cells: Array<ICell>;
  let cellA1: ICell;
  let cellA2: ICell;

  beforeEach((): void => {
    cellA1 = new Cell(new Position(0, 0), new NumberExpression('1'));
    cellA2 = new Cell(new Position(0, 1), new NumberExpression('2'));
    cells = [cellA1, cellA2];
  });

  it('should concatenate strings', (): void => {
    functionExpression = new FunctionExpression('=("cat"+"dog")', cells);
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      'catdog'
    );
  });

  it('should return error for invalid concatenation', (): void => {
    functionExpression = new FunctionExpression('="cat"+3', cells);
    expect(functionExpression.getSimplifiedExpression()).toBeInstanceOf(
      ErrorExpression
    );
  });

  it('should ouput the correct cell references', (): void => {
    cellA1.setValue('"cat"');
    functionExpression = new FunctionExpression('=(REF(A1))', cells);
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      'cat'
    );
  });

  it('should concatenate cell references', (): void => {
    cellA1.setValue('"dog"');
    cellA2.setValue('"cat"');
    //functionExpression = new FunctionExpression('=(REF(A1)+REF(A2))', cells);
    functionExpression = new FunctionExpression('=(REF(A1)+REF(B1))', cells);
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      'dogcat'
    );
  });

  it('should correctly compute SUM function', (): void => {
    functionExpression = new FunctionExpression(
      '=(SUM(A1..A2) + REF(A2))',
      cells
    );
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      '1'
    ); // 1+2
  });

  it('should correctly compute AVG function', (): void => {
    functionExpression = new FunctionExpression('=(AVG(A1..A2) + 5)', cells);
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      '6'
    ); // 1+2
  });

  it('should error out on mixed types', (): void => {
    functionExpression = new FunctionExpression('="cat"+REF(A1)', cells);
    expect(functionExpression.getSimplifiedExpression()).toBeInstanceOf(
      ErrorExpression
    );
  });

  it('should handle nested functions', (): void => {
    functionExpression = new FunctionExpression(
      '=(SUM(A1..A2) - AVG(A1..A3) * REF(A2))',
      cells
    );
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      '1'
    ); // 1+(1+2)/2
  });

  it('should handle errors in expressions', (): void => {
    functionExpression = new FunctionExpression('=1/0', cells);
    expect(functionExpression.getSimplifiedExpression()).toBeInstanceOf(
      ErrorExpression
    );
  });

  it('should handle complex string concatenations', (): void => {
    cellA1.setValue('"Hello"');
    cellA2.setValue('"World"');
    functionExpression = new FunctionExpression(
      '=(REF(A1) + " " + REF(B1))',
      cells
    );
    expect(functionExpression.getSimplifiedExpression().toString()).toEqual(
      'Hello World'
    );
  });

  it('should correctly resolve nested references and ranges', (): void => {
    const cellA1 = new Cell(new Position(0, 0), new NumberExpression('2'));
    const cellA2 = new Cell(new Position(0, 1), new NumberExpression('3'));
    const cells = [cellA1, cellA2];

    functionExpression = new FunctionExpression(
      '=(REF(A1)+SUM(A1..A2))',
      cells
    );
    const simplifiedExpression = functionExpression
      .getSimplifiedExpression()
      .toString();
    expect(simplifiedExpression).toEqual('4'); // REF(A1) resolves to 2, SUM(A1..A2) resolves to 3
  });

  it('should split expressions correctly while respecting quotes', (): void => {
    cellA1.setValue('"Value"');
    functionExpression = new FunctionExpression(
      '=(Complicated+Expression+REF(A1))',
      [cellA1]
    );
    const simplifiedExpression = functionExpression
      .getSimplifiedExpression()
      .toString();
    expect(simplifiedExpression).toEqual('ComplicatedExpressionValue');
  });

  it('should return error when the plus sign is double', (): void => {
    cellA1.setValue('"Value"');
    functionExpression = new FunctionExpression(
      '=(Complicated+Expression++REF(A1))',
      [cellA1]
    );
    const simplifiedExpression = functionExpression
      .getSimplifiedExpression()
      .toString();
    expect(simplifiedExpression).toEqual('#NAME?');
  });

  it('should return error expression for concatenation of mixed types', () => {
    const functionExpression = new FunctionExpression('=("Hello" + 1)', []);
    const result = functionExpression.getSimplifiedExpression();
    expect(result).toBeInstanceOf(ErrorExpression);
  });

  it('should return error for invalid CONCAT function parameters', () => {
    const functionExpression = new FunctionExpression(
      '=(CONCAT(1, "Hello"))',
      []
    );
    const result = functionExpression.getSimplifiedExpression();
    expect(result).toBeInstanceOf(ErrorExpression);
  });

  it('should return error for unsupported functions', () => {
    const functionExpression = new FunctionExpression('=(UNSUPPORTED(A1))', []);
    const result = functionExpression.getSimplifiedExpression();
    expect(result).toBeInstanceOf(ErrorExpression);
  });

  it('should handle nested function calls', () => {
    cellA1.setValue('"Value"');
    const functionExpression = new FunctionExpression(
      '=(CONCAT("Value is ", REF(A1)))',
      [cellA1]
    );
    const result = functionExpression.getSimplifiedExpression().toString();
    // Assuming REF(A1) returns a valid string value
    expect(result).toContain('Value is ');
  });

  it('should return null for empty expressions', () => {
    const functionExpression = new FunctionExpression('=', []);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('');
  });

  it('should return error for malformed expressions', () => {
    const functionExpression = new FunctionExpression('=MALFORMED)', []);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('#NAME?');
  });

  it('should output 0 if adding empty cells', () => {
    cellA1.setValue('');
    const functionExpression = new FunctionExpression(
      '=(REF(A1) + REF(A1))',
      []
    );
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('0');
  });

  it('should ouput 0 if subtracting empty cells', () => {
    cellA1.setValue('');
    const functionExpression = new FunctionExpression('=(REF(A1) - REF(A1))', [
      cellA1,
    ]);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('0');
  });
  it('should ouput 0 if multiplying empty cells', () => {
    cellA1.setValue('');
    const functionExpression = new FunctionExpression('=(REF(A1) * REF(A1))', [
      cellA1,
    ]);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('0');
  });

  it('should ouput error when dividing empty cells', () => {
    cellA1.setValue('');
    const functionExpression = new FunctionExpression('=(REF(A1) / REF(A1))', [
      cellA1,
    ]);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('#VALUE!');
  });

  it('should ouput error adding mixed type', () => {
    cellA1.setValue('');
    const functionExpression = new FunctionExpression('=(1 + "1esd")', [
      cellA1,
    ]);
    const result = functionExpression.getSimplifiedExpression().toString();
    expect(result).toEqual('#ERROR!');
  });

  it('should handle successful parsing', () => {
    const parser = new Parser();
    jest.spyOn(parser, 'parse').mockReturnValue({ error: null, result: '15' });

    const functionExpression = new FunctionExpression('=(1+2)', []);
    const result = functionExpression.getSimplifiedExpression();

    expect(result).toBeInstanceOf(FunctionExpression);
    expect(result.toString()).toEqual('3');
  });

  it('should handle parsing error', () => {
    const parser = new Parser();
    jest
      .spyOn(parser, 'parse')
      .mockReturnValue({ error: '#ERROR!', result: null });

    const functionExpression = new FunctionExpression('=(1+)', []);
    const result = functionExpression.getSimplifiedExpression();

    expect(result).toBeInstanceOf(ErrorExpression);
    expect(result.toString()).toContain('#ERROR!');
  });

  it('should handle null parsing result', () => {
    const parser = new Parser();
    jest.spyOn(parser, 'parse').mockReturnValue({ error: null, result: null });

    const functionExpression = new FunctionExpression(
      '=(1+undefinedVariable)',
      []
    );
    const result = functionExpression.getSimplifiedExpression();

    expect(result).toBeInstanceOf(ErrorExpression);
    expect(result.toString()).toEqual('#NAME?');
  });
  it('should handle exceptions during parsing', () => {
    const parser = new Parser();
    jest.spyOn(parser, 'parse').mockImplementation(() => {
      throw new Error('Unexpected Error');
    });

    const functionExpression = new FunctionExpression(
      '=INVALID_EXPRESSION',
      []
    );
    const result = functionExpression.getSimplifiedExpression();

    expect(result).toBeInstanceOf(ErrorExpression);
    expect(result.toString()).toEqual('#NAME?');
  });
});
