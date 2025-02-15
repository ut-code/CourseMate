import { DaySchema, PeriodSchema } from "common/zod/schemas";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import {
  getCourseByCourseId,
  getCourseByDayPeriodAndUserId,
  getCoursesByDayAndPeriod,
  getCoursesByUserId,
} from "../database/courses";
import { createEnrollment, deleteEnrollment } from "../database/enrollments";
import { getUserId } from "../firebase/auth/db";

const router = express.Router();

// ある曜限に存在する全ての講義を取得
router.get("/day-period", async (req: Request, res: Response) => {
  const day = DaySchema.parse(req.query.day);
  // TODO: as の使用をやめ、Request 型を適切に拡張する https://stackoverflow.com/questions/63538665/how-to-type-request-query-in-express-using-typescript
  const period = PeriodSchema.parse(
    Number.parseInt(req.query.period as string),
  );

  const courses = await getCoursesByDayAndPeriod(day, period);
  res.status(200).json(courses);
});

// 特定のユーザが履修している講義を取得
router.get("/userId/:userId", async (req: Request, res: Response) => {
  const userId =
    Number.parseInt(req.params.userId) ??
    res.status(400).json({ error: "Invalid userId" });

  const courses = await getCoursesByUserId(userId);
  res.status(200).json(courses);
});

// 自分が履修している講義を取得
router.get("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const courses = await getCoursesByUserId(userId);
  return res.status(200).json(courses);
});

// ある講義と重複している自分の講義を取得
router.get("/mine/overlaps/:courseId", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const targetCourse = await getCourseByCourseId(req.params.courseId);
  const overlappingCourses = await Promise.all(
    targetCourse.slots.map(
      async (slot) =>
        await getCourseByDayPeriodAndUserId(slot.day, slot.period, userId),
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
});

// 自分の講義を編集
router.patch("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { courseId } = z.object({ courseId: z.string() }).parse(req.body);
  const updatedCourses = await createEnrollment(courseId, userId);
  res.status(200).json(updatedCourses);
});

// 自分の講義を削除
router.delete("/mine", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { courseId } = z.object({ courseId: z.string() }).parse(req.body);
  const updatedCourses = await deleteEnrollment(userId, courseId);
  res.status(200).json(updatedCourses);
});

export default router;
