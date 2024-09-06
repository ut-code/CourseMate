import { Day, Course, CourseDayPeriod, CourseID } from "../common/types";
import { credFetch } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";

// TODO: migrate to safe functions

export async function getMyCourses(): Promise<
  (Course & { courseDayPeriods: CourseDayPeriod[] })[]
> {
  const res = await credFetch("GET", endpoints.meCourses);
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
  const res = await credFetch("GET", endpoints.coursesOnDayPeriod(day, period));
  return res.json();
}

/**
 * 指定した講義と重複する講義を取得する
 */
export async function getOverlappingCourses(courseId: CourseID) {
  const res = await credFetch("GET", endpoints.meCoursesOverlaps(courseId));
  return res.json() as Promise<Course[]>;
}

/**
 *
 * @param courseId 新たに登録する講義のID
 * @returns 更新後のすべての講義情報
 */
export async function modifyEnrollments(courseId: CourseID) {
  const res = await credFetch("PATCH", endpoints.meCourses, {
    courseId,
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
  const res = await credFetch("DELETE", endpoints.meCourses, { courseId });
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
