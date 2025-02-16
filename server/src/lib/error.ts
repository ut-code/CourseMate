import { HTTPResponseError } from "hono/types";
// expected error
export function error(reason: string, code?: number): never {
  throw new HTTPResponseError(reason, { cause: code });
}
