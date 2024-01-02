import { Position } from '../concrete_classes/cellposition';
import { IObserver } from './observer.interface';

export interface ICell extends IObserver {
    updateCellValue(value: String): void;
    updateTrueValue(value: String): void;
    clearCell(): void;
    getValue(): String;
    getDisplayValue(): String;
    attachObserver(obs: IObserver): void;
    detachObserver(obs: IObserver): void;
    notifyObservers(): void;
}