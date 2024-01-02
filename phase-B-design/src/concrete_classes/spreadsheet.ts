import { CommandType } from "../enums/command-type.enum";
import { ISheet } from "../interfaces/sheet.interface";
import { ISpreadSheet } from "../interfaces/spreadsheet.interface";

export class SpreadSheet implements ISpreadSheet {
    private title : string;
    private sheets: Array<ISheet>;

    public constructor(title:string="Untitled",sheets: Array<ISheet>=[]) {
        this.title = title;
        this.sheets = sheets;
    }
    createSheet(): number {
        throw new Error("Method not implemented.");
    }
    deleteSheet(): void {
        throw new Error("Method not implemented.");
    }
    runSheet(sheetId: number, command: CommandType, params: Map<String, String>): void {
        throw new Error("Method not implemented.");
    }
}


