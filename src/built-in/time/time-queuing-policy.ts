import { NONE, type None } from '@xstd/none';
import { Queue } from '../../queue.ts';
import { QueueingPolicy } from '../../queueing-policy.ts';

/**
 * Represents a "time" queuing policy: a queue where each value is associated with an expiration date.
 *
 * This policy ensures that the queue retains values for a maximum amount of time (expressed as
 * milliseconds through `expirationTime`).
 *
 * @remarks
 * Expired values are discarded lazily: they are removed when the queue is used (on `enqueue` or
 * `dequeue`), so `dequeue` never returns an expired value.
 */
export class TimeQueuingPolicy extends QueueingPolicy {
  /**
   * Creates a new `TimeQueuingPolicy`.
   *
   * @param expirationTime - The maximum amount of time a value is retained, in milliseconds. Must be strictly greater than zero.
   * @throws If `expirationTime` is less than or equal to zero.
   */
  constructor(expirationTime: number) {
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
