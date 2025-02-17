import { beforeAll, expect, test } from "bun:test";
import { GET, PUT } from "./fetcher";

const MOCK_TOKEN = "I_AM_abc101";

beforeAll(() => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (DATABASE_URL !== "postgres://user:password@localhost:5432/database") {
    console.log(
      "SAFETY GUARD: test must be run via `make test`, otherwise it might break dev/prod database",
    );
    throw new Error(`got: \`${DATABASE_URL}\``);
  }
});

test("server up", async () => {
  const res = await GET("/");
  const text = await res.text();
  expect(text).toBe("Hello from Hono 🔥");
});

test("/users/exists", async () => {
  let res = await GET("/users/exists/abc101");
  expect(res.status).toBe(200);
  res = await GET("/users/exists/not-there");
  expect(res.status).toBe(404);
});

test("basic auth", async () => {
  let res = await GET("/users/me");
  expect(res.status).toBe(401);
  res = await GET(`/users/me?token=${MOCK_TOKEN}`);
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.name).toBe("田中太郎");
});

test("send request", async () => {
  // should error in auth
  let res = await GET("/users/pending/from-me");
  expect(res.status).toBe(401);
  res = await PUT("/requests/send/102");
  expect(res.status).toBe(401);

  res = await GET(`/users/pending/from-me?token=${MOCK_TOKEN}`);
  expect(res.status).toBe(200);
  expect(await res.json()).toSatisfy((s) => s.length === 0);
  // starting actual request

  res = await PUT(`/requests/send/102?token=${MOCK_TOKEN}`);
  expect(res.status).toBe(201);

  res = await GET(`/users/pending/from-me?token=${MOCK_TOKEN}`);
  expect(await res.json()).toSatisfy(
    (s) => s.length === 1 && s[0].name === "山田花子",
  );
});
