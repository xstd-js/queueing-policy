import { NONE } from '@xstd/none';
import { describe, expect, it } from 'vitest';
import type { Queue } from '../../queue.ts';
import { EdgeQueuingPolicy } from './edge-queuing-policy.ts';

describe('EdgeQueuingPolicy', () => {
  it('should dequeue only "edge" enqueued values', () => {
    const queue: Queue<number> = EdgeQueuingPolicy.create<number>();

    expect(queue.dequeue()).toBe(NONE);
    expect(queue.dequeue()).toBe(NONE);

    queue.enqueue(1);
    queue.enqueue(2);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(NONE);
  });
});
