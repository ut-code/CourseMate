import { Err, Ok, Result } from "../result";

export function safeParseInt(s: string | undefined): Result<number> {
  if (!s) return Err(new Error("empty string"));
  const n = parseInt(s);
  if (Number.isNaN(n)) return Err(new Error("invalid formatting: " + s));
  return Ok(n);
}
