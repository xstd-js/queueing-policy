import { NONE, type None } from '@xstd/none';
import { Queue } from '../../queue.ts';
import { QueueingPolicy } from '../../queueing-policy.ts';

/**
 * Represents a "time" queuing policy: a queue where each value is associated with an expiration date.
 *
 * This policy ensures that the queue retains values with a maximum amount of time (expressed as milliseconds through `expirationTime`).
 * When a value expires, it is removed to make space for new elements.
 */
export class TimeQueuingPolicy extends QueueingPolicy {
  constructor(expirationTime: number /* ms */) {
    if (expirationTime <= 0) {
      throw new Error(`Invalid expiration time: ${expirationTime}`);
    }

    super(<GValue>(): Queue<GValue> => {
      interface Entry {
        readonly value: GValue;
        readonly expirationDate: number;
      }

      const values: Entry[] = [];

      const exhaustValues = (): void => {
        const now: number = Date.now();
        while (values.length > 0 && values[0].expirationDate <= now) {
          values.shift();
        }
      };

      return new Queue<GValue>({
        enqueue: (value: GValue): void => {
          exhaustValues();

          values.push({
            value,
            expirationDate: Date.now() + expirationTime,
          });
        },
        dequeue: (): GValue | None => {
          exhaustValues();
          return values.length === 0 ? NONE : values.shift()!.value;
        },
      });
    });
  }
}
