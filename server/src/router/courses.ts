import express, { Request, Response } from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourseDayPeriods,
  updateCourse,
} from "../database/courses";
import { Day } from "@prisma/client";

const router = express.Router();

function isDay(value: string): value is Day {
  return value in Day;
}

// コースの取得エンドポイント
router.get("/:courseId", async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await getCourse(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ id: course.id, name: course.name });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

router.get("/day/:day/period/:period", async (req: Request, res: Response) => {
  const { day, period } = req.params;

  if (isDay(day) === false) {
    return res.status(400).json({ error: "Invalid day" });
  }

  try {
    const courseDayPeriods = await getCourseDayPeriods({
      period: Number(period),
      day,
    });
    const courses = courseDayPeriods.map(
      (courseDayPeriod) => courseDayPeriod.course,
    );
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by day period:", error);
    res.status(500).json({ error: "Failed to fetch courses by day period" });
  }
});

// コースの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  const { id, name } = req.body;
  try {
    const newCourse = await createCourse(id, name);
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
      courseId: courseId,
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
    await deleteCourse(courseId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

export default router;
