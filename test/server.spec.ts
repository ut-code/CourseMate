import { afterAll, beforeAll, expect, test } from "bun:test";
import type { Server } from "node:http";
import { main } from "../server/src/index";

let server: Server;

beforeAll(() => {
  server = main();
});

afterAll(() => {
  server.close();
});

test("server up", async () => {
  const res = await fetch("localhost:3000/");
  const text = await res.text();
  expect(text).toBe(`"Hello from Express!"`);
});
