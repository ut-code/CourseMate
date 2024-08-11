import express, { Request, Response } from "express";
import { CourseID } from "../common/types";
import { safeGetUserId } from "../firebase/auth/db";
import { updateEnrollments } from "../database/enrollments";

const router = express.Router();

// 履修情報の更新エンドポイント
router.put("/", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  // TODO: Typia
  const courseIds: CourseID[] = req.body;
  try {
    const updatedEnrollments = await updateEnrollments(id.value, courseIds);
    res.status(200).json(updatedEnrollments);
  } catch (error) {
    console.error("Error updating enrollments", error);
    res.status(500).json({ error: "Failed to update enrollments" });
  }
});

export default router;
