import { beforeAll, expect, test } from "bun:test";
import { getAllUsers } from "./user";

beforeAll(() => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (DATABASE_URL !== "postgres://user:password@localhost:5432/database") {
    console.log(
      "SAFETY GUARD: test must be run via `make test`, otherwise it might break dev/prod database",
    );
    throw new Error(`got: \`${DATABASE_URL}\``);
  }
});

test("get all users", async () => {
  const result = await getAllUsers();
  expect(result.code).toBe(200);
  expect(result.body).toSatisfy((s) => s.length === 2);
  expect(result.body).toSatisfy(
    (s) => typeof s !== "string" && s[0].name === "田中太郎",
  );
});
