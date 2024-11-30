import type { Day } from "common/types";
import { DaySchema, PeriodSchema } from "common/zod/schemas";
import express, { type Request, type Response } from "express";
import {
  getCourseByCourseId,
  getCourseByDayPeriodAndUserId,
  getCoursesByDayAndPeriod,
  getCoursesByUserId,
} from "../database/courses";
import { createEnrollment, deleteEnrollment } from "../database/enrollments";
import { safeGetUserId } from "../firebase/auth/db";

const router = express.Router();

function isDay(value: string): value is Day {
  return DaySchema.safeParse(value).success;
}

// ある曜限に存在する全ての講義を取得
router.get("/day-period", async (req: Request, res: Response) => {
  const day = DaySchema.safeParse(req.query.day);
  // TODO: as の使用をやめ、Request 型を適切に拡張する https://stackoverflow.com/questions/63538665/how-to-type-request-query-in-express-using-typescript
  const period = PeriodSchema.safeParse(
    Number.parseInt(req.query.period as string),
  );

  if (!day.success || !period.success || !isDay(day.data)) {
    return res.status(400).json({ error: "Invalid day" });
  }

  try {
    const courses = await getCoursesByDayAndPeriod(day.data, period.data);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by day and period:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch courses by day and period" });
  }
});

// 特定のユーザが履修している講義を取得
router.get("/userId/:userId", async (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.userId);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const courses = await getCoursesByUserId(userId);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by userId:", error);
    res.status(500).json({ error: "Failed to fetch courses by userId" });
  }
});

// 自分が履修している講義を取得
router.get("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");

  try {
    const courses = await getCoursesByUserId(userId.value);
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ある講義と重複している自分の講義を取得
router.get("/mine/overlaps/:courseId", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");

  try {
    const targetCourse = await getCourseByCourseId(req.params.courseId);
    if (!targetCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    const overlappingCourses = await Promise.all(
      targetCourse.slots.map(
        async (slot) =>
          await getCourseByDayPeriodAndUserId(
            slot.day,
            slot.period,
            userId.value,
          ),
      ),
    );
    const filteredOverlappingCourses = overlappingCourses.filter(
      (course) => course !== null,
    );
    const uniqueFilteredOverlappingCourses = filteredOverlappingCourses.filter(
      (course, index, self) =>
        self.findIndex((c) => c?.id === course?.id) === index,
    ); // id の重複を排除
    res.status(200).json(uniqueFilteredOverlappingCourses);
  } catch (error) {
    console.error("Error fetching overlapping courses:", error);
    res.status(500).json({ error: "Failed to fetch overlapping courses" });
  }
});

// 自分の講義を編集
router.patch("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  const { courseId } = req.body;
  // 指定された講義の存在確認
  try {
    const newCourse = await getCourseByCourseId(courseId);
    if (!newCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
  try {
    const updatedCourses = await createEnrollment(courseId, userId.value);
    res.status(200).json(updatedCourses);
  } catch (error) {
    console.error("Error updating courses:", error);
    res.status(500).json({ error: "Failed to update courses" });
  }
});

// 自分の講義を削除
router.delete("/mine", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");
  const { courseId } = req.body;
  // 指定された講義の存在確認
  try {
    const newCourse = await getCourseByCourseId(courseId);
    if (!newCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
  try {
    const updatedCourses = await deleteEnrollment(userId.value, courseId);
    res.status(200).json(updatedCourses);
  } catch (error) {
    console.error("Error deleting courses:", error);
    res.status(500).json({ error: "Failed to delete courses" });
  }
});

export default router;
