import { error } from "common/lib/panic";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import * as interest from "../database/interest";
import { getUserId } from "../firebase/auth/db";

const router = express.Router();

router.get("/userId/:userId", async (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.userId);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  try {
    const subjects = await interest.of(userId);
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects by userId:", error);
    res.status(500).json({ error: "Failed to fetch subjects by userId" });
  }
});

router.get("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const subjects = await interest.of(userId);
  res.status(200).json(subjects);
});

router.post("/", async (req: Request, res: Response) => {
  const { name } = z.object({ name: z.string() }).parse(req.body);
  const newSubject = await interest.create(name);
  res.status(201).json(newSubject);
});

router.patch("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { subjectId } = z.object({ subjectId: z.number() }).parse(req.body);
  const newSubject = await interest.get(subjectId);
  if (!newSubject) error("subject not found", 404);
  const updatedSubjects = await interest.add(userId, subjectId);
  res.status(200).json(updatedSubjects);
});

router.delete("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { subjectId } = z.object({ subjectId: z.number() }).parse(req.body);
  const updatedSubjects = await interest.remove(userId, subjectId);
  res.status(200).json(updatedSubjects);
});

router.put("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { subjectIds } = z
    .object({ subjectIds: z.array(z.number()) })
    .parse(req.body);
  if (!Array.isArray(subjectIds)) {
    return res.status(400).json({ error: "subjectIds must be an array" });
  }
  try {
    const newSubjects = await Promise.all(
      subjectIds.map((id) => interest.get(id)),
    );
    if (newSubjects.some((s) => !s)) {
      return res.status(404).json({ error: "Subject not found" });
    }
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
  try {
    const updatedSubjects = await interest.updateMultipleWithTransaction(
      userId,
      subjectIds,
    );
    res.status(200).json(updatedSubjects);
  } catch (error) {
    console.error("Error updating subjects:", error);
    res.status(500).json({ error: "Failed to update subjects" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const subjects = await interest.all();
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

export default router;
