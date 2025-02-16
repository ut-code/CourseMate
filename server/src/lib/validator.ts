import { zValidator } from "@hono/zod-validator";
import { type Schema, z } from "zod";

export function json<T extends Schema>(schema: T) {
  return zValidator("json", schema);
}

export function param<T extends Record<string, Schema>>(schema: T) {
  return zValidator("param", z.object(schema));
}
export function query<T extends Record<string, Schema>>(schema: T) {
  return zValidator("query", z.object(schema));
}

export default {
  json,
  param,
};
