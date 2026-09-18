import { NONE, type None } from '@xstd/none';
import { Queue } from '../../queue.ts';
import { QueueingPolicy } from '../../queueing-policy.ts';

/**
 * Represents an "infinite" queuing policy: a queue able to grow infinitely without any upper limit on its size.
 *
 * Elements are continually added to the queue and persist until explicitly removed through dequeuing.
 */
export const InfiniteQueuingPolicy = /* @__PURE__ */ new QueueingPolicy(<
  GValue,
>(): Queue<GValue> => {
  const values: GValue[] = [];

  return new Queue<GValue>({
    enqueue: (value: GValue): void => {
      values.push(value);
    },
    dequeue: (): GValue | None => {
      return values.length === 0 ? NONE : values.shift()!;
    },
  });
});
