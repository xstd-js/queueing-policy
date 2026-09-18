import { NONE } from '@xstd/none';
import { describe, expect, it } from 'vitest';
import type { Queue } from '../../queue.ts';
import { InfiniteQueuingPolicy } from './infinite-queuing-policy.ts';

describe('InfiniteQueuingPolicy', () => {
  it('should enqueue and dequeue values without any limit', () => {
    const queue: Queue<number> = InfiniteQueuingPolicy.create<number>();

    expect(queue.dequeue()).toBe(NONE);

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBe(NONE);
  });

  it('should retain enqueued values until dequeued', () => {
    const queue: Queue<string> = InfiniteQueuingPolicy.create<string>();

    queue.enqueue('a');
    queue.enqueue('b');

    expect(queue.dequeue()).toBe('a');
    expect(queue.dequeue()).toBe('b');
    expect(queue.dequeue()).toBe(NONE);
  });
});
