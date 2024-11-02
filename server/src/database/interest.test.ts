import { beforeAll, expect, test } from "bun:test";
import { assertLocalDB } from "../load-env";
import * as interest from "./interest";

beforeAll(assertLocalDB);

test("list", async () => {
  const got = (await interest.all()).sort((a, b) => a.id - b.id);
  expect(got).toEqual([
    { id: 1, group: "Computer Science", name: "型システム" },
    { id: 2, group: "Computer Science", name: "機械学習" },
    { id: 3, group: "Computer Science", name: "CPU アーキテクチャ" },
    { id: 4, group: "Computer Science", name: "分散処理" },
    { id: 5, group: "Math", name: "Lean4" },
  ]);
});

test("get by user id", async () => {
  const got = (await interest.of(101)).sort((a, b) => a.id - b.id);
  expect(got).toEqual([
    { id: 1, group: "Computer Science", name: "型システム" },
    { id: 2, group: "Computer Science", name: "機械学習" },
    { id: 3, group: "Computer Science", name: "CPU アーキテクチャ" },
  ]);
});
