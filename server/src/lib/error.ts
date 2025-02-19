import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// expected error
export function error(reason: string, code: ContentfulStatusCode): never {
  throw new HTTPException(code, { message: reason });
}
