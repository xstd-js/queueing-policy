import type { QueueingPolicy } from './queueing-policy.ts';

/**
 * An object owning a {@link QueueingPolicy} instance.
 */
export interface HavingQueueingPolicy {
  readonly queueingPolicy: QueueingPolicy;
}

/**
 * Same as {@link HavingQueueingPolicy}, but the `queueingPolicy` property is optional.
 */
export type HavingOptionalQueueingPolicy = Partial<HavingQueueingPolicy>;
