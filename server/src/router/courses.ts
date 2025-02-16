import { DaySchema, PeriodSchema } from "common/zod/schemas";
import { Hono } from "hono";
import { z } from "zod";
import {
  getCourseByCourseId,
  getCourseByDayPeriodAndUserId,
  getCoursesByDayAndPeriod,
  getCoursesByUserId,
} from "../database/courses";
import { createEnrollment, deleteEnrollment } from "../database/enrollments";
import { getUserId } from "../firebase/auth/db";
import { json, param, query } from "../lib/validator";

const router = new Hono();

// ある曜限に存在する全ての講義を取得
router.get(
  "/day-period",
  query({ day: DaySchema, period: PeriodSchema }),
  async (c) => {
    const { day, period } = c.req.valid("query");

    const courses = await getCoursesByDayAndPeriod(day, period);
    c.status(200);
    return c.json(courses);
  },
);

// 特定のユーザが履修している講義を取得
router.get(
  "/userId/:userId",
  param({ userId: z.coerce.number() }),
  async (c) => {
    const userId = c.req.valid("param").userId;
    const courses = await getCoursesByUserId(userId);
    c.status(200);
    return c.json(courses);
  },
);

// 自分が履修している講義を取得
router.get("/mine", async (c) => {
  const userId = await getUserId(c);
  const courses = await getCoursesByUserId(userId);
  c.status(200);
  return c.json(courses);
});

// ある講義と重複している自分の講義を取得
router.get(
  "/mine/overlaps/:courseId",
  param({ courseId: z.string() }),
  async (c) => {
    const userId = await getUserId(c);
    const targetCourse = await getCourseByCourseId(
      c.req.valid("param").courseId,
    );
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
    c.status(200);
    return c.json(uniqueFilteredOverlappingCourses);
  },
);

// 自分の講義を編集
router.patch("/mine", json(z.object({ courseId: z.string() })), async (c) => {
  const userId = await getUserId(c);
  const { courseId } = c.req.valid("json");
  const updatedCourses = await createEnrollment(courseId, userId);
  c.status(200);
  return c.json(updatedCourses);
});

// 自分の講義を削除
router.delete("/mine", json(z.object({ courseId: z.string() })), async (c) => {
  const userId = await getUserId(c);
  const { courseId } = c.req.valid("json");
  const updatedCourses = await deleteEnrollment(userId, courseId);
  c.status(200);
  return c.json(updatedCourses);
});

export default router;
