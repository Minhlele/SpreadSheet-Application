/**
 * An object that may subscribe to another.
 */
export interface IObserver {
  /**
   * Update the subscriber when the dependency changes
   */
  update(): void;
}
