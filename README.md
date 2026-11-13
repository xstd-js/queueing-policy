[![npm (scoped)](https://img.shields.io/npm/v/@xstd/queueing-policy.svg)](https://www.npmjs.com/package/@xstd/queueing-policy)
![npm](https://img.shields.io/npm/dm/@xstd/queueing-policy.svg)
![NPM](https://img.shields.io/npm/l/@xstd/queueing-policy.svg)
![npm type definitions](https://img.shields.io/npm/types/@xstd/queueing-policy.svg)
![coverage](https://img.shields.io/badge/coverage-100%25-green)
![AI generation](https://img.shields.io/badge/AI_generation-low-yellow)

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

A **queuing policy** is a factory of queues: it encapsulates the queueing logic (capacity, expiration, ...) and each call to `create()` returns a new, independent queue implementing that logic.

Queues are used to temporarily store values and retrieve them later, oldest-first. The queueing logic decides how many values are retained, for how long, and when they become available.

### The `Queue` contract

Every created queue is independent and exposes the same two operations:

| Operation | Signature                 | Description                                                                                                                         |
| --------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `enqueue` | `(value: GValue) => void` | Stores a value into the queue.                                                                                                      |
| `dequeue` | `() => GValue \| None`    | Retrieves the next available value, or `NONE` (from [`@xstd/none`](https://www.npmjs.com/package/@xstd/none)) if none is available. |

> A queue never throws when it cannot provide a value: `dequeue` simply returns `NONE`.

`GValue` is the type of the queued values, provided when creating a queue: `queue.create<number>()`.

### Quick start

```ts
import { InfiniteQueuingPolicy } from '@xstd/queueing-policy';

const queue = InfiniteQueuingPolicy.create<number>();

queue.enqueue(1);
queue.enqueue(2);

queue.dequeue(); // => 1 (oldest value first)
queue.dequeue(); // => 2
queue.dequeue(); // => NONE (the queue is empty)
```

### Built-in policies

| Policy                  | Usage                                         | Behavior                                                                  |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `InfiniteQueuingPolicy` | `InfiniteQueuingPolicy.create<number>()`      | Values are stored without limit and persist until dequeued.               |
| `CountQueuingPolicy`    | `new CountQueuingPolicy(2).create<number>()`  | At most `count` values are retained; the oldest one is dropped when full. |
| `TimeQueuingPolicy`     | `new TimeQueuingPolicy(100).create<number>()` | Each value expires `expirationTime` milliseconds after its insertion.     |
| `EdgeQueuingPolicy`     | `EdgeQueuingPolicy.create<number>()`          | Only the value enqueued after a pending `dequeue` request is retained.    |

`InfiniteQueuingPolicy` and `EdgeQueuingPolicy` need no configuration: they are ready-to-use instances. `CountQueuingPolicy` and `TimeQueuingPolicy` are instantiated with `new` before calling `create()`.

#### InfiniteQueuingPolicy

The simplest policy: values are enqueued without limit and delivered oldest-first (FIFO).

```ts
const queue = InfiniteQueuingPolicy.create<number>();

queue.enqueue(1);
queue.enqueue(2);

queue.dequeue(); // => 1
queue.dequeue(); // => 2
queue.dequeue(); // => NONE
```

#### CountQueuingPolicy

A queue retaining at most `count` values. When it is full, enqueueing a new value silently drops the oldest one.

- `count` must be a strictly positive safe integer, or `Number.POSITIVE_INFINITY` (no limit). Otherwise, the constructor throws.

```ts
const queue = new CountQueuingPolicy(2).create<number>();

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3); // => 1 is dropped

queue.dequeue(); // => 2
queue.dequeue(); // => 3
```

#### TimeQueuingPolicy

A queue where each value expires `expirationTime` milliseconds after its insertion. Expiration is evaluated lazily: expired values are discarded on the next `enqueue` or `dequeue` call, so `dequeue` never returns an expired value.

- `expirationTime` must be strictly greater than zero (in milliseconds). Otherwise, the constructor throws.

```ts
const queue = new TimeQueuingPolicy(100).create<number>(); // values expire after 100ms

queue.enqueue(1);

await new Promise((resolve) => setTimeout(resolve, 150));

queue.dequeue(); // => NONE (1 has expired)
```

#### EdgeQueuingPolicy

A queue to retrieve _future_ values only: it retains a value only if a `dequeue` request is pending. This is useful to observe the _next_ event instead of the latest one.

1. `dequeue` returns `NONE` and the queue starts waiting for the next value.
2. The first enqueued value is retained; later values are dropped while one is already pending.
3. The next `dequeue` call returns the retained value, and the cycle repeats.

```ts
const queue = EdgeQueuingPolicy.create<number>();

queue.dequeue(); // => NONE (the queue starts waiting for the next value)

queue.enqueue(1); // retained
queue.enqueue(2); // dropped: a value is already pending

queue.dequeue(); // => 1
queue.dequeue(); // => NONE (the queue is waiting again)
```

### Custom policy

Any queueing logic can be implemented by providing a factory function to `QueueingPolicy`, returning a `Queue` built from an `enqueue` and a `dequeue` function.

For example, a policy dropping the first enqueued value of each queue:

```ts
import { NONE, type None } from '@xstd/none';
import { Queue, QueueingPolicy } from '@xstd/queueing-policy';

export const DropFirstValueQueuingPolicy = new QueueingPolicy(<GValue>(): Queue<GValue> => {
  const values: GValue[] = [];
  let firstValueDropped = false;

  return new Queue<GValue>({
    enqueue: (value: GValue): void => {
      if (!firstValueDropped) {
        firstValueDropped = true;
        return;
      }

      values.push(value);
    },
    dequeue: (): GValue | None => {
      return values.length === 0 ? NONE : values.shift()!;
    },
  });
});
```

### API reference

| Export                         | Kind  | Description                                                                                       |
| ------------------------------ | ----- | ------------------------------------------------------------------------------------------------- |
| `QueueingPolicy`               | class | A queueing policy: creates queues with encapsulated logic. `create<GValue>(): Queue<GValue>`.     |
| `QueueFactoryFunction`         | type  | A function creating a `Queue`, as accepted by `QueueingPolicy`.                                   |
| `Queue`                        | class | A generic queue delegating its storage to the `enqueue` and `dequeue` functions it is built with. |
| `QueueInit`                    | type  | Initialization object for `Queue`: the backing `enqueue` and `dequeue` functions.                 |
| `Enqueue`                      | type  | `(value: GValue) => void`: stores a value into the queue.                                         |
| `Dequeue`                      | type  | `() => GValue \| None`: retrieves a value, or `NONE`.                                             |
| `HavingQueueingPolicy`         | type  | An object owning a `queueingPolicy` property.                                                     |
| `HavingOptionalQueueingPolicy` | type  | Same as `HavingQueueingPolicy`, with an optional `queueingPolicy` property.                       |
| `InfiniteQueuingPolicy`        | value | Shared unbounded policy.                                                                          |
| `CountQueuingPolicy`           | class | Bounded policy: `new CountQueuingPolicy(count)`.                                                  |
| `TimeQueuingPolicy`            | class | Expiring policy: `new TimeQueuingPolicy(expirationTime)`.                                         |
| `EdgeQueuingPolicy`            | value | Shared edge-triggered policy.                                                                     |
