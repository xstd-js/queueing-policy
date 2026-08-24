import type { None } from '@xstd/none';

export interface QueueInit<GValue> {
  readonly enqueue: Enqueue<GValue>;
  readonly dequeue: Dequeue<GValue>;
}

/**
 * A function to store (enqueue) a value in a queue.
 *
 * @template GValue The type of the value to be enqueued.
 * @param value The value to be added to the queue.
 */
export interface Enqueue<GValue> {
  (value: GValue): void;
}

/**
 * A function to retrieve (dequeue) a value from a queue.
 *
 * @template GValue The type of the value to be dequeued.
 * @return {GValue | None} The dequeued value, or None if the queue is empty.
 */
export interface Dequeue<GValue> {
  (): GValue | None;
}

/**
 * Represents a generic Queue implementation.
 *
 * @template GValue - The type of the values stored in the queue.
 */
export class Queue<GValue> {
  readonly #enqueue: Enqueue<GValue>;
  readonly #dequeue: Dequeue<GValue>;

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
