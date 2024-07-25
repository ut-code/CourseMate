/**
# Result
Result allows you to handle results in safer and more type-safe way.

basic use case:
```js
function fallible() {
  if (Math.random() > 0.5)
    throw new Error("something went wrong!");
  return "ok"
}

const result = safeTry(() => fallible());
if (!result.ok) {
  // handle error
  console.error(result.error);
  return;
}

// use value without worrying about thrown errors
console.log(result.value); // -> ok
```

or better, make it built in to your function.

```js
// never throws.
function safeFallible(): Result<string> {
  if (Math.random() > 0.5)
    return Err("something went wrong!");
  return Ok("ok");
}

const result = safeFallible();
if (!result.ok) {
  // handle error
  console.error(result.error);
  return;
}

console.log(result.value);
```
**/

// Core

export type Result<T> = Ok<T> | Err;

type Ok<T> = {
  ok: true;
  value: T;
};

type Err = {
  ok: false;
  error: unknown;
};

// Core functions

export function Ok<T>(value: T): Ok<T> {
  return {
    ok: true,
    value,
  };
}

export function Err(error: unknown): Err {
  return {
    ok: false,
    error,
  };
}

// Utility functions

export function safeTry<T>(fallible: () => T): Result<T> {
  try {
    return Ok(fallible());
  } catch (e) {
    return Err(e);
  }
}

export async function asyncSafeTry<T>(fallible: () => Promise<T>): Promise<Result<T>> {
  try {
    return Ok(await fallible());
  } catch (e) {
    return Err(e);
  }
}
