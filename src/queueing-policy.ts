import type { Queue } from './queue.ts';

export interface QueueFactoryFunction {
  <GValue>(): Queue<GValue>;
}

/**
 * A `queueing policy`: creates a predefined queue instance with encapsulated logic.
 */
export class QueueingPolicy {
  readonly #create: QueueFactoryFunction;

  constructor(create: QueueFactoryFunction) {
    this.#create = create;
  }

  /**
   * Creates and returns a new instance of a Queue.
   *
   * @template GValue Specifies the type of the values that will be stored in the queue.
   * @return {Queue<GValue>} A new Queue instance.
   */
  create<GValue>(): Queue<GValue> {
    return this.#create();
  }
}
