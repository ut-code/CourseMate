import { Day, Course, CourseDayPeriod, CourseID } from "../common/types";
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

/**
 *
 * @param courseId 新たに登録する講義のID
 * @returns 更新後のすべての講義情報
 */
export async function modifyEnrollments(courseId: CourseID) {
  const res = await fetch(endpoints.meCourses, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  });
  return res.json() as Promise<
    (Course & { courseDayPeriods: CourseDayPeriod[] })[]
  >;
}

/**
 *
 * @param courseId 削除する講義のID
 * @returns 更新後のすべての講義情報
 */
export async function deleteEnrollment(courseId: CourseID) {
  const res = await fetch(endpoints.meCourses, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  });
  return res.json() as Promise<
    (Course & { courseDayPeriods: CourseDayPeriod[] })[]
  >;
}

export default {
  getMyCourses,
  getByDayPeriod,
  modifyEnrollments,
  deleteEnrollment,
};
