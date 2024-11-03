import type { Course, CourseID, Day } from "../../common/types";
import { credFetch } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";

// TODO: migrate to safe functions

/**
 * 指定したユーザーが履修している講義をすべて取得する
 */
export async function getCoursesByUserId(userId: number): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.coursesUserId(userId));
  return res.json();
}

/**
 * 自身の講義（自身が履修している講義）をすべて取得する
 */
export async function getMyCourses(): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.coursesMine);
  return res.json();
}

/**
 * ある曜限のすべての講義を取得する
 */
export async function getCoursesByDayAndPeriod(
  day: Day,
  period: number,
): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.coursesDayPeriod(day, period));
  return res.json();
}

/**
// FIXME: remove this function and use useMyCourses() from cache instead.
 * 指定した講義と曜限が重複している自身の講義を取得する。
 * @param courseId 指定する講義のID
 * @returns `courseId` で指定した講義と曜限が重複している講義
 */
export async function getMyCoursesOverlapWith(
  courseId: CourseID,
): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.coursesMineOverlaps(courseId));
  return res.json();
}

/**
 * 新たな講義を履修する。既に履修している講義と曜限が重複している場合は、既存の講義を削除して履修する。
 * @param courseId 新たに履修する講義のID
 * @returns 更新後の自身が履修している講義
 */
export async function addMyCourse(courseId: CourseID): Promise<Course[]> {
  const res = await credFetch("PATCH", endpoints.coursesMine, {
    courseId,
  });
  return res.json();
}

/**
 * 講義の履修を削除する。
 * @param courseId 削除する講義のID
 * @returns 更新後のすべての講義情報
 */
export async function deleteMyCourse(courseId: CourseID): Promise<Course[]> {
  const res = await credFetch("DELETE", endpoints.coursesMine, { courseId });
  return res.json();
}

export default {
  getCoursesByUserId,
  getMyCourses,
  getCoursesByDayAndPeriod,
  addMyCourse,
  deleteMyCourse,
};
