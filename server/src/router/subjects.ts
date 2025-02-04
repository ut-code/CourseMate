import express, { type Request, type Response } from "express";
import * as interest from "../database/interest";
import { safeGetUserId } from "../firebase/auth/db";

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
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  try {
    const subjects = await interest.of(userId.value);
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (typeof name !== "string") {
    return res.status(400).json({ error: "name must be a string" });
  }
  try {
    const newSubject = await interest.create(name);
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

router.patch("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  const { subjectId } = req.body;
  try {
    const newSubject = await interest.get(subjectId);
    if (!newSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
  try {
    const updatedSubjects = await interest.add(userId.value, subjectId);
    res.status(200).json(updatedSubjects);
  } catch (error) {
    console.error("Error updating subjects:", error);
    res.status(500).json({ error: "Failed to update subjects" });
  }
});

router.delete("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  const { subjectId } = req.body;
  try {
    const newSubject = await interest.get(subjectId);
    if (!newSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
  try {
    const updatedSubjects = await interest.remove(userId.value, subjectId);
    res.status(200).json(updatedSubjects);
  } catch (error) {
    console.error("Error deleting subjects:", error);
    res.status(500).json({ error: "Failed to delete subjects" });
  }
});

router.put("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  const { subjectIds } = req.body;
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
      userId.value,
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
