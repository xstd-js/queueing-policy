import { NONE, type None } from '@xstd/none';
import { Queue } from '../../queue.ts';
import { QueueingPolicy } from '../../queueing-policy.ts';

/**
 * Represents a "count" queuing policy: a queue with a fixed maximum number of stored values.
 *
 * This policy ensures that the queue retains a maximum number of elements as specified by the count.
 * When the maximum count is exceeded, the oldest elements in the queue are removed to make space for
 * new elements.
 */
export class CountQueuingPolicy extends QueueingPolicy {
  constructor(count: number) {
    if (count <= 0 || (!Number.isSafeInteger(count) && count !== Number.POSITIVE_INFINITY)) {
      throw new Error(`Invalid count: ${count}`);
    }

    super(<GValue>(): Queue<GValue> => {
      const values: GValue[] = [];

      return new Queue<GValue>({
        enqueue: (value: GValue): void => {
          values.push(value);

          if (values.length > count) {
            values.shift();
          }
        },
        dequeue: (): GValue | None => {
          return values.length === 0 ? NONE : values.shift()!;
        },
      });
    });
  }
}
