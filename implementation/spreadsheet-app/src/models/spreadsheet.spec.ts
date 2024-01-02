import { ISheet } from '../interfaces/sheet.interface';
import { Position } from './cellposition';
import { SpreadSheet } from './spreadsheet';
describe('Spreadsheet', (): void => {
  let spreadsheet: SpreadSheet;

  beforeEach((): void => {
    spreadsheet = new SpreadSheet();
  });

  afterEach((): void => {
    jest.restoreAllMocks();
  });

  it('should create and append a sheet with the default itle "0" to the sheet array', (): void => {
    spreadsheet.createSheet();

    const sheets: Array<ISheet> = spreadsheet.getSheets();
    const sheetOne: ISheet = sheets[0];
    const sheetOneTitle: string = sheetOne.getTitle();

    expect(sheetOneTitle).toEqual('0');
  });

  it(
    'should create multiple sheets, where each sheet will have a default title of their' +
      ' index in the sheet array',
    (): void => {
      spreadsheet.createSheet();
      spreadsheet.createSheet();
      spreadsheet.createSheet();

      const sheets: Array<ISheet> = spreadsheet.getSheets();
      const sheetOne: ISheet = sheets[0];
      const sheetTwo: ISheet = sheets[1];
      const sheetThree: ISheet = sheets[2];
      const sheetFour: ISheet = sheets[3];
      const sheetOneTitle: string = sheetOne.getTitle();
      const sheetTwoTitle: string = sheetTwo.getTitle();
      const sheetThreeTitle: string = sheetThree.getTitle();
      const sheetFourTitle: string = sheetFour.getTitle();

      expect(sheetOneTitle).toEqual('0');
      expect(sheetTwoTitle).toEqual('1');
      expect(sheetThreeTitle).toEqual('2');
      expect(sheetFourTitle).toEqual('3');
    }
  );

  it('should create 2 sheets, and delete the first sheet, leaving only the 2nd sheet.', (): void => {
    spreadsheet.createSheet();
    spreadsheet.deleteSheet(0);

    const sheets: Array<ISheet> = spreadsheet.getSheets();
    const sheetTwo = sheets[0];

    expect(sheets.length).toEqual(1);
    expect(sheetTwo.getTitle()).toEqual('1');
  });

  it('should delete the default sheet, causing an error to be thrown since.', (): void => {
    const failDeleteInvoke = () => {
      spreadsheet.deleteSheet(0);
    };

    const expectedError: Error = new Error(
      'Spreadsheet must have at least one sheet'
    );

    expect(failDeleteInvoke).toThrowError(expectedError);
  });

  it('should throw an error when deleting a sheet that does not exist.', (): void => {
    spreadsheet.createSheet(); // sheet name '1'
    spreadsheet.createSheet(); // sheet name '2'
    const nonexistantSheetTitle = 3;
    const failDeleteInvoke = () => {
      spreadsheet.deleteSheet(nonexistantSheetTitle);
    };

    const expectedError: Error = new Error(
      `Sheet ${nonexistantSheetTitle} does not exist in spreadsheet!`
    );

    expect(failDeleteInvoke).toThrowError(expectedError);
  });

  it(
    'should throw an error when trying to export a sheet that does not exist on the' +
      ' spreadsheet',
    (): void => {
      // calls exportSheet() on the spreadsheet for a sheet that does not exist
      const failExportInvoke = () => {
        spreadsheet.exportSheet(1);
      };

      const expectedError: Error = new Error(
        'Sheet with the id: 1 cannot be exported because it does ' +
          'not exist on the spreadsheet!'
      );

      expect(failExportInvoke).toThrowError(expectedError);
    }
  );

  it('should export a sheet with no values to a .csv file', (): void => {
    const expectedCSVContent: string =
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(0);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it('should export a sheet with primitive values on different rows and columns', (): void => {
    spreadsheet.createSheet(); // by default, creates 10x10 grid
    const sheet: ISheet = spreadsheet.getSheets()[1];
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(3, 3), '45');
    sheet.setCellValue(new Position(1, 4), 'tower');
    sheet.setCellValue(new Position(7, 2), '10');
    const expectedCSVContent: string =
      'apple,,,,,,,,,\n' +
      ',,,,tower,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,45,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,10,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it('should export a sheet where cells with set values were modified', (): void => {
    spreadsheet.createSheet(); // by default, creates 10x10 grid
    const sheet: ISheet = spreadsheet.getSheets()[1];
    sheet.setCellValue(new Position(0, 0), 'apple');
    sheet.setCellValue(new Position(3, 3), '45');
    sheet.setCellValue(new Position(1, 4), 'tower');
    sheet.setCellValue(new Position(7, 2), '10');
    // overwriting cell A1
    sheet.setCellValue(new Position(0, 0), 'pear');
    const expectedCSVContent: string =
      'pear,,,,,,,,,\n' +
      ',,,,tower,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,45,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,10,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it(
    'should export a sheet with non-primitive values (i.e. range expressions, ' +
      'cell references and functions)',
    (): void => {
      spreadsheet.createSheet(); // by default, creates 10x10 grid
      const sheet: ISheet = spreadsheet.getSheets()[1];
      sheet.setCellValue(new Position(1, 1), '25');
      sheet.setCellValue(new Position(1, 2), '45');
      sheet.setCellValue(new Position(5, 4), '=SUM(B2..B3)');
      sheet.setCellValue(new Position(9, 2), '=(10+10-2)');
      sheet.setCellValue(new Position(0, 0), '=REF(F5)');
      const expectedCSVContent: string =
        '=REF(F5),,,,,,,,,\n' +
        ',25,45,,,,,,,\n' +
        ',,,,,,,,,\n' +
        ',,,,,,,,,\n' +
        ',,,,,,,,,\n' +
        ',,,,=SUM(B2..B3),,,,,\n' +
        ',,,,,,,,,\n' +
        ',,,,,,,,,\n' +
        ',,,,,,,,,\n' +
        ',,=(10+10-2),,,,,,,\n';

      // construct our csv file from the csv content string for comparison
      const expectedBlob: Blob = new Blob([expectedCSVContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const actualBlob: Blob = spreadsheet.exportSheet(1);

      expect(expectedBlob).toStrictEqual(actualBlob);
    }
  );

  it('should export a sheet where the set values are at the right edge of the spreadsheet', (): void => {
    spreadsheet.createSheet(); // by default, creates 10x10 grid
    const sheet: ISheet = spreadsheet.getSheets()[1];
    sheet.setCellValue(new Position(0, 9), 'apple');
    sheet.setCellValue(new Position(3, 9), '45');
    sheet.setCellValue(new Position(1, 9), 'tower');
    sheet.setCellValue(new Position(7, 9), '10');
    const expectedCSVContent: string =
      ',,,,,,,,,apple\n' +
      ',,,,,,,,,tower\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,45\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,10\n' +
      ',,,,,,,,,\n' +
      ',,,,,,,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it('should export a smaller than default sheet with primitive values set on cells', (): void => {
    spreadsheet.createSheet(5, 5);
    const smallSheet: ISheet = spreadsheet.getSheets()[1];
    smallSheet.setCellValue(new Position(0, 4), 'apple');
    smallSheet.setCellValue(new Position(3, 4), '45');
    smallSheet.setCellValue(new Position(1, 4), 'tower');
    smallSheet.setCellValue(new Position(2, 4), '10');
    const expectedCSVContent: string =
      ',,,,apple\n' + ',,,,tower\n' + ',,,,10\n' + ',,,,45\n' + ',,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it('should export a sheet with strings that have commas by encasing the whole value with a quote block', (): void => {
    spreadsheet.createSheet(5, 5);
    const smallSheet: ISheet = spreadsheet.getSheets()[1];
    smallSheet.setCellValue(new Position(0, 4), 'apple,');
    smallSheet.setCellValue(new Position(3, 4), '4,5');
    smallSheet.setCellValue(new Position(1, 4), 'to,wer');
    smallSheet.setCellValue(new Position(2, 4), '10,');
    const expectedCSVContent: string =
      ',,,,"apple,"\n' +
      ',,,,"to,wer"\n' +
      ',,,,"10,"\n' +
      ',,,,"4,5"\n' +
      ',,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });

  it('should export a sheet with strings that have quote by encasing the whole value with a quote block', (): void => {
    spreadsheet.createSheet(5, 5);
    const smallSheet: ISheet = spreadsheet.getSheets()[1];
    smallSheet.setCellValue(new Position(0, 4), 'apple"');
    smallSheet.setCellValue(new Position(3, 4), '4"5');
    smallSheet.setCellValue(new Position(1, 4), 'to"wer');
    smallSheet.setCellValue(new Position(2, 4), '10"');
    const expectedCSVContent: string =
      ',,,,"apple"""\n' +
      ',,,,"to""wer"\n' +
      ',,,,"10"""\n' +
      ',,,,"4""5"\n' +
      ',,,,\n';

    // construct our csv file from the csv content string for comparison
    const expectedBlob: Blob = new Blob([expectedCSVContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const actualBlob: Blob = spreadsheet.exportSheet(1);

    expect(expectedBlob).toStrictEqual(actualBlob);
  });
});
