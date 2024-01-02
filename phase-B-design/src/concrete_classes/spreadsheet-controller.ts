import { ISpreadSheetController } from "../interfaces/spreadsheet-contoller.interface";
import { ISpreadSheet } from "../interfaces/spreadsheet.interface";

export class SpreadSheetController implements ISpreadSheetController {

    private spreadsheet: ISpreadSheet;

    public constructor(spreadsheet: ISpreadSheet) {
        this.spreadsheet = spreadsheet;
    }

    processUserInput(): void {
        throw new Error("Method not implemented.");
    }
    
}