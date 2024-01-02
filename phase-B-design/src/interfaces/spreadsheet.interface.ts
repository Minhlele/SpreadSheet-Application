import { CommandType } from "../enums/command-type.enum";

export interface ISpreadSheet {

    createSheet(): number;
    deleteSheet(): void;
    runSheet(sheetId: number, command: CommandType, params: Map<String, String>): void;

}