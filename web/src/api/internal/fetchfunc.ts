import { Err, Ok, type Result } from "../../common/lib/result";

export async function safeFetch(
  path: string,
  method: string,
): Promise<Result<Response>> {
  try {
    return Ok(
      await fetch(path, {
        method: method,
      }),
    );
  } catch (e) {
    return Err(e);
  }
}
