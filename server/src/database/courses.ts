import { Day, PrismaClient } from "@prisma/client";
import { Course, UserID } from "../common/types";

const prisma = new PrismaClient();

/**
 * 講義IDによって講義を取得
 */
export async function getCourseByCourseId(
  courseId: string,
): Promise<Course | null> {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      slots: true,
    },
  });
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
export async function getCourseBySlotAndUserId(
  day: Day,
  period: number,
  userId: UserID,
): Promise<Course | null> {
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
export async function getCoursesBySlot(
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
