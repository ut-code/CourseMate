import { beforeAll, expect, test } from "bun:test";
import { assertLocalDB } from "../../load-env";
import { recommendedTo } from "./recommendation";

beforeAll(() => {
  assertLocalDB();
});

test("recommendation engine", async () => {
  const usersFor101 = await recommendedTo(101, 5, 0);
  if (!usersFor101.ok) throw console.error(usersFor101.error);
  expect(usersFor101.value.map((entry) => entry.u.id)).toEqual([102, 103]);

  const usersFor102 = await recommendedTo(102, 5, 0);
  if (!usersFor102.ok) throw console.error(usersFor102.error);
  expect(usersFor102.value.map((entry) => entry.u.id)).toEqual([103, 101]);

  const usersFor103 = await recommendedTo(103, 5, 0);
  if (!usersFor103.ok) throw console.error(usersFor103.error);
  expect(usersFor103.value.map((entry) => entry.u.id)).toEqual([102, 101]);
});
