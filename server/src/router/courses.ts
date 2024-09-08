import express, { Request, Response } from "express";
import {
  getCourseByCourseId,
  getCourseBySlotAndUserId,
  getCoursesBySlot,
  getCoursesByUserId,
} from "../database/courses";
import { Day } from "@prisma/client";
import { safeGetUserId } from "../firebase/auth/db";
import { createEnrollment, deleteEnrollment } from "../database/enrollments";

const router = express.Router();

function isDay(value: string): value is Day {
  return value in Day;
}

// 講義IDを指定して講義を取得
router.get("/id/:courseId", async (req: Request, res: Response) => {
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
    const courses = await getCoursesBySlot(day, parseInt(period));
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by day period:", error);
    res.status(500).json({ error: "Failed to fetch courses by day period" });
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
          await getCourseBySlotAndUserId(slot.day, slot.period, userId.value),
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
    const updatedCourses = await deleteEnrollment({
      courseId: courseId,
      userId: userId.value,
    });
    res.status(200).json(updatedCourses);
  } catch (error) {
    console.error("Error deleting courses:", error);
    res.status(500).json({ error: "Failed to delete courses" });
  }
});

export default router;
