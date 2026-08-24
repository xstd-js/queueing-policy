import { NONE } from '@xstd/none';
import { sleep } from '@xstd/abortable';
import { describe, expect, it } from 'vitest';
import type { Queue } from '../../queue.ts';
import { TimeQueuingPolicy } from './time-queuing-policy.ts';

describe('CountQueuingPolicy', () => {
  it('should prevent invalid "count" input', () => {
    expect(() => new TimeQueuingPolicy(-1)).toThrow();
    expect(() => new TimeQueuingPolicy(0)).toThrow();
    expect(() => new TimeQueuingPolicy(0.1)).not.toThrow();
    expect(() => new TimeQueuingPolicy(1e80)).not.toThrow();
    expect(() => new TimeQueuingPolicy(Number.POSITIVE_INFINITY)).not.toThrow();
  });

  it('should enqueue a maximum of 2 values', async () => {
    const queue: Queue<number> = new TimeQueuingPolicy(2).create<number>();

    expect(queue.dequeue()).toBe(NONE);

    queue.enqueue(1);
    queue.enqueue(2);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(NONE);

    queue.enqueue(1);
    queue.enqueue(2);

    await sleep(10);

    expect(queue.dequeue()).toBe(NONE);
  });
});
