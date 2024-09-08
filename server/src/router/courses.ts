import express, { Request, Response } from "express";
import { getCourseByCourseId, getCourseDayPeriods } from "../database/courses";
import { Day } from "@prisma/client";

const router = express.Router();

function isDay(value: string): value is Day {
  return value in Day;
}

router.get("/:courseId", async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { includeDayPeriods } = req.query;
  try {
    const course = await getCourseByCourseId(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (includeDayPeriods) {
      return res.status(200).json(course);
    }
    return res.status(200).json({ id: course.id, name: course.name });
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
    // FIXME: course を直接クエリするようにする
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

export default router;
