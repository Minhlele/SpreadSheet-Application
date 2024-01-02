import { ICell } from '../interfaces/cell.interface';
import { Position } from './cellposition';
import { ISheet } from '../interfaces/sheet.interface';
import { Sheet } from './sheet';
import { DEFAULT_ROWS, DEFAULT_COLUMNS } from './constants';
import { Cell } from './cell';

describe('Sheet', (): void => {
  let sheet: ISheet;
  let cellGrid: Array<Array<ICell>>;
  let rowSize: number;
  let colSize: number;
  beforeEach((): void => {
    sheet = new Sheet('Sheet 1');
    cellGrid = sheet.getCellGrid();
    rowSize = DEFAULT_ROWS;
    colSize = DEFAULT_COLUMNS;
  });

  //Tests for initialization
  it('should initialize a new sheet with empty cells', (): void => {
    //traverse cellGrid and make sure that cell upon initialization is empty
    let currentCell: ICell;
    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
        currentCell = cellGrid[i][j];
        expect(currentCell.getValue()).toEqual({ string: '' });
      }
    }
  });

  it('should return the correct column and row size', (): void => {
    const rowSize1: number = sheet.getCellGrid().length;
    expect(rowSize1).toEqual(DEFAULT_ROWS);
  });

  it('should return the correct cell', (): void => {
    const cell_A0: ICell = sheet.getCell(0, 0);
    expect(cell_A0.getPosition()).toEqual(new Position(0, 0));
  });

  it('should return the correct cell#1', (): void => {
    const cell_A0: ICell = sheet.getCell(3, 0);
    sheet.setCellValue(new Position(3, 0), '1');
    expect(cell_A0.getDisplay()).toEqual('1');
  });

  //Simple functions evaluation (no reference)
  it('should set the value and evaluate simple function', (): void => {
    const user_input = '=(1+5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('6');
    expect(cell_A2.getValue()).toEqual({ func: '=(1+5)', referenced: [] });
  });

  it('should set the value and evaluate simple funciton #2', (): void => {
    const user_input = '=((1+2) + 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('8');
    expect(cell_A2.getValue()).toEqual({
      func: '=((1+2) + 5)',
      referenced: [],
    });
  });

  it('should set the value and evaluate simple function #3', (): void => {
    const user_input = '=((1*2*3) + 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('11');
    expect(cell_A2.getValue()).toEqual({
      func: '=((1*2*3) + 5)',
      referenced: [],
    });
  });

  it('should set the value and evaluate simple function #4', (): void => {
    const user_input = '=(((1*2*3) / 5) * 20)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('24');
    expect(cell_A2.getValue()).toEqual({
      func: '=(((1*2*3) / 5) * 20)',
      referenced: [],
    });
  });

  it('should set the value and evaluate simple function result in negative #1', (): void => {
    const user_input = '=(-1-2-3-4)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('-10');
    expect(cell_A2.getValue()).toEqual({ func: '=(-1-2-3-4)', referenced: [] });
  });

  it('should set the value and evaluate simple function result in negative float #1', (): void => {
    const user_input = '=(-1.2-2.3-3.5-4)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('-11');
    expect(cell_A2.getValue()).toEqual({
      func: '=(-1.2-2.3-3.5-4)',
      referenced: [],
    });
  });

  it('should set the value and evaluate simple function result in positive float #1', (): void => {
    const user_input = '=(12.3 * 13.6)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    expect(cell_A2.getObserving().length).toEqual(0);
    expect(cell_A2.getDisplay()).toEqual('167.28');
    expect(cell_A2.getValue()).toEqual({
      func: '=(12.3 * 13.6)',
      referenced: [],
    });
  });

  //Numeric input and string input

  it('should set the correct value for given cell (string)', (): void => {
    const user_input = 'REF(A1)+ REF(A2) + 5';
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    //get the value of cell A2

    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getValue()).toEqual({ string: 'REF(A1)+ REF(A2) + 5' });
    expect(cell_A2.getDisplay()).toEqual('REF(A1)+ REF(A2) + 5');
  });

  it('should set the correct value for given cell (number)', (): void => {
    const user_input = '2';
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    //get the value of cell A2

    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getValue()).toEqual({ number: 2 });
    expect(cell_A2.getDisplay()).toEqual('2');
  });

  it('should set the correct value for given string with RangeType', (): void => {
    const user_input = 'SUM(A1:A2)';
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), user_input);
    //get the value of cell A2

    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getValue()).toEqual({ string: user_input });
    expect(cell_A2.getDisplay()).toEqual('SUM(A1:A2)');
  });

  it('should set the correct value for given string with RangeType #2', (): void => {
    const user_input = 'AVG(A1:A2)';
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(2, 0), user_input);
    //get the value of cell A2

    const cell_B2: ICell = sheet.getCell(2, 0);
    expect(cell_B2.getValue()).toEqual({ string: user_input });
    expect(cell_B2.getDisplay()).toEqual('AVG(A1:A2)');
  });

  //Cell Reference Tests

  it('should set the value and evaluate with 1 referenced input', (): void => {
    const user_input = '=(REF(A2)- 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A4: ICell = sheet.getCell(3, 0);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '1');
    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(1);
    expect(cell_A4.getDisplay()).toEqual('-4');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2)- 5)',
      referenced: [cell_A2],
    });
  });

  it('should set the value and evaluate with 1 referenced', (): void => {
    const user_input = '=(REF(C5))';
    //get the cell references
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_C5: ICell = sheet.getCell(4, 2);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '1');
    sheet.setCellValue(new Position(4, 2), '5');
    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(1);
    expect(cell_A4.getDisplay()).toEqual('5');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(C5))',
      referenced: [cell_C5],
    });
  });

  it('should set the value and evaluate with 1 referenced input #3', (): void => {
    const user_input = '=(REF(C5) + 2)';
    //get the cell references
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_C5: ICell = sheet.getCell(4, 2);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '1');

    //sheet.setCellValue(new Position(4,2),"5");
    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(1);
    expect(cell_A4.getDisplay()).toEqual('2');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(C5) + 2)',
      referenced: [cell_C5],
    });
  });

  it('should set the value and evaluate with 2 referenced input', (): void => {
    const user_input = '=(REF(A2) - REF(B1) + 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_B1: ICell = sheet.getCell(0, 1);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '1');
    sheet.setCellValue(new Position(0, 1), '9');

    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(2);
    expect(cell_A4.getDisplay()).toEqual('-3');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2) - REF(B1) + 5)',
      referenced: [cell_A2, cell_B1],
    });
  });

  it('should set the value and evaluate with empty cell reference', (): void => {
    const user_input = '=(REF(A2) + REF(B1) + 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_B1: ICell = sheet.getCell(0, 1);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '');
    sheet.setCellValue(new Position(0, 1), '');

    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(2);
    expect(cell_A4.getDisplay()).toEqual('5');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2) + REF(B1) + 5)',
      referenced: [cell_A2, cell_B1],
    });
  });

  it('should set the value and evaluate with nested cell reference', (): void => {
    const user_input = '=(REF(A2) + REF(B1) + 5)';
    const next_user_input = '=(REF(A4) + REF(B1) *3)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_B1: ICell = sheet.getCell(0, 1);
    const cell_A6: ICell = sheet.getCell(5, 0);
    //set the value of user input to cell A2
    //set cell A2 and B1 to be 4 and 8
    sheet.setCellValue(new Position(1, 0), '4');
    sheet.setCellValue(new Position(0, 1), '8');

    //set cell A4
    sheet.setCellValue(new Position(3, 0), user_input);
    //set cell A6
    sheet.setCellValue(new Position(5, 0), next_user_input);

    //Check cell A4
    expect(cell_A4.getObserving().length).toEqual(2);
    expect(cell_A4.getDisplay()).toEqual('17');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2) + REF(B1) + 5)',
      referenced: [cell_A2, cell_B1],
    });

    //Check cell A6
    expect(cell_A6.getObserving().length).toEqual(2);
    expect(cell_A6.getDisplay()).toEqual('41');
    expect(cell_A6.getValue()).toEqual({
      func: '=(REF(A4) + REF(B1) *3)',
      referenced: [cell_A4, cell_B1],
    });
  });

  //Range Expression: SUM & AVG

  it('should return correct result using SUM', (): void => {
    const user_input = '=SUM(A1..A3)';
    const cell_B1: ICell = sheet.getCell(1, 1);
    const cell_A1: ICell = sheet.getCell(0, 0);
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(1, 1), user_input);

    expect(cell_B1.getValue()).toEqual({
      rangeExpr: '=SUM(A1..A3)',
      referenced: [cell_A1, cell_A2, cell_A3],
    });
    expect(cell_B1.getDisplay()).toEqual('6');
    expect(cell_B1.getObserving().length).toEqual(3);
  });

  it('should return correct result using SUM with empty cells', (): void => {
    const user_input = '=SUM(A1..A3)';
    const cell_B1: ICell = sheet.getCell(1, 1);
    const cell_A1: ICell = sheet.getCell(0, 0);
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(0, 0), '');
    sheet.setCellValue(new Position(1, 0), '');
    sheet.setCellValue(new Position(2, 0), '');
    sheet.setCellValue(new Position(1, 1), user_input);

    expect(cell_B1.getValue()).toEqual({
      rangeExpr: '=SUM(A1..A3)',
      referenced: [cell_A1, cell_A2, cell_A3],
    });
    expect(cell_B1.getDisplay()).toEqual('0');
    expect(cell_B1.getObserving().length).toEqual(3);
  });

  it('should return correct result using AVG', (): void => {
    const user_input = '=AVG(A1..A3)';
    const cell_B1: ICell = sheet.getCell(1, 1);
    const cell_A1: ICell = sheet.getCell(0, 0);
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(1, 1), user_input);

    expect(cell_B1.getValue()).toEqual({
      rangeExpr: '=AVG(A1..A3)',
      referenced: [cell_A1, cell_A2, cell_A3],
    });
    expect(cell_B1.getDisplay()).toEqual('2');
    expect(cell_B1.getObserving().length).toEqual(3);
  });

  it('should return correct result combina SUM() AVG and REF()', (): void => {
    const user_input = '=(AVG(A1..B2) + SUM(A1..C2) + REF(A1))';

    //give me fill grid from columnA to column C
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(0, 1), '4');
    sheet.setCellValue(new Position(1, 1), '5');
    sheet.setCellValue(new Position(2, 1), '6');
    sheet.setCellValue(new Position(0, 2), '5');
    sheet.setCellValue(new Position(1, 2), '3');
    sheet.setCellValue(new Position(2, 2), '4');
    sheet.setCellValue(new Position(0, 3), user_input);

    expect(sheet.getCell(0, 3).getDisplay()).toEqual('24');
    expect(sheet.getCell(0, 3).getObserving().length).toEqual(6);
  });

  //Obsserver pattern
  //Check if the observers are notified when the referenced values has changed
  it('should return the updated value when the referenced values has changed', (): void => {
    const user_input = '=(REF(A2) + REF(B1) + 5)';
    //get the cell references
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A4: ICell = sheet.getCell(3, 0);
    const cell_B1: ICell = sheet.getCell(0, 1);
    //set the value of user input to cell A2
    sheet.setCellValue(new Position(1, 0), '');
    sheet.setCellValue(new Position(0, 1), '');

    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getObserving().length).toEqual(2);
    expect(cell_A4.getDisplay()).toEqual('5');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2) + REF(B1) + 5)',
      referenced: [cell_A2, cell_B1],
    });

    //change the value of cell A2 and B1
    sheet.setCellValue(new Position(1, 0), '1');
    sheet.setCellValue(new Position(0, 1), '9');
    expect(cell_A4.getDisplay()).toEqual('15');
    expect(cell_A4.getValue()).toEqual({
      func: '=(REF(A2) + REF(B1) + 5)',
      referenced: [cell_A2, cell_B1],
    });
  });

  //Tests for Errorr
  it('should have the error value when user want to divide by 0', (): void => {
    const user_input = '=(9/0)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#DIV/0!');
  });

  it('should have the error value when user want to divide by 0 by refering another cell', (): void => {
    const user_input = '=(REF(A2)/0)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#DIV/0!');
  });

  it('should have the error value when user want to reference an invalid cell', (): void => {
    const user_input = '=(REF(A2)/0)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#DIV/0!');
    sheet.setCellValue(new Position(6, 0), '=(REF(B4))');
    expect(cell_A4.getDisplay()).toEqual('#DIV/0!');
  });

  it('should have the error value when user enter an invalid command', (): void => {
    const user_input = '=(AVERGAE(A2..A4))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    sheet.setCellValue(new Position(6, 0), '=(REF(B4))');
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user dont follow correct format for function', (): void => {
    const user_input = '=SUM(A2..A4) + 5';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    sheet.setCellValue(new Position(6, 0), '=(REF(B4))');
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    //fix the format
    sheet.setCellValue(new Position(3, 1), '=SUM(A2..A4)');
    expect(cell_A4.getDisplay()).toEqual('5');
  });

  it('should have the error value when user forgot closing parentheses', (): void => {
    const user_input = '=SUM(A2..A4))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    sheet.setCellValue(new Position(6, 0), '=(REF(B4))');
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    //fix the format
    sheet.setCellValue(new Position(3, 1), '=SUM(A2..A4)');
    expect(cell_A4.getDisplay()).toEqual('5');
  });

  it('should have the error value when user forgot starting parentheses', (): void => {
    const user_input = '=(SUM(A2..A4)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user added more parentheses than needed', (): void => {
    const user_input = '=(SUM(A2..A4)))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user wrong format for range expression', (): void => {
    const user_input = '=SUM[A2..A4]';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user wrong format for Reference expression', (): void => {
    const user_input = '=A1+A2';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user wrong format for wrong RangeType', (): void => {
    const user_input = '=GRAPH(A1..A2)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user input injection', (): void => {
    const user_input = '__import__(‘os’).system(‘rm –rf /’)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('__import__(‘os’).system(‘rm –rf /’)');
    expect(cell_A4.getValue()).toEqual({
      string: '__import__(‘os’).system(‘rm –rf /’)',
    });
  });

  it('should have the error value when user input injection #2', (): void => {
    const user_input = '=__import__(‘os’).system(‘rm –rf /’)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user subtraction on strings', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(hello-world)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user subtraction on referenced string', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)-REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'howdy');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'hi');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
    //chnage the reference string back to numbers

    sheet.setCellValue(new Position(0, 0), '2');
    sheet.setCellValue(new Position(1, 0), '10');
    //the result should be update accordingly
    expect(cell_A4.getDisplay()).toEqual('-8');
  });

  it('should have the error value when user subtraction on number and string', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)-REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '3');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'hi');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user subtraction on number and string#2', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)-REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'howdy');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '8');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user multiplication on string', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)*REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'neo');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'cat');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });
  it('should have the error value when user multiplication on string and number', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)*REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'neo');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '9');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user division on string and number', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)/REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'neo');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '9');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user division on string and string', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)/REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'dog');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'cat');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user division on string and 0', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)/REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'dog');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '0');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user division on string and 0 but when adjust the number will be valid again', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)/REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'dog');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');

    sheet.setCellValue(new Position(0, 0), '28');
    expect(cell_A4.getDisplay()).toEqual('14');
  });

  it('should have the error value when user addition by number and string', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)+REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'dog');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#NAME?');
  });

  it('should have the error value when user addition by number and special character', (): void => {
    //let user_input = '="hello" - "world"';
    const user_input = '=(REF(A1)+REF(A2))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '!');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user SUM() and reference cells that contain a string ', (): void => {
    const user_input = '=SUM(A1..A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'cat');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#INVLREXPR!');
  });

  it('should have the error value when user AVG() and reference cells that contain a special character ', (): void => {
    const user_input = '=AVG(A1..A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '!!');
    sheet.setCellValue(new Position(0, 1), 'dog');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#INVLREXPR!');
  });

  it('should have the error value when user AVG() and the reference cell is invalid ', (): void => {
    const user_input = '=AVG(A120..A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#INVLREXPR!');
  });

  it('should have the error value when user SUM() and the reference cell is invalid ', (): void => {
    const user_input = '=SUM(ABA..A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user SUM() and the reference cell is invalid #11 ', (): void => {
    //let user_input = '=(SUM(B1..B3) + 5 + REF(A1))';
    const user_input = '=SUM(A1..A35898)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#INVLREXPR!');
  });

  it('should have the error value when user REF() and the reference cell is invalid ', (): void => {
    const user_input = '=REF(ABA..A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user REF() and the reference cell is invalid #1 ', (): void => {
    const user_input = '=REF(A12903)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
  });

  //String concat test

  it('should have the concat of 2 string when using + operator on strings ', (): void => {
    const user_input = '=(hello+world+ER)';

    sheet.setCellValue(new Position(0, 0), '!');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('helloworldER');
  });

  it('should have the concat of 2 string when using + operator on strings #2 ', (): void => {
    const user_input = '=(hello+"world")';

    sheet.setCellValue(new Position(0, 0), '!');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('helloworld');
  });

  it('should have the concat of 2 string when using + operator on strings #3 ', (): void => {
    const user_input = '=("apple"+"world")';

    sheet.setCellValue(new Position(0, 0), '!');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('appleworld');
  });

  it('should have the concat of 2 string when using + operator on reference strings ', (): void => {
    const user_input = '=(REF(A1) + REF(A2))';

    sheet.setCellValue(new Position(0, 0), 'Hello how are');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'you');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('Hello how areyou');
  });

  it('should have the concat of 2 string when using + operator on multiple  strings ', (): void => {
    const user_input = '=(REF(A1) + REF(A2) + doing)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), 'Hello how are');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), 'you');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    expect(cell_A4.getDisplay()).toEqual('Hello how areyoudoing');
  });

  it('should return the correct sheet title', (): void => {
    expect(sheet.getTitle()).toEqual('Sheet 1');
  });

  // Spreadsheet visualization

  it('should have the correct cell grid that works with observers', (): void => {
    const user_input = '=SUM(A1..A2)';

    //initialize the initial cell grid

    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '8');

    const cell_A4: ICell = sheet.getCell(3, 0);

    sheet.setCellValue(new Position(3, 0), user_input);
    expect(cell_A4.getDisplay()).toEqual('3');

    //insert a row at row 1

    sheet.insert(true, 1);
    expect(cell_A4.getDisplay()).toEqual('1');

    //expect(sheet).toEqual(expectSheet);
  });

  it('should have the correct cell grid that works with observers #2', (): void => {
    const user_input = '=SUM(A1..C1)';

    //initialize the initial cell grid

    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '8');

    const cell_D1: ICell = sheet.getCell(0, 3);

    sheet.setCellValue(new Position(0, 3), user_input);
    expect(cell_D1.getDisplay()).toEqual('3');

    //insert a row at row 1

    sheet.insert(true, 1);
    expect(cell_D1.getDisplay()).toEqual('3');
    sheet.insert(false, 1);
    expect(cell_D1.getDisplay()).toEqual('2');
  });

  it('should have the correct cell grid after colummn insertion', (): void => {
    const small_sheet: ISheet = new Sheet('Small sheet', 3, 3);
    //initialize the initial cell grid
    small_sheet.setCellValue(new Position(0, 0), '1');
    small_sheet.setCellValue(new Position(0, 1), '1');
    small_sheet.setCellValue(new Position(1, 0), '2');
    small_sheet.setCellValue(new Position(1, 1), '7');
    small_sheet.setCellValue(new Position(2, 0), '3');
    small_sheet.setCellValue(new Position(2, 1), '10');

    //insert a row at row 1
    small_sheet.insert(false, 1);

    expect(small_sheet.getCell(0, 0).getDisplay()).toEqual('1');
    expect(small_sheet.getCell(0, 1).getDisplay()).toEqual('');
    expect(small_sheet.getCell(0, 2).getDisplay()).toEqual('1');
    expect(small_sheet.getCell(0, 3).getDisplay()).toEqual('');
    expect(small_sheet.getCell(1, 0).getDisplay()).toEqual('2');
    expect(small_sheet.getCell(1, 1).getDisplay()).toEqual('');
    expect(small_sheet.getCell(1, 2).getDisplay()).toEqual('7');
    expect(small_sheet.getCell(1, 3).getDisplay()).toEqual('');
    expect(small_sheet.getCell(2, 0).getDisplay()).toEqual('3');
    expect(small_sheet.getCell(2, 1).getDisplay()).toEqual('');
    expect(small_sheet.getCell(2, 2).getDisplay()).toEqual('10');
    expect(small_sheet.getCell(2, 3).getDisplay()).toEqual('');
  });

  it('should return correct result using SUM with cells', (): void => {
    const user_input = '=SUM(A1..A3)';
    const cell_B1: ICell = sheet.getCell(1, 1);
    const cell_A1: ICell = sheet.getCell(0, 0);
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(0, 0), '');
    sheet.setCellValue(new Position(1, 0), '');
    sheet.setCellValue(new Position(2, 0), '');
    sheet.setCellValue(new Position(1, 1), user_input);

    expect(cell_B1.getValue()).toEqual({
      rangeExpr: '=SUM(A1..A3)',
      referenced: [cell_A1, cell_A2, cell_A3],
    });
    expect(cell_B1.getDisplay()).toEqual('0');
    expect(cell_B1.getObserving().length).toEqual(3);
  });

  it('should have the correct SUM value for column', (): void => {
    const user_input = '=SUM(A1..A3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');

    const cell_A4: ICell = sheet.getCell(3, 0);

    sheet.setCellValue(new Position(3, 0), user_input);
    //=SUM(A1..A3)
    expect(cell_A4.getDisplay()).toEqual('6');
    //insert a row at row 1
    sheet.insert(false, 1);

    expect(cell_A4.getDisplay()).toEqual('6');
    //console.log(formatSpreadsheetGrid(sheet.getCellGrid()));
  });

  it('should have the correct SUM value after insertion update #1', (): void => {
    const user_input = '=SUM(C1..C3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');

    const cell_A4: ICell = sheet.getCell(3, 0);

    sheet.setCellValue(new Position(3, 0), user_input);
    //=SUM(A1..A3)
    expect(cell_A4.getDisplay()).toEqual('0');

    //console.log(formatSpreadsheetGrid(sheet.getCellGrid()));
    //insert a row at row 1

    sheet.insert(false, 1);

    expect(cell_A4.getDisplay()).toEqual('18');
  });

  it('should have the correct SUM value after insertion update #2', (): void => {
    const user_input = '=SUM(C1..C3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '1');
    sheet.setCellValue(new Position(1, 0), '98');
    sheet.setCellValue(new Position(1, 1), '77');
    sheet.setCellValue(new Position(1, 2), '233');
    sheet.setCellValue(new Position(2, 0), '2');
    sheet.setCellValue(new Position(2, 1), '7');
    sheet.setCellValue(new Position(2, 2), '8');

    const cell_A4: ICell = sheet.getCell(3, 0);

    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getDisplay()).toEqual('242');

    //insert a row at row 1

    sheet.insert(false, 1);

    expect(cell_A4.getDisplay()).toEqual('85');
  });

  it('should have the correct SUM value after insertion update #3', (): void => {
    const user_input = '=SUM(C1..C3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '1');
    sheet.setCellValue(new Position(1, 0), '98');
    sheet.setCellValue(new Position(1, 1), '77');
    sheet.setCellValue(new Position(1, 2), '233');
    sheet.setCellValue(new Position(2, 0), '2');
    sheet.setCellValue(new Position(2, 1), '7');
    sheet.setCellValue(new Position(2, 2), '8');

    const cell_A4: ICell = sheet.getCell(3, 0);

    sheet.setCellValue(new Position(3, 0), user_input);

    expect(cell_A4.getDisplay()).toEqual('242');

    //insert a row at row 1

    sheet.insert(false, 2);

    expect(cell_A4.getDisplay()).toEqual('0');
  });

  it('should have the correct cell grid after column deletion', (): void => {
    const small_sheet: ISheet = new Sheet('Small sheet', 3, 3);

    //initialize the initial cell grid
    small_sheet.setCellValue(new Position(0, 0), '1');
    small_sheet.setCellValue(new Position(0, 1), '1');
    small_sheet.setCellValue(new Position(0, 2), '4');
    small_sheet.setCellValue(new Position(1, 0), '2');
    small_sheet.setCellValue(new Position(1, 1), '7');
    small_sheet.setCellValue(new Position(1, 2), '7');

    //delete column 1
    small_sheet.delete(false, 1);

    // //initialize expected sheet
    expect(small_sheet.getCell(0, 0).getDisplay()).toEqual('1');
    expect(small_sheet.getCell(0, 1).getDisplay()).toEqual('4');
    expect(small_sheet.getCell(1, 0).getDisplay()).toEqual('2');
    expect(small_sheet.getCell(1, 1).getDisplay()).toEqual('7');
    expect(small_sheet.getCell(2, 0).getDisplay()).toEqual('');
    expect(small_sheet.getCell(2, 1).getDisplay()).toEqual('');
  });

  it('should have the correct cell grid after column deletion #2', (): void => {
    const user_input = '=SUM(B1..B3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 0);
    sheet.setCellValue(new Position(3, 0), user_input);
    expect(cell_A4.getDisplay()).toEqual('18');
    //delete column 1
    sheet.delete(false, 1);
    expect(cell_A4.getDisplay()).toEqual('20');
    sheet.delete(false, 1);
    expect(cell_A4.getDisplay()).toEqual('0');
  });

  it('should have the correct cell grid after row deletion', (): void => {
    const user_input = '=(SUM(B1..B3)/4 + REF(A3))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('7.5');
    //delete row 1
    sheet.delete(false, 1);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('8');
  });

  it('should have the correct cell grid after row deletion#2', (): void => {
    const user_input = '=SUM(A1..B3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('24');
    sheet.delete(true, 1);
    expect(sheet.getCell(3, 0).getDisplay()).toEqual('15');
  });

  it('should have the correct cell grid after row deletion for single column#2', (): void => {
    const user_input = '=SUM(A1..A3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('6');
    expect(sheet.getCell(4, 0).getValue()).toEqual({
      rangeExpr: '=SUM(A1..A3)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(1, 0),
        sheet.getCell(2, 0),
      ],
    });
    sheet.delete(true, 1);
    expect(sheet.getCell(3, 0).getDisplay()).toEqual('4');
    expect(sheet.getCell(3, 0).getValue()).toEqual({
      rangeExpr: '=SUM(A1..A3)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(1, 0),
        sheet.getCell(2, 0),
      ],
    });
  });

  it('should have the correct cell grid after row deletion for single row#2', (): void => {
    const user_input = '=SUM(A1..C1)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('6');
    expect(sheet.getCell(4, 0).getValue()).toEqual({
      rangeExpr: '=SUM(A1..C1)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(0, 1),
        sheet.getCell(0, 2),
      ],
    });
    sheet.delete(true, 0);
    expect(sheet.getCell(3, 0).getDisplay()).toEqual('16');
    expect(sheet.getCell(3, 0).getValue()).toEqual({
      rangeExpr: '=SUM(A1..C1)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(0, 1),
        sheet.getCell(0, 2),
      ],
    });
  });

  it('should have the correct value after updating the reference', (): void => {
    const user_input = '=SUM(A1..B3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('24');
    expect(sheet.getCell(4, 0).getValue()).toEqual({
      rangeExpr: '=SUM(A1..B3)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(0, 1),
        sheet.getCell(1, 0),
        sheet.getCell(1, 1),
        sheet.getCell(2, 0),
        sheet.getCell(2, 1),
      ],
    });
    //change value of cell A1

    sheet.setCellValue(new Position(0, 0), '5');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('28');
    //change of cell A2
    sheet.setCellValue(new Position(2, 0), '50');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('75');
    sheet.setCellValue(new Position(0, 2), '-3');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('75');
    sheet.setCellValue(new Position(0, 1), '6');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('80');
    sheet.setCellValue(new Position(1, 1), '0');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('73');
    sheet.setCellValue(new Position(2, 1), '100');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('163');
    sheet.setCellValue(new Position(1, 0), '10');
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('171');
    sheet.insert(true, 1);
    expect(sheet.getCell(5, 0).getDisplay()).toEqual('21');
  });

  it('should have the correct cell grid after row deletion#3', (): void => {
    const user_input = '=SUM(A1..C2)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(0, 4), user_input);
    expect(sheet.getCell(0, 4).getValue()).toEqual({
      rangeExpr: '=SUM(A1..C2)',
      referenced: [
        sheet.getCell(0, 0),
        sheet.getCell(0, 1),
        sheet.getCell(0, 2),
        sheet.getCell(1, 0),
        sheet.getCell(1, 1),
        sheet.getCell(1, 2),
      ],
    });

    expect(sheet.getCell(0, 4).getDisplay()).toEqual('22');
    sheet.delete(true, 0);
    expect(sheet.getCell(3, 0).getDisplay()).toEqual('');
  });
  it('should have the correct cell grid after row deletion#4', (): void => {
    const user_input = '=SUM(A1..C2)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(1, 4), user_input);

    expect(sheet.getCell(1, 4).getDisplay()).toEqual('22');
    sheet.delete(true, 0);
    expect(sheet.getCell(0, 4).getDisplay()).toEqual('38');
  });
  it('should have the correct cell grid after row insertion', (): void => {
    const user_input = '=AVG(A1..B2)';
    // Initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('2.75');
    sheet.insert(true, 1);
    expect(sheet.getCell(5, 0).getDisplay()).toEqual('0.5');
  });

  it('should have the correct cell grid after column insertion', (): void => {
    const user_input = '=AVG(A1..B3)';
    // Initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('4');
    sheet.insert(false, 1);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('1');
  });
  it('should have the correct cell grid after column insertion #2', (): void => {
    const user_input = '=SUM(A1..C3)';
    // Initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('44');
    sheet.delete(false, 1);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('26');
  });
  it('should have the correct cell grid after column deletion', (): void => {
    const user_input = '=SUM(A1..C3)';
    // Initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '1');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    sheet.setCellValue(new Position(4, 0), user_input);
    expect(sheet.getCell(4, 0).getDisplay()).toEqual('44');
    sheet.delete(true, 1);
    expect(sheet.getCell(3, 0).getDisplay()).toEqual('28');
  });

  it('should have the error value when user have circular reference ', (): void => {
    const user_input = '=(REF(B4))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    const cell_A4: ICell = sheet.getCell(3, 1);

    sheet.setCellValue(new Position(3, 1), user_input);
    //expect(cell_A4.getValue()).toEqual("#REF!");

    expect(cell_A4.getDisplay()).toEqual('#ERROR!');
    expect(cell_A4.getValue()).toEqual({ string: '=(REF(B4))' });
  });

  it('should have the error value when user have circular reference #2 ', (): void => {
    const user_input = '=(SUM(B1..B3))';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    sheet.setCellValue(new Position(3, 1), user_input);
    //expect(cell_A4.getValue()).toEqual("#REF!");
    sheet.delete(true, 2);
    expect(sheet.getCell(2, 1).getDisplay()).toEqual('#ERROR!');
  });

  it('should have the error value when user have circular reference #3 ', (): void => {
    const user_input = '=SUM(B1..B3)';
    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '7');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    sheet.setCellValue(new Position(3, 1), user_input);
    sheet.delete(true, 2);
    expect(sheet.getCell(2, 1).getDisplay()).toEqual('#ERROR!');
  });

  it('test forr catch 1 reference bug ', (): void => {
    const user_input_in_A1 = '=REF(A1)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), user_input_in_A1);
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '2');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
  });

  it('test forr catch double reference bug ', (): void => {
    const user_input_in_A1 = '=REF(A2)';
    const user_input_in_A2 = '=REF(A1)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), user_input_in_A1);
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), user_input_in_A2);
    sheet.setCellValue(new Position(1, 1), '2');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');

    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
    expect(sheet.getCell(1, 0).getDisplay()).toEqual('#ERROR!');
  });

  it('test forr catch double reference bug in range expression', (): void => {
    const user_input_in_A1 = '=REF(A2)';
    const user_input_in_A2 = '=SUM(A1...A3)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), user_input_in_A1);
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), user_input_in_A2);
    sheet.setCellValue(new Position(1, 1), '2');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
    expect(sheet.getCell(1, 0).getDisplay()).toEqual('#ERROR!');
  });

  it('test forr catch true bug in function expression', (): void => {
    const user_input_in_A1 = '=(applu3000u)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), user_input_in_A1);
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '2');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
  });

  it('test forr catch true bug in function expression #1', (): void => {
    const user_input_in_A1 = '=(3002mimen)';

    //initialize the initial cell grid
    sheet.setCellValue(new Position(0, 0), user_input_in_A1);
    sheet.setCellValue(new Position(0, 1), '2');
    sheet.setCellValue(new Position(0, 2), '4');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(1, 1), '2');
    sheet.setCellValue(new Position(1, 2), '7');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(2, 1), '10');
    sheet.setCellValue(new Position(2, 2), '9');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
  });

  it(
    "should have a cell where it is not observing any cells after it's value is changed to an expression " +
      'that does not reference other cells',
    (): void => {
      const user_input_before = '=(REF(A2) + REF(B1) + 5)';
      const user_input_after = '4'; // a primitive expression, a number expression
      const A4Position: Position = new Position(3, 0);
      const A2Position: Position = new Position(1, 0);
      const B1Position: Position = new Position(0, 1);
      //get the cell references
      const cell_A2: ICell = sheet.getCell(1, 0);
      const cell_A4: ICell = sheet.getCell(3, 0);
      const cell_B1: ICell = sheet.getCell(0, 1);
      //set the value of user input to cell A2
      sheet.setCellValue(A2Position, '');
      sheet.setCellValue(B1Position, '');
      sheet.setCellValue(A4Position, user_input_before);
      sheet.setCellValue(A4Position, user_input_after); // change A4 value to be a primitive -- it no longer has any other cells in it's value

      expect(cell_A4.getObserving().length).toEqual(0);
      expect(cell_A2.getObservers().length).toEqual(0);
      expect(cell_B1.getObservers().length).toEqual(0);
    }
  );

  it(
    "should have a cell where it is observing different cells after it's value is changed to an expression " +
      'that references other cells',
    (): void => {
      const user_input_before = '=(REF(A2) + REF(B1) + 5)';
      const user_input_after = '=(REF(B2) + REF(C3) + 5)';
      const A4Position: Position = new Position(3, 0);
      const A2Position: Position = new Position(1, 0);
      const B1Position: Position = new Position(0, 1);
      const B2Position: Position = new Position(1, 1);
      const C3Position: Position = new Position(2, 2);
      //get the cell references
      const cell_A2: ICell = sheet.getCell(1, 0);
      const cell_A4: ICell = sheet.getCell(3, 0);
      const cell_B1: ICell = sheet.getCell(0, 1);
      const cell_B2: ICell = sheet.getCell(1, 1);
      const cell_C3: ICell = sheet.getCell(2, 2);
      //set the value of user input to cell A2
      sheet.setCellValue(A2Position, '');
      sheet.setCellValue(B1Position, '');
      sheet.setCellValue(B2Position, '');
      sheet.setCellValue(C3Position, '');
      sheet.setCellValue(A4Position, user_input_before);
      sheet.setCellValue(A4Position, user_input_after); // change A4 value to be the function that includes references to B2 and C3

      expect(cell_A4.getObserving().length).toEqual(2);
      // these commented out cases return 1
      expect(cell_A2.getObservers().length).toEqual(0); // A2 and B1 should no longer have A4 as an observer
      expect(cell_B1.getObservers().length).toEqual(0);
      expect(cell_B2.getObservers().length).toEqual(1); // B2 and C3 should now be the only ones observed by A4
      expect(cell_C3.getObservers().length).toEqual(1);
      expect(cell_A4.getObserving()).toContain(cell_B2);
      expect(cell_A4.getObserving()).toContain(cell_C3);
      expect(cell_B2.getObservers()).toContain(cell_A4);
      expect(cell_C3.getObservers()).toContain(cell_A4);
    }
  );

  //Addiontal tests
  it('should correctly set and display a numeric constant', (): void => {
    sheet.setCellValue(new Position(0, 0), '123');
    const cell_A1: ICell = sheet.getCell(0, 0);
    expect(cell_A1.getDisplay()).toEqual('123');
    expect(cell_A1.getValue()).toEqual({ number: 123 });
  });
  it('should correctly set and display a string constant', (): void => {
    sheet.setCellValue(new Position(0, 0), 'Hello World');
    const cell_A1: ICell = sheet.getCell(0, 0);
    expect(cell_A1.getDisplay()).toEqual('Hello World');
    expect(cell_A1.getValue()).toEqual({ string: 'Hello World' });
  });

  it('should correctly resolve a single cell reference', (): void => {
    sheet.setCellValue(new Position(0, 0), '5');
    sheet.setCellValue(new Position(1, 0), '=REF(A1)');
    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getDisplay()).toEqual('5');
  });

  it('should display an error for an invalid cell reference', (): void => {
    sheet.setCellValue(new Position(1, 0), '=REF(Z99)');
    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getDisplay()).toEqual('#ERROR!');
  });

  it('should calculate the sum of a range of cells', (): void => {
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(1, 0), '2');
    sheet.setCellValue(new Position(2, 0), '3');
    sheet.setCellValue(new Position(3, 0), '=SUM(A1..A3)');
    const cell_A4: ICell = sheet.getCell(3, 0);
    expect(cell_A4.getDisplay()).toEqual('6');
  });

  it('should calculate the average of a range of cells', (): void => {
    sheet.setCellValue(new Position(0, 0), '2');
    sheet.setCellValue(new Position(1, 0), '4');
    sheet.setCellValue(new Position(2, 0), '6');
    sheet.setCellValue(new Position(3, 0), '=AVG(A1..A3)');
    const cell_A4: ICell = sheet.getCell(3, 0);
    expect(cell_A4.getDisplay()).toEqual('4');
  });

  it('should evaluate a simple arithmetic formula', (): void => {
    sheet.setCellValue(new Position(0, 0), '=((2+3)*4)');
    const cell_A1: ICell = sheet.getCell(0, 0);
    expect(cell_A1.getDisplay()).toEqual('20');
  });

  it('should concatenate strings using the + operator', (): void => {
    sheet.setCellValue(new Position(0, 0), 'cat');
    sheet.setCellValue(new Position(1, 0), 'dog');
    const cell_A4: ICell = sheet.getCell(3, 0);
    sheet.setCellValue(new Position(3, 0), '=(REF(A1) + REF(A2))');
    expect(cell_A4.getDisplay()).toEqual('catdog');
  });

  it('should display an error when dividing by zero', (): void => {
    sheet.setCellValue(new Position(0, 0), '=(5/0)');
    const cell_A1: ICell = sheet.getCell(0, 0);
    expect(cell_A1.getDisplay()).toEqual('#DIV/0!');
  });

  it('should display an error for an invalid expression format', (): void => {
    sheet.setCellValue(new Position(0, 0), '=(2+*3)');
    const cell_A1: ICell = sheet.getCell(0, 0);
    expect(cell_A1.getDisplay()).toEqual('#ERROR!');
  });

  it('should correctly insert a new row', (): void => {
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.insert(true, 1); // Insert a row at position 1
    const cell_A2: ICell = sheet.getCell(1, 0);
    expect(cell_A2.getDisplay()).toEqual('');
    expect(sheet.getCellGrid().length).toEqual(DEFAULT_ROWS + 1);
  });

  it('should correctly delete a column', (): void => {
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.delete(false, 0); // Delete column 0
    expect(sheet.getCellGrid()[0].length).toEqual(DEFAULT_COLUMNS - 1);
  });

  it('should correctly evaluate combined SUM and REF expressions', (): void => {
    sheet.setCellValue(new Position(0, 0), '2');
    sheet.setCellValue(new Position(1, 0), '3');
    sheet.setCellValue(new Position(2, 0), '=REF(A1)');
    sheet.setCellValue(new Position(3, 0), '=(SUM(A1..A2) + REF(A3))');
    const cell_A4: ICell = sheet.getCell(3, 0);
    expect(cell_A4.getDisplay()).toEqual('7'); // 2 + 3 + 2
  });

  it('should correctly handle nested REF expressions', (): void => {
    sheet.setCellValue(new Position(0, 0), '5');
    sheet.setCellValue(new Position(1, 0), '=REF(A1)');
    sheet.setCellValue(new Position(2, 0), '=(REF(A2) * 2)');
    const cell_A3: ICell = sheet.getCell(2, 0);
    expect(cell_A3.getDisplay()).toEqual('10'); // 5 * 2
  });
  it('should correctly evaluate a complex formula with SUM, AVG, and arithmetic operations', (): void => {
    sheet.setCellValue(new Position(0, 0), '10');
    sheet.setCellValue(new Position(1, 0), '20');
    sheet.setCellValue(new Position(2, 0), '30');
    sheet.setCellValue(
      new Position(3, 0),
      '=((SUM(A1..A3) + AVG(A1..A3)) / 2) * REF(A1)'
    );
    const cell_A4: ICell = sheet.getCell(3, 0);
    expect(cell_A4.getDisplay()).toEqual('400'); // ((10+20+30+20)/2)*10
  });

  it('should correctly evaluate a formula with nested range expressions and references', (): void => {
    sheet.setCellValue(new Position(0, 0), '2');
    sheet.setCellValue(new Position(1, 0), '4');
    sheet.setCellValue(new Position(2, 0), '6');
    sheet.setCellValue(new Position(3, 0), '8');
    sheet.setCellValue(
      new Position(4, 0),
      '=(SUM(A1..A2) + AVG(A3..A4) + REF(A1))'
    );
    const cell_A5: ICell = sheet.getCell(4, 0);
    expect(cell_A5.getDisplay()).toEqual('15'); // (2+4) + (6+8)/2 + 2
  });

  it('should correctly evaluate a formula with SUM with the startCell and endCell being the same cell', (): void => {
    sheet.setCellValue(new Position(0, 0), '2');
    sheet.setCellValue(new Position(1, 0), '4');
    sheet.setCellValue(new Position(2, 0), '6');
    sheet.setCellValue(new Position(3, 0), '8');
    sheet.setCellValue(new Position(4, 0), '=SUM(A1..A1)');
    const cell_A5: ICell = sheet.getCell(4, 0);
    expect(cell_A5.getDisplay()).toEqual('2');
  });

  it('should correctly handle sequential row and column insertions', (): void => {
    sheet.setCellValue(new Position(0, 0), 'A');
    sheet.setCellValue(new Position(0, 1), 'B');
    sheet.insert(true, 1); // Insert row at 1
    sheet.insert(false, 2); // Insert column at 2
    expect(sheet.getCell(0, 2).getDisplay()).toEqual(''); // New empty cell at B2
    expect(sheet.getCell(1, 0).getDisplay()).toEqual(''); // New empty cell at A2
  });

  it('should correctly handle sequential row and column deletions', (): void => {
    sheet.setCellValue(new Position(0, 0), 'X');
    sheet.setCellValue(new Position(1, 1), 'Y');
    sheet.delete(true, 0); // Delete row 0
    sheet.delete(false, 0); // Delete column 0
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('Y'); // Cell Y moved to A1
  });

  it('should correctly handle a complex scenario with multiple operations', (): void => {
    // Initial setup
    sheet.setCellValue(new Position(0, 0), '10');
    sheet.setCellValue(new Position(0, 1), '20');
    sheet.setCellValue(new Position(0, 2), '30');

    // Perform operations
    sheet.setCellValue(new Position(1, 0), '=(REF(A1) + REF(B1))');
    sheet.insert(true, 2); // Insert a new row at 2
    sheet.setCellValue(new Position(2, 0), '=SUM(A1..C1)');
    sheet.delete(false, 1); // Delete column B
    // Assertions
    const cell_A2: ICell = sheet.getCell(1, 0);
    const cell_A3: ICell = sheet.getCell(2, 0);
    expect(cell_A2.getDisplay()).toEqual('40'); // 10 + 30
    expect(cell_A3.getDisplay()).toEqual('40'); // 10 + 30
  });

  it('should initialize a new Sheet correctly', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    expect(sheet.getTitle()).toEqual('TestSheet');
    expect(sheet.getCellGrid().length).toEqual(5);
    expect(sheet.getCellGrid()[0].length).toEqual(5);
  });

  it('should return the correct cell or an error cell when out of range', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    const validCell = sheet.getCell(1, 1);
    expect(validCell).toBeInstanceOf(Cell);

    const invalidCell = sheet.getCell(10, 10);
    expect(invalidCell.getValue().toString()).toEqual('#OUTOFRANGE!');
  });

  it('should insert a row correctly and update cell positions', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.insert(true, 2);
    expect(sheet.getCellGrid().length).toEqual(6);
    expect(sheet.getCell(2, 0).getPosition().getRowId()).toEqual(2);
  });

  it('should throw an error when inserting a row at an invalid index', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    expect(() => sheet.insert(true, 10)).toThrowError('Row index out of range');
  });

  it('should insert a column correctly and update cell positions', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.insert(false, 2);
    expect(sheet.getCellGrid()[0].length).toEqual(6);
    expect(sheet.getCell(0, 2).getPosition().getColumnId()).toEqual(2);
  });

  it('should throw an error when inserting a column at an invalid index', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    expect(() => sheet.insert(false, 10)).toThrowError(
      'Column index out of range'
    );
  });

  it('should delete a row correctly and update cell positions', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.delete(true, 2);
    expect(sheet.getCellGrid().length).toEqual(4);
    expect(sheet.getCell(2, 0).getPosition().getRowId()).toEqual(2);
  });

  it('should throw an error when deleting a row at an invalid index', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    expect(() => sheet.delete(true, 10)).toThrowError('Row index out of range');
  });

  it('should delete a column correctly and update cell positions', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.delete(false, 2);
    expect(sheet.getCellGrid()[0].length).toEqual(4);
    expect(sheet.getCell(0, 2).getPosition().getColumnId()).toEqual(2);
  });

  it('should throw an error when deleting a column at an invalid index', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    expect(() => sheet.delete(false, 10)).toThrowError(
      'Column index out of range'
    );
  });

  it('should set cell value correctly for different types of expressions', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.setCellValue(new Position(0, 0), '5');
    sheet.setCellValue(new Position(1, 0), '=(REF(A1) + 5)');
    sheet.setCellValue(new Position(2, 0), '=SUM(A1..A2)');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('5');
    expect(sheet.getCell(1, 0).getDisplay()).toEqual('10');
    expect(sheet.getCell(2, 0).getDisplay()).toEqual('15');
  });

  it('should handle circular references and set error value', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.setCellValue(new Position(0, 0), '=REF(A2)');
    sheet.setCellValue(new Position(1, 0), '=REF(A1)');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
    expect(sheet.getCell(1, 0).getDisplay()).toEqual('#ERROR!');
  });

  it('should detect circular references in complex scenarios', (): void => {
    const sheet = new Sheet('TestSheet', 5, 5);
    sheet.setCellValue(new Position(0, 0), '=REF(B1)');
    sheet.setCellValue(new Position(0, 1), '=SUM(A1..C1)');
    sheet.setCellValue(new Position(0, 2), '=REF(A1)');
    expect(sheet.getCell(0, 0).getDisplay()).toEqual('#ERROR!');
    expect(sheet.getCell(0, 1).getDisplay()).toEqual('#ERROR!');
    expect(sheet.getCell(0, 2).getDisplay()).toEqual('#ERROR!');
  });

  //Tests for additional concat feature
  it('should concatenate two pure strings using the + operator', (): void => {
    sheet.setCellValue(new Position(0, 0), 'hello');
    sheet.setCellValue(new Position(0, 1), 'world');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('helloworld');
  });

  it('should concatenate strings wrapped in quotes using the + operator', (): void => {
    sheet.setCellValue(new Position(0, 0), '"apple"');
    sheet.setCellValue(new Position(0, 1), '"123"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('apple123');
  });

  it('should concatenate strings wrapped in quotes using the + operator #2', (): void => {
    sheet.setCellValue(new Position(0, 1), '=("123")');
    expect(sheet.getCell(0, 1).getDisplay()).toEqual('123');
  });

  it('should concatenate strings wrapped in quotes using the + operator #3', (): void => {
    sheet.setCellValue(new Position(0, 1), '=(apple)');
    expect(sheet.getCell(0, 1).getDisplay()).toEqual('apple');
  });

  it('should concatenate strings wrapped in quotes using the + operator #4', (): void => {
    sheet.setCellValue(new Position(0, 1), '="123"');
    expect(sheet.getCell(0, 1).getDisplay()).toEqual('#ERROR!');
  });

  it('should concatenate strings wrapped in quotes using the + operator #5', (): void => {
    sheet.setCellValue(new Position(0, 1), '=(598096apple)');
    expect(sheet.getCell(0, 1).getDisplay()).toEqual('#ERROR!');
  });
  it('should concatenate a mix of pure strings and strings in quotes', (): void => {
    sheet.setCellValue(new Position(0, 0), 'code');
    sheet.setCellValue(new Position(0, 1), '"1234"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('code1234');
  });
  it('should return an error when trying to concatenate strings and numbers', (): void => {
    sheet.setCellValue(new Position(0, 0), 'hello');
    sheet.setCellValue(new Position(0, 1), '123');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#NAME?');
  });

  it('should return an error when trying to concatenate strings and numbers #2', (): void => {
    sheet.setCellValue(new Position(0, 0), 'hello');
    sheet.setCellValue(new Position(0, 1), '123');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#NAME?');
  });

  it('should concatenate a mix of pure strings and strings in quotes #4', (): void => {
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), '"1234"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#ERROR!');
  });

  it('should concatenate a mix of pure strings and strings in quotes #5', (): void => {
    sheet.setCellValue(new Position(0, 1), '"asb"');
    sheet.setCellValue(new Position(2, 0), '=(REF(B1) + cat)');
    expect(sheet.getCell(2, 0).getDisplay()).toEqual('asbcat');
  });

  it('should concatenate a mix of pure strings and strings in quotes #7', (): void => {
    sheet.setCellValue(new Position(0, 0), '"=(REF(A1)+SUM(A1..A2))"');
    sheet.setCellValue(new Position(0, 1), '"asb"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('=(REF(A1)+SUM(A1..A2))asb');
  });

  it('should concatenate a mix of pure strings and strings in quotes #6', (): void => {
    sheet.setCellValue(new Position(0, 0), '"REF(A1)"');
    sheet.setCellValue(new Position(0, 1), '"asb"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('REF(A1)asb');
  });

  it('should concatenate a mix of pure strings and strings in quotes #8', (): void => {
    sheet.setCellValue(new Position(0, 0), '"=(REF(A1)+SUM(A1..A2))"');
    sheet.setCellValue(new Position(0, 1), '"asb"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('=(REF(A1)+SUM(A1..A2))asb');
    //console.log(formatSpreadsheetGrid(sheet.getCellGrid()));
  });

  it('should concatenate a mix of pure strings and strings in quotes #9', (): void => {
    sheet.setCellValue(new Position(0, 0), '"2+3*4"');
    sheet.setCellValue(new Position(0, 1), '"asb"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    //expect(cell_A3.getDisplay()).toEqual("=(REF(A1)+SUM(A1..A2))asb");
    expect(cell_A3.getDisplay()).toEqual('2+3*4asb');
    //console.log(formatSpreadsheetGrid(sheet.getCellGrid()));
  });
  it('should return an error when concatenating an alphanumeric string with a string in quotes', (): void => {
    sheet.setCellValue(new Position(0, 0), 'appl4');
    sheet.setCellValue(new Position(0, 1), '"apple4"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#VALUE!');
  });
  it('should return an error when trying to concatenate a number with an alphanumeric string', (): void => {
    sheet.setCellValue(new Position(0, 0), '1');
    sheet.setCellValue(new Position(0, 1), 'appl4');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#VALUE!');
  });
  it('should return an error when concatenating a pure string with an alphanumeric string', (): void => {
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(0, 1), 'apple4');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#NAME?');
  });

  it('should return an error when concatenating a nummber and a number in string form', (): void => {
    sheet.setCellValue(new Position(0, 0), '"1"');
    sheet.setCellValue(new Position(0, 1), '1');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#ERROR!');
  });
  it('should return an error when concatenating strings with special characters', (): void => {
    sheet.setCellValue(new Position(0, 0), 'apple$');
    sheet.setCellValue(new Position(0, 1), '"@apple"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('#ERROR!');
  });

  it('should return correctly when trying to concatenate a string with a quoted number', (): void => {
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(0, 1), '"123"');
    const cell_A3: ICell = sheet.getCell(2, 0);
    sheet.setCellValue(new Position(2, 0), '=(REF(A1) + REF(B1))');
    expect(cell_A3.getDisplay()).toEqual('apple123');
  });
  it('should return an error for SUM() when a referenced cell contains a pure string', (): void => {
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(1, 0), '2');
    const cell_B1: ICell = sheet.getCell(0, 1);
    sheet.setCellValue(new Position(0, 1), '=SUM(A1..A2)');
    expect(cell_B1.getDisplay()).toEqual('#INVLREXPR!');
  });
  it('should return an error for AVG() when a referenced cell contains a pure string', (): void => {
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(1, 0), '2');
    const cell_B1: ICell = sheet.getCell(0, 1);
    sheet.setCellValue(new Position(0, 1), '=AVG(A1..A2)');
    expect(cell_B1.getDisplay()).toEqual('#INVLREXPR!');
  });

  it('should return a correct answer for REF() when the referenced cell contains a pure string', (): void => {
    sheet.setCellValue(new Position(0, 0), 'banana');
    const cell_A2: ICell = sheet.getCell(1, 0);
    sheet.setCellValue(new Position(1, 0), '=REF(A1)');
    expect(cell_A2.getDisplay()).toEqual('banana');
  });

  it('should return an error for SUM() with multiple referenced cells containing different string formats', (): void => {
    sheet.setCellValue(new Position(0, 0), 'orange');
    sheet.setCellValue(new Position(1, 0), '"lemon"');
    sheet.setCellValue(new Position(2, 0), '3');
    const cell_B1: ICell = sheet.getCell(0, 1);
    sheet.setCellValue(new Position(0, 1), '=SUM(A1..C3)');
    expect(cell_B1.getDisplay()).toEqual('#ERROR!');
  });

  it('should return an error for AVG() with a range containing both numbers and strings', (): void => {
    sheet.setCellValue(new Position(0, 0), '5');
    sheet.setCellValue(new Position(1, 0), 'grape');
    sheet.setCellValue(new Position(2, 0), '7');
    const cell_B1: ICell = sheet.getCell(0, 1);
    sheet.setCellValue(new Position(0, 1), '=AVG(A1..A3)');
    expect(cell_B1.getDisplay()).toEqual('#INVLREXPR!');
  });
});
