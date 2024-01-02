import { ICell } from '../interfaces/cell.interface';
import { IObserver } from '../interfaces/observer.interface';
import { Position } from './cellposition';
export class Cell implements ICell {
    private isNumber: boolean;
    private value: string = '';
    private position: Position;
    private displayValue: string = '';
    private observers: Array<IObserver> = [];
    private observing: Array<ICell> = [];

    public constructor(
        isNumber: boolean = false,
        position: Position,
        value: string = '',
        displayValue: string = '',
        observers: Array<IObserver> = [],
        observing: Array<ICell> = []
    ) {
        this.isNumber = isNumber;
        this.position = position
        this.value = value;
        this.displayValue = displayValue;
        this.observers = observers;
        this.observing = observing;
    }
    
    public clearCell(): void {
        throw new Error('Method not implemented.');
    }
;

    public updateCellValue(value: String): void {
        throw new Error('Method not implemented.');
    }

    public updateTrueValue(value: String): void {
        throw new Error('Method not implemented.');
    }

    public getValue(): string {
        throw new Error('Method not implemented.');
    }

    public getDisplayValue(): string {
        throw new Error('Method not implemented.');
    }

    public attachObserver(obs: IObserver): void {
        throw new Error('Method not implemented.');
    }
    
    public detachObserver(obs: IObserver): void {
        throw new Error('Method not implemented.');
    }

    public notifyObservers(): void {
        throw new Error('Method not implemented.');
    }

    public update(): void {
        throw new Error('Method not implemented.');
    }
}