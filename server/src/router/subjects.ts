import { Hono } from "hono";
import { z } from "zod";
import * as interest from "../database/interest";
import { getUserId } from "../firebase/auth/db";
import { error } from "../lib/error";
import { json, param } from "../lib/validator";

const router = new Hono();

router.get(
  "/userId/:userId",
  param({ userId: z.coerce.number() }),
  async (c) => {
    const userId = c.req.valid("param").userId;
    const subjects = await interest.of(userId);
    c.status(200);
    return c.json(subjects);
  },
);

router.get("/mine", async (c) => {
  const userId = await getUserId(c);
  const subjects = await interest.of(userId);
  c.status(200);
  return c.json(subjects);
});

router.post("/", json(z.object({ name: z.string() })), async (c) => {
  const { name } = c.req.valid("json");
  const newSubject = await interest.create(name);
  c.status(201);
  return c.json(newSubject);
});

router.patch("/mine", json(z.object({ subjectId: z.number() })), async (c) => {
  const userId = await getUserId(c);
  const { subjectId } = c.req.valid("json");
  const newSubject = await interest.get(subjectId);
  if (!newSubject) error("subject not found", 404);
  const updatedSubjects = await interest.add(userId, subjectId);
  c.status(200);
  return c.json(updatedSubjects);
});

router.delete("/mine", json(z.object({ subjectId: z.number() })), async (c) => {
  const userId = await getUserId(c);
  const { subjectId } = c.req.valid("json");
  const updatedSubjects = await interest.remove(userId, subjectId);
  c.status(200);
  return c.json(updatedSubjects);
});

router.put(
  "/mine",
  json(z.object({ subjectIds: z.array(z.number()) })),
  async (c) => {
    const userId = await getUserId(c);
    const { subjectIds } = c.req.valid("json");
    const newSubjects = await Promise.all(
      subjectIds.map((id) => interest.get(id)),
    );
    if (newSubjects.some((s) => !s)) {
      return error("Subject not found", 404);
    }
    await interest.updateMultipleWithTransaction(userId, subjectIds);
    c.status(200);
    return c.json({});
  },
);

router.get("/all", async (c) => {
  const subjects = await interest.all();
  c.status(200);
  return c.json(subjects);
});

export default router;
