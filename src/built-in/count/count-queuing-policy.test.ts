import { NONE } from '@xstd/none';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Queue } from '../../queue.ts';
import { CountQueuingPolicy } from './count-queuing-policy.ts';

describe('CountQueuingPolicy', () => {
  it('should prevent invalid "count" input', () => {
    expect(() => new CountQueuingPolicy(-1)).toThrow();
    expect(() => new CountQueuingPolicy(0)).toThrow();
    expect(() => new CountQueuingPolicy(0.1)).toThrow();
    expect(() => new CountQueuingPolicy(1e80)).toThrow();
    expect(() => new CountQueuingPolicy(Number.POSITIVE_INFINITY)).not.toThrow();
  });

  it('should enqueue a maximum of 2 values', () => {
    const queue: Queue<number> = new CountQueuingPolicy(2).create<number>();

    expect(queue.dequeue()).toBe(NONE);

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBe(NONE);
  });
});
