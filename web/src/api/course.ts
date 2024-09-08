import { Day, Course, CourseID } from "../common/types";
import { credFetch } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";

// TODO: migrate to safe functions

/**
 * 自身の講義（自身が履修している講義）をすべて取得する
 */
export async function getMyCourses(): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.meCourses);
  return res.json();
}

/**
 * ある曜限のすべての講義を取得する
 */
export async function getCoursesBySlot(
  day: Day,
  period: number,
): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.coursesBySlot(day, period));
  return res.json();
}

/**
 * 指定した講義と曜限が重複している自身の講義を取得する。
 * @param courseId 指定する講義のID
 * @returns `courseId` で指定した講義と曜限が重複している講義
 */
export async function getMyCoursesOverlapWith(
  courseId: CourseID,
): Promise<Course[]> {
  const res = await credFetch("GET", endpoints.meCoursesOverlaps(courseId));
  return res.json();
}

/**
 * 新たな講義を履修する。既に履修している講義と曜限が重複している場合は、既存の講義を削除して履修する。
 * @param courseId 新たに履修する講義のID
 * @returns 更新後の自身が履修している講義
 */
export async function addMyCourse(courseId: CourseID): Promise<Course[]> {
  const res = await credFetch("PATCH", endpoints.meCourses, {
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
  const res = await credFetch("DELETE", endpoints.meCourses, { courseId });
  return res.json();
}

export default {
  getMyCourses,
  getCoursesBySlot,
  addMyCourse,
  deleteMyCourse,
};
