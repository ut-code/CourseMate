import type { Course, Day, UserID } from "common/types";
import { error } from "../lib/error";
import { prisma } from "./client";

export async function getCourseByCourseId(courseId: string): Promise<Course> {
  return (
    (await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        slots: true,
      },
    })) ?? error("course not found", 404)
  );
}

/**
 * `userId` のユーザが履修している講義を取得
 */
export async function getCoursesByUserId(userId: UserID): Promise<Course[]> {
  return await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          userId,
        },
      },
    },
    include: {
      slots: true,
    },
  });
}

/**
 * `userId` のユーザが `day` 曜 `period` 限に履修している講義を取得
 */
export async function getCourseByDayPeriodAndUserId(
  day: Day,
  period: number,
  userId: UserID,
): Promise<Course | null> {
  // TODO: findUnique で取れるような制約を掛ける
  return await prisma.course.findFirst({
    where: {
      enrollments: {
        some: {
          userId,
        },
      },
      slots: {
        some: {
          day,
          period,
        },
      },
    },
    include: {
      slots: true,
    },
  });
}

/**
 * `day` 曜 `period` 限に存在するすべての講義を取得
 */
export async function getCoursesByDayAndPeriod(
  day: Day,
  period: number,
): Promise<Course[]> {
  return await prisma.course.findMany({
    where: {
      slots: {
        some: {
          day,
          period,
        },
      },
    },
    include: {
      slots: true,
    },
  });
}
