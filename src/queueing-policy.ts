import type { Queue } from './queue.ts';

/**
 * A function creating a new `Queue` instance.
 *
 * @template GValue - The type of the values stored in the created queue.
 */
export interface QueueFactoryFunction {
  <GValue>(): Queue<GValue>;
}

/**
 * A `queueing policy`: creates a predefined queue instance with encapsulated logic.
 *
 * Each call to {@link QueueingPolicy.create} returns a new, independent queue whose behavior
 * (capacity, expiration, edge detection, ...) is defined by the policy's factory function.
 */
export class QueueingPolicy {
  readonly #create: QueueFactoryFunction;

  /**
   * Creates a new `QueueingPolicy`.
   *
   * @param create - A function creating the queues instantiated through {@link QueueingPolicy.create}.
   */
  constructor(create: QueueFactoryFunction) {
    this.#create = create;
  }

  /**
   * Creates and returns a new instance of a Queue.
   *
   * @template GValue - Specifies the type of the values that will be stored in the queue.
   * @returns A new Queue instance.
   */
  create<GValue>(): Queue<GValue> {
    return this.#create();
  }
}
