import type { QueueingPolicy } from './queueing-policy.ts';

export interface HavingQueueingPolicy {
  readonly queueingPolicy: QueueingPolicy;
}

export type HavingOptionalQueueingPolicy = Partial<HavingQueueingPolicy>;
