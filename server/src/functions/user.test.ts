import { beforeAll, expect, test } from "bun:test";
import { getAllUsers, getUser, getUserByID, userExists } from "./user";

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
  expect(result.body).toSatisfy((s) => s.length === 3);
  expect(result.body).toSatisfy(
    (s) =>
      typeof s !== "string" && s.some((person) => person.name === "田中太郎"),
  );
});

test("get user", async () => {
  const result = await getUser("abc101");
  expect(result.code).toBe(200);
  expect(result.body).toSatisfy(
    (person) => typeof person !== "string" && person.name === "田中太郎",
  );
});

test("get user by id", async () => {
  const result = await getUserByID(101);
  expect(result.code).toBe(200);
  expect(result.ok).toBe(true);
  expect(result.body).toSatisfy(
    (person) => typeof person !== "string" && person.name === "田中太郎",
  );
});

test("user exists", async () => {
  const result = await userExists("abc101");
  expect(result.code).toBe(200);
});
