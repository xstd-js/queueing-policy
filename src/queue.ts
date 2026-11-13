import type { None } from '@xstd/none';

/**
 * Initialization object for a `Queue`: provides the functions backing the `enqueue` and `dequeue` operations.
 *
 * @template GValue - The type of the values stored in the queue.
 */
export interface QueueInit<GValue> {
  readonly enqueue: Enqueue<GValue>;
  readonly dequeue: Dequeue<GValue>;
}

/**
 * A function to store (enqueue) a value in a queue.
 *
 * @template GValue - The type of the value to be enqueued.
 * @param value - The value to be added to the queue.
 */
export interface Enqueue<GValue> {
  (value: GValue): void;
}

/**
 * A function to retrieve (dequeue) a value from a queue.
 *
 * @template GValue - The type of the value to be dequeued.
 * @returns The dequeued value, or `NONE` if no value is available.
 */
export interface Dequeue<GValue> {
  (): GValue | None;
}

/**
 * Represents a generic Queue implementation.
 *
 * It delegates its storage logic to the `enqueue` and `dequeue` functions provided at construction.
 *
 * @template GValue - The type of the values stored in the queue.
 */
export class Queue<GValue> {
  readonly #enqueue: Enqueue<GValue>;
  readonly #dequeue: Dequeue<GValue>;

  /**
   * Creates a new `Queue`.
   *
   * @param init - The `enqueue` and `dequeue` functions backing this queue.
   */
  constructor({ enqueue, dequeue }: QueueInit<GValue>) {
    this.#enqueue = enqueue;
    this.#dequeue = dequeue;
  }

  /**
   * Enqueues (stores) a value into the queue.
   */
  get enqueue(): Enqueue<GValue> {
    return this.#enqueue;
  }

  /**
   * Dequeues (retrieves) a value from the queue.
   */
  get dequeue(): Dequeue<GValue> {
    return this.#dequeue;
  }
}
