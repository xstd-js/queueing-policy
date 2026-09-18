[![npm (scoped)](https://img.shields.io/npm/v/@xstd/queueing-policy.svg)](https://www.npmjs.com/package/@xstd/queueing-policy)
![npm](https://img.shields.io/npm/dm/@xstd/queueing-policy.svg)
![NPM](https://img.shields.io/npm/l/@xstd/queueing-policy.svg)
![npm type definitions](https://img.shields.io/npm/types/@xstd/queueing-policy.svg)
![coverage](https://img.shields.io/badge/coverage-100%25-green)

<picture>
  <source height="64" media="(prefers-color-scheme: dark)" srcset="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-dark.png?raw=true">
  <source height="64" media="(prefers-color-scheme: light)" srcset="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-light.png?raw=true">
  <img height="64" alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-light.png?raw=true">
</picture>

## @xstd/queueing-policy

A simple queueing-policy API.

## 📦 Installation

```shell
yarn add @xstd/queueing-policy
# or
npm install @xstd/queueing-policy --save
```

## 📜 Documentation

### QueueingPolicy

```ts
interface QueueFactoryFunction {
  <GValue>(): Queue<GValue>;
}

/**
 * A `queueing policy`: creates a predefined queue instance with encapsulated logic.
 */
declare class QueueingPolicy {
  constructor(create: QueueFactoryFunction);
  /**
   * Creates and returns a new instance of a Queue.
   */
  create<GValue>(): Queue<GValue>;
}
```

### Queue

```ts
interface QueueInit<GValue> {
  readonly enqueue: Enqueue<GValue>;
  readonly dequeue: Dequeue<GValue>;
}

/**
 * A function to store (enqueue) a value in a queue.
 */
interface Enqueue<GValue> {
  (value: GValue): void;
}

/**
 * A function to retrieve (dequeue) a value from a queue.
 */
interface Dequeue<GValue> {
  (): GValue | None;
}

/**
 * Represents a generic Queue implementation.
 */
declare class Queue<GValue> {
  constructor({ enqueue, dequeue }: QueueInit<GValue>);
  
  /**
   * Enqueues (stores) a value into the queue.
   */
  get enqueue(): Enqueue<GValue>;
  /**
   * Dequeues (retrieves) a value from the queue.
   */
  get dequeue(): Dequeue<GValue>;
}
```

### Built-in policies


#### EdgeQueuingPolicy

```ts
/**
 * Represents an "edge" queuing policy: a queue to retrieve _future_ values only.
 *
 * 1. first, `dequeue` is called and returns `NONE` as no value exists.
 * 2. second, `enqueue` happens and pushes a value into the queue.
 * 3. finally, `dequeue` is called later and returns the pushed value.
 *
 * And the cycle repeats.
 */
declare const EdgeQueuingPolicy: QueueingPolicy;
```

#### CountQueuingPolicy

```ts
/**
 * Represents a "count" queuing policy: a queue with a fixed maximum number of stored values.
 *
 * This policy ensures that the queue retains a maximum number of elements as specified by the count.
 * When the maximum count is exceeded, the oldest elements in the queue are removed to make space for
 * new elements.
 */
declare class CountQueuingPolicy extends QueueingPolicy {
  constructor(count: number);
}
```

#### TimeQueuingPolicy

```ts
/**
 * Represents a "time" queuing policy: a queue where each value is associated with an expiration date.
 *
 * This policy ensures that the queue retains values with a maximum amount of time (expressed as milliseconds through `expirationTime`).
 * When a value expires, it is removed to make space for new elements.
 */
declare class TimeQueuingPolicy extends QueueingPolicy {
  constructor(expirationTime: number);
}
```

#### InfiniteQueuingPolicy

```ts
/**
 * Represents an "infinite" queuing policy: a queue able to grow infinitely without any upper limit on its size.
 *
 * Elements are continually added to the queue and persist until explicitly removed through dequeuing.
 */
declare const InfiniteQueuingPolicy: QueueingPolicy;
```
