import express, { Request, Response } from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
} from "../database/courses";

const router = express.Router();
// TODO: add zod
// コースの取得エンドポイント
router.get("/:courseId", async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await getCourse(parseInt(courseId));
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// コースの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCourse = await createCourse(name);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// コースの更新エンドポイント
router.put("/:courseId", async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const updatedCourse = await updateCourse({
      courseId: parseInt(courseId),
      name,
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// コースの削除エンドポイント
router.delete("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    await deleteCourse(parseInt(courseId));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

export default router;
