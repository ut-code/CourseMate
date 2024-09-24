import { afterAll, beforeAll, expect, test } from "bun:test";
import type { Server } from "node:http";
import { main } from "../server/src/index";

let server: Server;

beforeAll(() => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (DATABASE_URL !== "postgres://user:password@localhost:5432/database") {
    console.log(
      "SAFETY GUARD: test must be run via `make test`, otherwise it might break dev/prod database",
    );
    throw new Error(`got: \`${DATABASE_URL}\``);
  }
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

test("/users/exists", async () => {
  const res = await fetch("localhost:3000/users/exists/abc101");
  expect(await res.text()).toBe("nothing");
  expect(res.status).toBe(200);
  const res2 = await fetch("localhost:3000/users/exists/not-there");
  expect(res2.status).toBe(404);
});
