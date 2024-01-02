import { IObserver } from './observer.interface';

export interface IGraph extends IObserver {
    render(): void;
}