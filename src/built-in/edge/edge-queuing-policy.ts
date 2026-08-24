import { type None, NONE } from '@xstd/none';
import { Queue } from '../../queue.ts';
import { QueueingPolicy } from '../../queueing-policy.ts';

const IDLE_STEP = 0;
const PULL_STEP = 1;
const QUEUED_STEP = 2;
type Step = typeof IDLE_STEP | typeof PULL_STEP | typeof QUEUED_STEP;

/**
 * Represents an "edge" queuing policy: a queue to retrieve _future_ values only.
 *
 * 1. first, `dequeue` is called and returns `NONE` as no value exists.
 * 2. second, `enqueue` happens and pushes a value into the queue.
 * 3. finally, `dequeue` is called later and returns the pushed value.
 *
 * And the cycle repeats.
 */
export const EdgeQueuingPolicy = /* @__PURE__ */ new QueueingPolicy(<GValue>(): Queue<GValue> => {
  let queuedValue: GValue;
  let step: Step = IDLE_STEP;

  return new Queue<GValue>({
    enqueue: (value: GValue): void => {
      if (step === PULL_STEP) {
        queuedValue = value;
        step = QUEUED_STEP;
      }
    },
    dequeue: (): GValue | None => {
      if (step === QUEUED_STEP) {
        step = IDLE_STEP;
        return queuedValue;
      }

      if (step === IDLE_STEP) {
        step = PULL_STEP;
      }

      return NONE;
    },
  });
});
