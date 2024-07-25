export type Result<T> = Ok<T> | Err
type Ok<T> = {
  ok: true,
  value: T,
}
type Err = {
  ok: false,
  error: unknown,
}

export function Ok<T>(value: T): Ok<T> {
  return {
    ok: true,
    value,
  }
}
export function Err(error: unknown): Err {
  return {
    ok: false,
    error,
  }
}
