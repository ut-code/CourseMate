/**
# Result
Result allows you to handle results in safer and more type-safe way.
Result を使うと、失敗する可能性がある関数の結果をより安全で Type-safe な方法で扱うことができます。

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

export async function safeTryAsync<T>(
  fallible: () => Promise<T>,
): Promise<Result<T>> {
  try {
    return Ok(await fallible());
  } catch (e) {
    return Err(e);
  }
}

export function safify<T, U>(fallible: (v: T) => U): (v: T) => Result<U> {
  return function (v: T): Result<U> {
    try {
      return Ok(fallible(v));
    } catch (e) {
      return Err(e);
    }
  };
}

export function safifyAsync<T, U>(
  fallible: (v: T) => Promise<U>,
): (v: T) => Promise<Result<U>> {
  return async function (v: T): Promise<Result<U>> {
    try {
      return Ok(await fallible(v));
    } catch (e) {
      return Err(e);
    }
  };
}
