import { GraphType } from '../enums/graph-type.enum';
import { ICell } from '../interfaces/cell.interface';
import {IGraph} from '../interfaces/graph.interface';

export class Graph implements IGraph {
    private graphType: GraphType;
    private dataPoints: Array<ICell>;
    private height: number;
    private width: number;
    private title: String;

    public constructor(
        graphType: GraphType, 
        dataPoints: Array<ICell>,
        height: number, 
        width: number,
        title: String,
        position: Array<Number>,
    ) {
        this.graphType = graphType;
        this.dataPoints = dataPoints;
        this.height = height;
        this.width = width;
        this.title = title;
    };

    public render(): void {
        throw new Error('Method not implemented.');
    }
    
    public update(): void {
        throw new Error('Method not implemented.');
    }
}