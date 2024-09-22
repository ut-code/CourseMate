import { Err, Ok, type Result } from "../result";

export function safeParseInt(s: string | undefined): Result<number> {
  if (!s) return Err(new Error("empty string"));
  const n = Number.parseInt(s);
  if (Number.isNaN(n)) return Err(new Error(`invalid formatting: ${s}`));
  return Ok(n);
}
