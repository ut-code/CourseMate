import { beforeAll, expect, test } from "bun:test";
import { assertLocalDB } from "../load-env";
import * as interest from "./interest";

beforeAll(assertLocalDB);

test("list", async () => {
  expect(await interest.all()).toSatisfy(() => true);
});

test("get by user id", async () => {
  expect(await interest.of(101)).toEqual([
    { id: 1, group: "Computer Science", name: "型システム" },
    { id: 2, group: "Computer Science", name: "機械学習" },
    { id: 3, group: "Computer Science", name: "CPU アーキテクチャ" },
  ]);
});
