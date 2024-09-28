import { beforeAll, expect, test } from "bun:test";
import { assertLocalDB } from "../../load-env";
import { recommendedTo } from "./recommendation";

beforeAll(() => {
  assertLocalDB();
});

test("recommendation engine", async () => {
  const usersFor101 = await recommendedTo(101, 5, 0);
  expect(usersFor101).toEqual([102, 103]);

  const usersFor102 = await recommendedTo(102, 5, 0);
  expect(usersFor102).toEqual([103, 101]);

  const usersFor103 = await recommendedTo(103, 5, 0);
  expect(usersFor103).toEqual([102, 101]);
});
