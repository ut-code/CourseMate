import { Day, PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";

const prisma = new PrismaClient();

// コースの作成
export async function createCourse(id: string, name: string) {
  return await prisma.course.create({
    data: {
      id,
      name,
    },
  });
}

/**
 * 講義IDによって講義を取得
 */
export async function getCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      courseDayPeriods: true,
    },
  });
  return course;
}

// ユーザーの履修コースの取得
export async function getCoursesWithDayPeriodsByUser(userId: UserID) {
  const courses = await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          userId,
        },
      },
    },
    include: {
      courseDayPeriods: true,
    },
  });

  return courses;
}

/**
 * 曜限・ユーザによって講義を取得
 */
export async function getCourseByDayPeriodAndUser({
  day,
  period,
  userId,
}: {
  day: Day;
  period: number;
  userId: UserID;
}) {
  const course = await prisma.course.findFirst({
    where: {
      enrollments: {
        some: {
          userId,
        },
      },
      courseDayPeriods: {
        some: {
          day,
          period,
        },
      },
    },
    include: {
      courseDayPeriods: true,
    },
  });
  return course;
}

export async function getCourseDayPeriods({
  period,
  day,
}: {
  period: number;
  day: Day;
}) {
  return await prisma.courseDayPeriod.findMany({
    where: {
      period,
      day,
    },
    include: {
      course: true,
    },
  });
}

// コースの更新
export async function updateCourse({
  courseId,
  name,
}: {
  courseId: string;
  name: string;
}) {
  return await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      name,
    },
  });
}

// コースの削除
export async function deleteCourse(courseId: string) {
  return await prisma.course.delete({
    where: {
      id: courseId,
    },
  });
}
