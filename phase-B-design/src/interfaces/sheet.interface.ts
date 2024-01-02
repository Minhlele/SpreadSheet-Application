import { ICell } from './cell.interface';
import { GraphType } from '../enums/graph-type.enum';

export interface ISheet {
    getCells(row: number, col: number): ICell;
    insert(isRow: boolean, id: number): void;
    delete(isRow: boolean, id: number): void;
    applyValue(value: String): void;
    sort(isRow: boolean, id: number): void;
    createGraph(graphType: GraphType, dataPoints: Array<ICell>, height: number, width: number, title: string): void;
}
