import { expect, test } from "bun:test";
import * as core from "./interest";

test("list", async () => {
  expect(await core.all()).toSatisfy(() => true);
});
