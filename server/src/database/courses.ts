import { Day, PrismaClient } from "@prisma/client";
import { Course, UserID } from "../common/types";

const prisma = new PrismaClient();

/**
 * 講義IDによって講義を取得
 */
export async function getCourseByCourseId(courseId: string) {
  const course: Course | null = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      slots: true,
    },
  });
  return course;
}

/**
 * `userId` のユーザが履修している講義を取得
 */
export async function getCoursesByUserId(userId: UserID) {
  const courses: Course[] = await prisma.course.findMany({
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
  return courses;
}

/**
 * `userId` のユーザが `day` 曜 `period` 限に履修している講義を取得
 */
export async function getCourseBySlotAndUserId(
  day: Day,
  period: number,
  userId: UserID,
) {
  const course: Course | null = await prisma.course.findFirst({
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
  return course;
}

// FIXME: 不要なら消す
export async function getCourseDayPeriods({
  period,
  day,
}: {
  period: number;
  day: Day;
}) {
  return await prisma.slot.findMany({
    where: {
      period,
      day,
    },
    include: {
      course: true,
    },
  });
}
