import { Err, Ok, Result } from "../result";

export function safeParseInt(s: string | undefined): Result<number> {
  if (s == null) return Err(new Error("empty string"));
  try {
    return Ok(parseInt(s));
  } catch (e) {
    return Err(e);
  }
}
