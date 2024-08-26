import { Day, Course, CourseDayPeriod } from "../common/types";
import endpoints from "./internal/endpoints";

// TODO: migrate to safe functions

export async function getMyCourses(): Promise<
  (Course & { courseDayPeriods: CourseDayPeriod[] })[]
> {
  const res = await fetch(endpoints.meCourses, {
    credentials: "include",
  });
  return res.json();
}

// 曜限を指定して講義情報を取得する
export async function getByDayPeriod({
  day,
  period,
}: {
  day: Day;
  period: number;
}): Promise<Course[]> {
  const res = await fetch(endpoints.coursesOnDayPeriod(day, period), {
    credentials: "include",
  });
  return res.json();
}

export async function modifyEnrollments({
  courseId,
  day,
  period,
}: CourseDayPeriod) {
  const res = await fetch(endpoints.meCourses, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
      day,
      period,
    }),
  });
  return res.json() as Promise<
    (Course & { courseDayPeriods: CourseDayPeriod[] })[]
  >;
}

export default {
  getMyCourses,
  getByDayPeriod,
};
