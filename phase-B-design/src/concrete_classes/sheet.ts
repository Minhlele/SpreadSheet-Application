import { ICell } from '../interfaces/cell.interface';
import { GraphType } from '../enums/graph-type.enum';
import { ISheet } from '../interfaces/sheet.interface';
import { IGraph } from '../interfaces/graph.interface';
import { Cell } from './cell';
import { Position } from './cellposition';

export class Sheet implements ISheet {
    private title: string;
    private cellGrid: Array<Array<ICell>>;
    private graphList: Array<IGraph>;

    public constructor(title: string = '', cellGrid: Array<Array<ICell>> = [[]], graphList: Array<IGraph> = []) {
        this.title = title;
        this.cellGrid = cellGrid;
        this.graphList = graphList;
    };

    public getCells(row: number, col: number): ICell {
        throw new Error('Method not implemented.');
    }

    public insert(isRow: boolean, id: number): void {
        throw new Error('Method not implemented.');
    }

    public delete(isRow: boolean, id: number): void {
        throw new Error('Method not implemented.');
    }

    public applyValue(value: String): void {
        throw new Error('Method not implemented.');
    }

    public sort(isRow: boolean, id: number): void {
        throw new Error('Method not implemented.');
    }

    public createGraph(graphtType: GraphType, dataPoints: ICell[], height: number, width: number, title: string): void {
        throw new Error('Method not implemented.');
    }

}